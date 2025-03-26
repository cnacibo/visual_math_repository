let ws = null;

async function openPresentation(presentationId) {
    //let ws;
    try {
        // ws = new WebSocket("wss://yourserver.com/ws/presentation/" + presentationId + "/");
        ws = new WebSocket("ws://" + window.location.host + "/ws/presentation/" + presentationId + "/");
        ws.onopen = () => {
            console.log("WebSocket подключен!!");
            ws.send(JSON.stringify({
                event: "presentation_started", id: presentationId
            }));
        };
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            alert("Ошибка подключения к презентации");
        };

        ws.onmessage = (event) => {
             const data = JSON.parse(event.data);
             console.log("WebSocket message received:", data);

             if (data.action === 'update_questionnaire_stats') {
                 console.log("сообщение о статистике");
                 try {
                     const message = JSON.parse(event.data);
                     updateQuestionnaireStats(message.slide_index, message.stats);
                 } catch (error) {
                     console.error("Ошибка обработки сообщения WebSocket:", error);
                 }
             }

        };
        ws.onclose = () => {
            console.log("WebSocket соединение закрыто");
        };

        // Отправляем запрос на сервер для получения данных о презентации
        const response = await fetch(`/presentations/api/${presentationId}/`);
        console.log('URL:', `/presentations/api/${presentationId}/`);
        console.log('Status:', response.status);
        console.log('Response:', response);

        // 2. Читаем данные ОДИН раз
        const presentationData = await response.json();
        console.log('Data:', presentationData);

        // 3. Проверяем статус ответа
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Презентация не найдена');
            } else {
                throw new Error(`Ошибка загрузки презентации: ${response.status}`);
            }
        }

        // 4. Проверяем наличие слайдов
        if (!presentationData.slides || presentationData.slides.length === 0) {
            alert('В этой презентации нет слайдов.');
            return;
        }
        globalSlides = presentationData.slides || [];
        currentPresentationId = presentationId;

        // Отображаем слайды с учетом роли
        alert("Начало показа презентации с id = " + presentationId + "!\n\nНе забудьте сообщить данный id студентам, чтобы они смогли зайти на вашу лекцию!")
        const isTeacher = true; // Предполагаем, что это преподаватель
        showSlideShow(globalSlides, isTeacher);

    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Не удалось загрузить презентацию: ${error.message}`);
        // Добавьте проверку перед закрытием
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
        ws.close();
    }
}

function showSlideShow(slides, isTeacher = true) {

    globalSlides = slides;
    console.log('Received slides:', slides);

    // Создаем контейнер для слайдов
    const slideShowContainer = document.createElement('div');
    slideShowContainer.id = 'slide-show-container';
    slideShowContainer.classList.add(isTeacher ? 'teacher-slides' : 'student-slides'); // Добавляем класс в зависимости от роли

    slideShowContainer.innerHTML = `
        <div id="slide-content"></div>
        <div class="slide-controls">
            <button onclick="closeSlideShow()">Закрыть</button>
            <button onclick="prevSlide()">Назад</button>
            <button onclick="nextSlide()">Вперед</button>
        </div>
    `;

    // Добавляем контейнер на страницу
    document.body.appendChild(slideShowContainer);
    document.body.style.overflow = 'hidden';
    // Отображаем первый слайд
    let currentSlideIndex = 0;

    // Функция для рендеринга слайда
    function renderSlide(index) {
        console.log(`Rendering slide ${index}`, slides[index]);
        const slide = slides[index];
        const slideContent = document.getElementById('slide-content');
        if (!slideContent) {
            console.error('Элемент slide-content не найден');
            return;
        }

         if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                action: "slide_changed",
                current_slide: index, // Текущий индекс слайда
                total_slides: slides.length,
            }));
        }

        let slideHtml = '';
        const cleanedContent = slide.content || '';

        // Обработка разных типов слайдов
        switch (slide.slide_type) {
            case 'test': // Проверочный слайд
                try {
                    // Если questions это строка "test", создаем пустой массив вопросов
                    const questionsData = slide.questions === "test" ? [] : slide.questions;
                    const questions = Array.isArray(questionsData) ? questionsData : []; // Убедимся, что questions - это массив
                    const exportButtonHtml = isTeacher ? `<button onclick="exportStatsToCSV(${index}, ${JSON.stringify(slide.questions).replace(/"/g, '&quot;')})">Экспорт в CSV</button>` : '';
                    slideHtml = `
                        <h2>Слайд ${index + 1} - Проверочный блок</h2>
                        ${exportButtonHtml}
                        ${renderQuestions(questions)}
                        ${slide.questions.questionImageUrl ? `<img src="${slide.questions.questionImageUrl}" class="slide-image">` : ''}        
                    `;
                } catch (e) {
                    slideHtml = `<div class="error">Ошибка: ${e.message}</div>`;
                }
                break;
            case 'questionnaire': // Вопросник
                try {
                    const questionData = slide.questions;
                    const statsButtonHtml = isTeacher ? `<button onclick="showQuestionnaireStats(${index})">Статистика ответов</button> 
                    <div id="questionnaire-stats-${index}" class="stats-container" style="display:none;"></div>` : 'Не удалось загрузить статистику';
                    slideHtml = `
                        <h2>Слайд ${index + 1} - Вопросник</h2>
                        ${statsButtonHtml}
                        <div class="questionnaire">
                            <div class="question">
                                <div class="math-content">${renderKatexInText(questionData.question || "Вопрос не указан")}</div>
                            </div>
                            <div class="answers">
                                ${questionData.answers.map((answer, i) => `
                                    <div class="answer ${answer.isCorrect ? 'correct' : ''}">
                                        <div class="math-content">${renderKatexInText(answer.text)}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ${slide.questions.questionImageUrl ? `<img src="${slide.questions.questionImageUrl}" class="slide-image">` : ''}
                    `;
                } catch (e) {
                    console.error('Ошибка парсинга вопросника:', e);
                    slideHtml = '<div class="error">Ошибка отображения вопросника</div>';
                }
                break;

            case 'text': // Текстовый слайд
            default:
                slideHtml = `
                    <h2>Слайд ${index + 1}</h2>
                    <div class="math-content">${renderKatexInText(cleanedContent || "Нет текста")}</div>
                    ${slide.image ? `<img src="${slide.image}" class="slide-image">` : ''}
                `;
        }

        // Вставляем HTML в контейнер
        slideContent.innerHTML = slideHtml;

        // Рендерим формулы после вставки HTML
        if (window.renderMathInElement) {
            renderMathInElement(slideContent, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ]
            });
        }
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ event: "slide_changed", slide: index + 1 }));
        }
    }
    function renderQuestions(questions) {
    return questions.map((q, qIndex) => {
        const questionData = q.questionData || {}; // Извлекаем questionData
        return `
            <div class="question-block">
                <h3>Вопрос ${qIndex + 1}</h3>
                <div class="math-content">${renderKatexInText(questionData.question || '')}</div>
                ${questionData.questionImageUrl ? `<img src="${questionData.questionImageUrl}" class="question-image">` : ''}
                <div class="answers">
                    ${questionData.answers.map((answer, aIndex) => `
                        <div class="answer ${answer.isCorrect ? 'correct' : ''}">
                            <div class="math-content">${renderKatexInText(answer.text)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}
    // Функции для навигации
    window.prevSlide = () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            renderSlide(currentSlideIndex);
            if (ws && ws.readyState === WebSocket.OPEN) {
            // Отправляем АБСОЛЮТНЫЙ индекс слайда
            ws.send(JSON.stringify({
                action: "change_slide",
                slide: currentSlideIndex
            }));
        }
        }
    };
    window.nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            renderSlide(currentSlideIndex);
            if (ws && ws.readyState === WebSocket.OPEN) {
            // Отправляем АБСОЛЮТНЫЙ индекс слайда
                ws.send(JSON.stringify({
                    action: "change_slide",
                    slide: currentSlideIndex
                }));
            }
        }
    };
    window.closeSlideShow = () => {
    // Отправляем сообщение о завершении презентации
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            action: "end_presentation"
        }));
        ws.close();
    }
    // Закрываем презентацию локально
    const slideShowContainer = document.getElementById('slide-show-container');
    if (slideShowContainer) {
        document.body.removeChild(slideShowContainer);
    }
    document.body.style.overflow = 'auto';
};
    // Рендерим первый слайд
    renderSlide(currentSlideIndex);
}
