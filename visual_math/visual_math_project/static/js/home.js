// for students and teacher html
// let globalSlides = [];
// let currentPresentationId = null;
// let ws = null;
// let studentWs = null;


function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const nav = document.querySelector('.side-nav');
    sidebar.classList.add('open'); // Открываем панель
    nav.style.paddingTop = '355px'; // Смещаем навигацию вниз (250px + 10px margin)
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const nav = document.querySelector('.side-nav');
    sidebar.classList.remove('open'); // Закрываем панель
    nav.style.paddingTop = '1.5rem'; // Возвращаем навигацию на место
}

const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');
const mainContent = document.getElementById('main');

let isResizing = false;

// Начало ресайза
resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none'; // Отключаем выделение текста
});

// Во время ресайза
document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const newWidth = window.innerWidth - e.clientX; // Ширина панели
    if (newWidth > 100 && newWidth < 500) { // Ограничиваем ширину
        sidebar.style.width = `${newWidth}px`;
        mainContent.style.marginRight = `${newWidth}px`;
    }
});

// Завершение ресайза
document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; // Включаем выделение текста обратно
    }
});


// Загрузка лекций из LocalStorage
function loadLectures() {
    const lectures = JSON.parse(localStorage.getItem("lectures")) || [];
    const lectureSelect = document.getElementById("lecture-search");

    // Очищаем список перед загрузкой
    lectureSelect.innerHTML ='<option value="">-- Выберите лекцию --</option>';

    // Добавляем лекции в выпадающий список
    lectures.forEach(lecture => {
        const option = document.createElement("option");
        option.value = lecture.url;
        option.textContent = lecture.name;
        lectureSelect.appendChild(option);
    });

    // Обновляем библиотеку лекций
    updateLectureLibrary();
}

function updateLectureLibrary() {
    const lectures = JSON.parse(localStorage.getItem("lectures")) || [];
    const subjectSelect = document.getElementById("subject");
    const selectedSubject = subjectSelect.value;

    // Очищаем списки лекций
    const lectureLists = document.querySelectorAll('.lecture-list');
    lectureLists.forEach(list => {
        list.innerHTML = `<h3>Лекции по ${list.id.replace("-", " ")}:</h3>`;
    });

    // Если предмет не выбран, показываем все лекции
    if (!selectedSubject) {
        lectureLists.forEach(list => {
            list.style.display = 'block';
        });
        return;
    }

    // Фильтруем лекции по выбранному предмету
    const filteredLectures = lectures.filter(lecture => lecture.subject === selectedSubject);
    const lectureList = document.getElementById(selectedSubject);

    if (lectureList) {
        lectureList.style.display = 'block'; // Показываем список лекций
        filteredLectures.forEach(lecture => {
            const link = document.createElement("a");
            link.href = lecture.url;
            link.textContent = lecture.name;
            lectureList.appendChild(document.createElement("br"));
            lectureList.appendChild(link);
        });
    }
}

const subjectSelect = document.getElementById("subject");
subjectSelect.addEventListener("change", updateLectureLibrary);

// Переход к выбранной лекции
function goToLecture() {
    const lectureSelect = document.getElementById("lecture-search");
    const selectedUrl = lectureSelect.value;

    if (selectedUrl) {
        window.location.href = selectedUrl;
    } else {
        alert('Пожалуйста, выберите лекцию.');
    }
}

// Добавление новой лекции
function addLecture() {
    const lectureName = document.getElementById("lecture-name").value;
    const lectureUrl = document.getElementById("lecture-url").value;
    const lectureSubject = document.getElementById("lecture-subject").value;

    if (lectureName && lectureUrl && lectureSubject) {
        const lectures = JSON.parse(localStorage.getItem("lectures")) || [];
        lectures.push({ name: lectureName, url: lectureUrl, subject: lectureSubject });
        localStorage.setItem("lectures", JSON.stringify(lectures));

        // Обновляем список лекций
        loadLectures();

        // Очищаем поля ввода
        document.getElementById("lecture-name").value = "";
        document.getElementById("lecture-url").value = "";
        document.getElementById("lecture-subject").value = "";

        alert("Лекция успешно добавлена!");
    } else {
        alert("Пожалуйста, заполните все поля.");
    }
}

// Удаление лекции


// Загрузка лекций при загрузке страницы
document.addEventListener('DOMContentLoaded', loadLectures);


function showContent(contentId) {
    // Скрываем все блоки контента
    document.querySelectorAll('.content > div').forEach(div => {
        div.classList.add('hidden');
    });

    // Скрываем секцию навигации по сайту
    document.querySelector('.con').classList.add('hidden');

    // Показываем выбранный блок контента
    document.getElementById(contentId + '-content').classList.remove('hidden');
}

function closeModule() {
    const activeContent = document.querySelector('.content > div:not(.hidden)');
    // Если такой блок есть, скрываем его
    if (activeContent) {
        activeContent.classList.add('hidden');
    }
    // Показываем секцию навигации по сайту
    document.querySelector('.con').classList.remove('hidden');
}

function filterBySubject() {
        const selectedSubject = document.getElementById('subject').value;
        const cards = document.querySelectorAll('.presentation-card');

        cards.forEach(card => {
            const cardSubject = card.getAttribute('data-subject');
            if (!selectedSubject || cardSubject === selectedSubject) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Если нашли cookie с нужным именем
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function deleteLecture(presentationId) {
    if (!presentationId) {
        alert("Не указан ID презентации.");
        return;
    }

    if (!confirm("Вы уверены, что хотите удалить презентацию?")) {
        return;
    }

    try {
        const response = await fetch("/presentations/delete-presentation/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ id: presentationId }),
        });

        const result = await response.json();

        if (result.success) {
            alert("Презентация успешно удалена!");
            location.reload(); // Обновляем страницу
        } else {
            alert("Ошибка удаления: " + result.error);
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось удалить презентацию. Проверьте соединение с сервером.");
    }
}

let globalSlides = [];
let currentPresentationId = null;
let ws = null;
let studentWs = null;
let answerStats = {}; // { slideIndex: { questionIndex: { answers: [] } } } хранение статистики ответов
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

        // Отображаем слайды
        //showSlideShow(globalSlides);


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
//функция отображения слайдов
function showSlideShow(slides, isTeacher = true) {

    globalSlides = slides;
    console.log('Received slides:', slides);



    // Создаем контейнер для слайдов
    const slideShowContainer = document.createElement('div');
    slideShowContainer.id = 'slide-show-container';
    // slideShowContainer.style.zIndex = '10000'; // Высокий z-index
    // slideShowContainer.style.position = 'fixed';
    // slideShowContainer.style.top = '60px'; // Отступ сверху
    // slideShowContainer.style.left = '0';
    // slideShowContainer.style.width = '100%';
    // slideShowContainer.style.height = 'calc(100% - 60px)';
    // slideShowContainer.style.overflowY = 'auto';
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
        // const cleanedContent = slide.content
        //     ? slide.content
        //         .replace(/\\\\/g, '\\')
        //         .replace(/\\text\{([^}]+)\}/g, '$1') // Удаление \\text{}
        //         .replace(/\\\[([^\]]+)\\\]/g, '$1') // Упрощение \\[ ... \\]
        //     : '';
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
function getCorrectAnswers(questionsData) {
    const correctAnswersMap = {};
    questionsData.forEach((questionObj, questionIndex) => {
        const question = questionObj.questionData || questionObj;
        if (question.answers) {
            correctAnswersMap[questionIndex] = question.answers
                .map((answer, idx) => answer.isCorrect ? idx : -1)
                .filter(idx => idx !== -1);
        }
    });
    return correctAnswersMap;
}

async function exportStatsToCSV(slideIndex, questionsData) {
    if (!answerStats[slideIndex]?.students) {
        console.error(`Нет данных для слайда ${slideIndex}`);
        return;
    }

    const correctAnswersData = getCorrectAnswers(questionsData);
    const allQuestions = answerStats[slideIndex].questions
        ? Object.keys(answerStats[slideIndex].questions).sort((a, b) => parseInt(a) - parseInt(b))
        : [];

    // Создаем заголовки CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "№,Студент";
    allQuestions.forEach((qIndex, i) => {
        csvContent += `,Ответ на вопрос ${i+1},Верный ответ`;
    });
    csvContent += ",Процент верных\n";

    let rowNumber = 1;
    const namePromises = [];

    // Обрабатываем студентов с улучшенной обработкой ошибок
    for (const [studentId, studentData] of Object.entries(answerStats[slideIndex].students)) {
        try {
            const name = await getStudentNameById(studentId)
                          .catch(() => `Студент ${studentId}`);

            const row = buildStudentRow(
                rowNumber++,
                name,
                studentData,
                allQuestions,
                correctAnswersData
            );
            namePromises.push(Promise.resolve(row));
        } catch (error) {
            console.error(`Ошибка обработки студента ${studentId}:`, error);
            const row = buildStudentRow(
                rowNumber++,
                `Студент ${studentId}`,
                studentData,
                allQuestions,
                correctAnswersData
            );
            namePromises.push(Promise.resolve(row));
        }
    }

    const rows = await Promise.all(namePromises);
    csvContent += rows.join('\n');

    // Создаем ссылку для скачивания
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `presentation_${currentPresentationId}_slide_${slideIndex + 1}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// Вспомогательная функция для построения строки
function buildStudentRow(rowNumber, studentName, studentData, allQuestions, correctAnswersData) {
    let row = `${rowNumber},${studentName}`;
    let correctAnswers = 0;
    let totalQuestions = 0;

    allQuestions.forEach(questionIndex => {
        let answerStr = "Нет ответа";
        let correctnessFlag = "";

        if (studentData.questions?.[questionIndex]) {
            const studentAnswers = studentData.questions[questionIndex].answers;
            const selectedIndices = studentAnswers
                .map((val, idx) => val === 1 ? idx : null)
                .filter(val => val !== null);

            answerStr = selectedIndices.join(', ') || "Нет";

            // Проверка правильности
            if (correctAnswersData[questionIndex]) {
                const required = correctAnswersData[questionIndex];
                const isMultiple = required.length > 1;

                const isCorrect = isMultiple
                    ? required.every(idx => studentAnswers[idx] === 1) &&
                      selectedIndices.length === required.length
                    : selectedIndices.length === 1 &&
                      required.includes(selectedIndices[0]);

                correctnessFlag = isCorrect ? "да" : "нет";
                if (isCorrect) correctAnswers++;
                totalQuestions++;
            }
        }

        row += `,"${answerStr}",${correctnessFlag}`;
    });

    const percentCorrect = totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    row += `,${percentCorrect}%`;

    return row;
}

const studentNameCache = {};

async function getStudentNameById(studentId) {
    // Проверяем кэш
    if (studentNameCache[studentId]) {
        return studentNameCache[studentId];
    }

    try {
        const response = await fetch(`/presentations/students/${encodeURIComponent(studentId)}/`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data.status === 'success') {
            studentNameCache[studentId] = data.name;
            return data.name;
        }
        throw new Error('Student not found');
    } catch (error) {
        console.error('Error fetching student name:', error);
        return `Студент ${studentId}`;
    }
}

function showQuestionnaireStats(slideIndex) {
    const statsContainer = document.getElementById(`questionnaire-stats-${slideIndex}`);

    if (!statsContainer) {
        console.error(`Не найден контейнер статистики для слайда ${slideIndex}`);
        return;
    }
    console.log("Статистика:", JSON.stringify(answerStats, null, 2));

    if (!answerStats[slideIndex]) {
        statsContainer.innerHTML = "<p>Нет данных</p>";
        statsContainer.style.display = "block";
        return;
    }

    // Получаем статистику по вопросам для слайда
    const slideStats = answerStats[slideIndex].questions;
    let html = "<h3>Статистика ответов</h3>";

    Object.keys(slideStats).forEach((questionIndex) => {
        const question = slideStats[questionIndex];

        // Подсчитываем количество каждого ответа по всем студентам
        const answerCounts = new Array(question.answers.length).fill(0);  // Массив для подсчета голосов для каждого ответа

        // Перебираем всех студентов для подсчета ответов
        Object.keys(answerStats[slideIndex].students).forEach((userId) => {
            const userStat = answerStats[slideIndex].students[userId];

            if (userStat.questions[questionIndex]) {
                const userAnswer = userStat.questions[questionIndex].answers;
                userAnswer.forEach((answer, index) => {
                    if (answer === 1) {
                        answerCounts[index] += 1;  // Увеличиваем счетчик для выбранного ответа
                    }
                });
            }
        });

        // Формируем HTML для отображения статистики ответов на этот вопрос
        html += `<div class="question-stat"><strong>Вопрос ${parseInt(questionIndex) + 1}:</strong><ul>`;
        answerCounts.forEach((count, index) => {
            const answerText = count === 1 ? 'голос' : (count > 1 ? 'голосов' : 'голосов');
            html += `<li>Ответ ${index + 1}: ${count} ${answerText}</li>`;
        });
        html += "</ul></div>";

        //const total = answerCounts.reduce((a, b) => a + b, 0);
        const totalRespondents = Object.keys(answerStats[slideIndex].students).length;
        html += `<div class="pie-chart-container" style="display: flex; flex-wrap: wrap; gap: 20px;">`;
        answerCounts.forEach((count, index) => {
            //const percentage = total > 0 ? (count / total) * 100 : 0;
            const percentage = totalRespondents > 0 ? (count / totalRespondents) * 100 : 0;
            const roundedPercentage = Math.round(percentage * 10) / 10;
            html += `
            <div class="pie-chart-wrapper">
                <div class="pie-chart" style="--percentage: ${percentage}">
                    <span class="pie-value">${roundedPercentage}%</span>
                </div>
                <div class="pie-label">Ответ ${index + 1}</div>
            </div>`;
        });
        html += `</div>`;
    });

    statsContainer.innerHTML = html;
    statsContainer.style.display = "block";
}


function updateQuestionnaireStats(slideIndex, stat) {
    console.log(`📊 Обновление статистики для слайда ${slideIndex}:`, stat);

    // Если для этого слайда еще нет записи в answerStats, создаем новый объект
    if (!answerStats[slideIndex]) {
        answerStats[slideIndex] = {
            questions: {},  // Вопросы для этого слайда
            students: {}    // Статистика по студентам
        };
    }

    // Обновляем вопросы из полученной статистики
    if (stat.questions) {
        answerStats[slideIndex].questions = stat.questions;
    }

    // Обновляем статистику студентов
    if (stat.students) {
        Object.keys(stat.students).forEach((userId) => {
            // Если у студента есть данные по вопросам
            if (stat.students[userId].questions) {
                answerStats[slideIndex].students[userId] = stat.students[userId];
            }
        });
    }

    // Выводим обновленную статистику
    console.log("Обновленная статистика:", JSON.stringify(answerStats, null, 2));

    // const statsContainer = document.getElementById(`stats-slide-${slideIndex}`);
    // if (!statsContainer) {
    //     console.warn(`⚠️ Контейнер для статистики слайда ${slideIndex} не найден!`);
    //     return;
    // }

    // Формируем HTML для отображения статистики
    let html = "<h3>Статистика ответов:</h3>";

    // Проверяем, есть ли вопросы для отображения
    if (Object.keys(answerStats[slideIndex].questions).length === 0) {
        html += "<p>Нет данных о вопросах</p>";
    } else {
        // Перебираем все вопросы
        Object.keys(answerStats[slideIndex].questions).forEach((questionIndex) => {
            const question = answerStats[slideIndex].questions[questionIndex];
            html += `<p><b>Вопрос ${parseInt(questionIndex) + 1}</b></p>`;

            // Подсчитываем количество каждого ответа
            const answerCounts = new Array(question.answers.length).fill(0);

            // Перебираем всех студентов для подсчета ответов
            Object.keys(answerStats[slideIndex].students).forEach((userId) => {
                const userStat = answerStats[slideIndex].students[userId];
                if (userStat.questions && userStat.questions[questionIndex]) {
                    const userAnswer = userStat.questions[questionIndex].answers;
                    userAnswer.forEach((answer, index) => {
                        if (answer === 1) {
                            answerCounts[index] += 1;
                        }
                    });
                }
            });

            // Формируем HTML для статистики
            // html += "<ul>";
            // answerCounts.forEach((count, index) => {
            //     const votesText = count === 1 ? 'голос' : (count > 1 && count < 5 ? 'голоса' : 'голосов');
            //     html += `<li>Ответ ${index + 1}: <b>${count}</b> ${votesText}</li>`;
            // });
            // html += "</ul>";
            // html += `<div class="pie-chart-container" style="display: flex; flex-wrap: wrap; gap: 20px;">`;

            answerCounts.forEach((count, index) => {
                const percentage = (count / answerCounts.reduce((a, b) => a + b, 1)) * 100 || 0;
                html += `
                <div class="pie-chart-wrapper">
                    <div class="pie-chart" style="--percentage: ${percentage}">
                        <span class="pie-value">${Math.round(percentage)}%</span>
                    </div>
                    <div class="pie-label">Ответ ${index + 1}</div>
                </div>`;
            });
            html += `</div>`;
        });
    }

    // Обновляем контейнер
    // statsContainer.innerHTML = html;
}




// function fetchQuestionnaireStats(slideIndex) {
//     ws.send(JSON.stringify({
//         action: "get_questionnaire_stats",
//         presentation_id: currentPresentationId,
//         slide_index: slideIndex
//     }));
// }
//
// // Обработчик обновлений статистики
// ws.onmessage = function(event) {
//     const data = JSON.parse(event.data);
//
//     if (data.action === 'questionnaire_stats_update') {
//         renderQuestionnaireStats(data.slide_index, data.stats);
//     }
// };

function renderQuestionnaireStats(slideIndex, stats) {
    const container = document.getElementById(`questionnaire-stats-${slideIndex}`);
    if (!container) return;

    container.innerHTML = `
        <h3>Статистика ответов</h3>
        <div class="stats-grid">
            ${Object.entries(stats.questions).map(([qIndex, question]) => `
                <div class="question-stats">
                    <h4>Вопрос ${parseInt(qIndex) + 1}</h4>
                    <div class="answers-stats">
                        ${question.answers.map((count, aIndex) => {
                            const percentage = question.totalAnswers > 0 
                                ? Math.round((count / question.totalAnswers) * 100) 
                                : 0;
                            return `
                                <div class="answer-stat">
                                    <span>Вариант ${aIndex + 1}:</span>
                                    <progress value="${percentage}" max="100"></progress>
                                    <span>${percentage}% (${count}/${question.totalAnswers})</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}



/**
 * Функция для автоматического парсинга и рендеринга формул KaTeX в тексте.
 * @param {string} text - Текст, содержащий формулы KaTeX.
 * @returns {string} - Текст с отрендеренными формулами.
 */
function renderKatexInText(text) {
    // Регулярное выражение для поиска формул KaTeX
    const katexRegex = /(\$\$[^$]+\$\$|\$[^$]+\$|\\\([^]+\\\)|\\\[[^]+\\\])/g;

    // Разделяем текст на части: обычный текст и формулы
    const parts = text.split(katexRegex);

    // Проходим по всем частям и рендерим формулы
    return parts.map(part => {
        if (katexRegex.test(part)) {
            // Если часть текста - это формула, рендерим её с помощью KaTeX
            try {
                return katex.renderToString(part, {
                    throwOnError: false, // Не выбрасывать ошибку при неудачном рендеринге
                });
            } catch (e) {
                console.error('Ошибка рендеринга формулы:', e);
                return part; // Возвращаем исходный текст, если рендеринг не удался
            }
        } else {
            // Если часть текста - это обычный текст, возвращаем его как есть
            return part;
        }
    }).join(''); // Собираем все части обратно в одну строку
}

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
            alert("Не удалось проверить презентацию: " + errorMessage);

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

    // Исправляем путь к изображению
    //const imageUrl = slide.image ? slide.image : '';

    // const slideShowContainerStudent = document.createElement('div');
    // slideShowContainerStudent.id = 'slide-show-container';

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

// Функция для отображения статистики ответов
function renderRealTimeStats(stats) {
    const statsContainer = document.getElementById('real-time-stats');
    if (!statsContainer) return;

    // Очищаем контейнер
    statsContainer.innerHTML = '';

    // Создаем таблицу для отображения статистики
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Вопрос</th>
                <th>Вариант ответа</th>
                <th>Количество ответов</th>
                <th>Процент ответов</th>
            </tr>
        </thead>
        <tbody>
            ${stats.map((question, questionIndex) => `
                ${question.answers.map((answer, answerIndex) => `
                    <tr>
                        <td>Вопрос ${questionIndex + 1}</td>
                        <td>Вариант ${answerIndex + 1}</td>
                        <td>${answer.count || 0}</td>
                        <td>${answer.percentage || 0}%</td>
                    </tr>
                `).join('')}
            `).join('')}
        </tbody>
    `;

    // Добавляем таблицу в контейнер
    statsContainer.appendChild(table);
}

