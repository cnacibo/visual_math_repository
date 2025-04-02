let studentWs = null;

function showJoinForm() {
    document.getElementById("join-form").classList.remove("hidden");
}

function closeJoinForm() {
    document.getElementById("join-form").classList.add("hidden");
    if (studentWs) {
        studentWs.close();
    }
}
function joinPresentation(studentId) {
    // let studentWs;
    const presentationId = document.getElementById("presentation-id").value.trim();
    currentPresentationId = presentationId;
    if (!presentationId) {
        alert("Введите ID презентации!");
        return;
    }
    if (!/^\d+$/.test(presentationId)) {
        alert("ID презентации должен содержать только цифры!");
        return;
    }
    fetch(`/presentations/check_presentation/${presentationId}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Http error! status: ${response.status}`)
            }
            return response.json();
        })
        .then(presentationData => {
            if (!presentationData.exists) {
                alert("Презентация с таким ID не существует!");
                return;
            }

            if (!presentationData.is_active) {
                alert("Преподаватель еще не начал показывать эту презентацию.");
                return;
            }
            // 2. Сохраняем слайды в глобальную переменную
            globalSlides = presentationData.slides;

            studentWs = new WebSocket(`ws://${window.location.host}/ws/presentation/${presentationId}/`);

            // Удалите второй обработчик onmessage и оставьте только этот:
            studentWs.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("WebSocket message received:", data);

                if (data.type === 'init') {
                    globalSlides = data.slides || [];
                    renderStudentSlide(0, studentId);
                }
                else if (data.action === 'slide_changed') {
                    globalSlides = data.slides || []; // Обновляем слайды
                    renderStudentSlide(data.current_slide, studentId);

                    console.log("Current slide index:", data.current_slide);
                    console.log("Total slides:", data.total_slides);
                }
                else if (data.action === 'end_presentation') {
                    alert("Презентация завершена!");
                    closeStudentPresentation();
                } else if (data.action === 'presentation_ended') {
                    // Закрываем презентацию или показываем сообщение
                    alert('Презентация завершена преподавателем!');
                    // Дополнительные действия, например:
                    window.location.href = '/home/'; // Перенаправление
                    // Или скрытие интерфейса презентации
                }
            };
            studentWs.onopen = () => {
                console.log("WebSocket открыт: Студент");
                //studentWs.send(JSON.stringify({ action: "get_current_slide" }));
                document.getElementById("join-form").classList.add("hidden");
                document.getElementById("student-slide-show").classList.remove("hidden");
            };

            studentWs.onerror = (error) => {
                console.error("WebSocket error:", error);
                alert("Ошибка подключения к презентации");
            };

            studentWs.onerror = (error) => console.error("WebSocket ошибка:", error);
            studentWs.onclose = () => console.log("WebSocket закрыт");
        })

        .catch(error => {
            console.error("Ошибка проверки презентации:", error);
            // Формируем безопасное сообщение об ошибке
            const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
            alert("Не удалось найти презентацию!");

            // Добавляем проверку перед закрытием
            if (studentWs && studentWs.readyState === WebSocket.OPEN) {
                studentWs.close();
            }
        });

}
function closeStudentPresentation() {
    if (studentWs && studentWs.readyState === WebSocket.OPEN) {
        studentWs.close();
    }
    const slideShow = document.getElementById('student-slide-show');
    if (slideShow) {
        slideShow.classList.add('hidden');
    }
    document.body.style.overflow = 'auto'; // Восстанавливаем скролл
    //alert("Презентация завершена.");
}


function renderStudentSlide(index, studentId) {
    if (!Array.isArray(globalSlides) || globalSlides.length === 0) {
        console.error("Слайды не загружены");
        return;
    }

    const safeIndex = Math.max(0, Math.min(index, globalSlides.length - 1));
    const slide = globalSlides[safeIndex];

    const serverUrl = "http://192.168.1.137:8000";
    let imageUrl = slide.image;
    if (imageUrl.startsWith('/media')) {
        imageUrl = imageUrl.slice(6); // Убираем '/media' из начала пути
    }
    let slideHtml = '';

    // Обработка разных типов слайдов
    switch (slide.slide_type) {
        case 'test': // Проверочный слайд
            try {
                const questionsData = slide.questions === "test" ? [] : slide.questions;
                const questions = Array.isArray(questionsData) ? questionsData : [];
                const imageUrl = serverUrl + slide.questions.questionImageUrl;
                slideHtml = `
                    <h2>Слайд ${safeIndex + 1} - Проверочный блок</h2>
                    ${render_Questions(safeIndex, questions, 'test', studentId)}
                    ${slide.questions.questionImageUrl ? `<img src="${imageUrl}" class="slide-image">` : ''}
                `;
            } catch (e) {
                slideHtml = `<div class="error">Ошибка: ${e.message}</div>`;
            }
            break;

        case 'questionnaire': // Вопросник
            try {
                const questionData = slide.questions;
                const imageUrl = serverUrl + slide.questions.questionImageUrl;
                slideHtml = `
                    <h2>Слайд ${safeIndex + 1} - Вопросник</h2>
                    <div class="questionnaire">
                        <div class="question">
                            <div class="math-content">${renderKatexInText(questionData.question || "Вопрос не указан")}</div>
                        </div>
                        <div class="answers">
                            ${questionData.answers.map((answer, i) => `
                                <div class="answer" 
                                     onclick="handleAnswerSelection(${safeIndex}, 0, ${i}, ${questionData.isMultiple || false}, ${questionData.answers.length}, ${studentId})"
                                     data-selected="false"
                                     data-index="${i}"
                                     data-slide="${safeIndex}"
                                     data-question="0">
                                    <div class="math-content">${answer.text}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ${slide.questions.questionImageUrl ? `<img src="${imageUrl}" class="slide-image">` : ''}
                `;
            } catch (e) {
                console.error('Ошибка парсинга вопросника:', e);
                slideHtml = '<div class="error">Ошибка отображения вопросника</div>';
            }
            break;

        case 'text': // Текстовый слайд
            const imageUrltext = serverUrl + imageUrl;
            console.log('Image URL:', imageUrltext);
            slideHtml = `
                <h2>Слайд ${safeIndex + 1}</h2>
                <div class="math-content">${renderKatexInText(slide.content || "Нет текста")}</div>
                ${imageUrl ? `<img src="${imageUrltext}" class="slide-image">` : ''}
            `;
            break;

        default:
           slideHtml = `
                <h2>Слайд ${safeIndex + 1}</h2>
                <div class="math-content">${renderKatexInText(slide.content || "Нет текста")}</div>
           `;
           break;
    }

    document.getElementById("student-slide-content").innerHTML = slideHtml;

    // Рендер математических формул
    if (window.renderMathInElement) {
        renderMathInElement(document.getElementById("student-slide-content"), {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ]
        });
    }
}

function render_Questions(slideIndex, questions, type, studentId) {
    return questions.map((q, qIndex) => {
        const questionData = q.questionData || {};
        const isMultiple = questionData.isMultiple || false;
        return `
            <div class="question-block">
                <h3>Вопрос ${qIndex + 1}</h3>
                <div class="math-content">${renderKatexInText(questionData.question || '')}</div>
                ${questionData.questionImageUrl ? `<img src="${questionData.questionImageUrl}" class="question-image">` : ''}
                <div class="answers">
                    ${(questionData.answers || []).map((answer, aIndex) => {
                        // Проверяем был ли ответ уже выбран
                        const isSelected = answerStats[slideIndex]?.questions?.[qIndex]?.answers?.[aIndex] === 1;
                        return `
                        <div class="answer" 
                             onclick="handleAnswerSelection(${slideIndex}, ${qIndex}, ${aIndex}, ${isMultiple}, ${questionData.answers.length}, '${studentId}')"
                             data-selected="${isSelected}"
                             data-index="${aIndex}"
                             data-slide="${slideIndex}"
                             data-question="${qIndex}">
                            <div class="math-content">${renderKatexInText(answer.text)}</div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}
function handleAnswerSelection(slideIndex, questionIndex, answerIndex, isMultipleChoice = false, answersNumber, studentId) {
    if (!answerStats[slideIndex]) {
        answerStats[slideIndex] = {
            slide_type: 'questionnaire',
            questions: {}
        };
    }
    // Более точный селектор с учетом slideIndex и questionIndex
    const answerElement = document.querySelector(`.answer[data-slide="${slideIndex}"][data-question="${questionIndex}"][data-index="${answerIndex}"]`);

    if (!answerStats[slideIndex].questions[questionIndex]) {
        answerStats[slideIndex].questions[questionIndex] = {
            answers: new Array(answersNumber).fill(0),
            totalAnswers: 0
        };
    }
    const questionData = answerStats[slideIndex].questions[questionIndex];
    const isSelected = answerElement.getAttribute('data-selected') === 'true';

    if (isMultipleChoice) {
        // Для множественного выбора - переключаем только текущий ответ
        answerElement.setAttribute('data-selected', !isSelected);
        answerElement.classList.toggle('multiple');
    } else {
        // Для одиночного выбора - снимаем выделение только в текущем вопросе
        document.querySelectorAll(`.answer[data-slide="${slideIndex}"][data-question="${questionIndex}"]`).forEach(el => {
            el.setAttribute('data-selected', 'false');
            el.classList.remove('multiple');
        });
        answerElement.setAttribute('data-selected', 'true');
    }

    // Остальная логика остается без изменений
    if (isMultipleChoice) {
        questionData.answers[answerIndex] = isSelected ? 0 : 1;
    } else {
        questionData.answers.fill(0);
        questionData.answers[answerIndex] = 1;
    }

    questionData.totalAnswers = questionData.answers.reduce((sum, val) => sum + val, 0);

    if (!answerStats[slideIndex].students) {
        answerStats[slideIndex].students = {};
    }
    if (!answerStats[slideIndex].students[studentId]) {
        answerStats[slideIndex].students[studentId] = {
            questions: {}
        };
    }

    answerStats[slideIndex].students[studentId].questions[questionIndex] = {
        answers: [...questionData.answers],
        totalAnswers: questionData.totalAnswers
    };

    sendAnswerStats(slideIndex);
}
function sendAnswerStats(slideIndex) {
    if (studentWs && studentWs.readyState === WebSocket.OPEN) {
        console.log("отправление статистики ");
        studentWs.send(JSON.stringify({
            action: "update_questionnaire_stats",
            presentation_id: currentPresentationId,
            slide_index: slideIndex,
            stats: answerStats[slideIndex]
        }));
    } else {
        console.log("не удалось отправить");
    }
}