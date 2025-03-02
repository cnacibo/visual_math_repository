// for students and teacher html

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
    lectureSelect.innerHTML = '<option value="">-- Выберите лекцию --</option>';

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

async function openPresentation(presentationId) {
    try {
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

        // Отображаем слайды
        showSlideShow(presentationData.slides);
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Не удалось загрузить презентацию: ${error.message}`);
    }
}
//функция отображения слайдов
function showSlideShow(slides) {
    console.log('Received slides:', slides);

    // Создаем контейнер для слайдов
    const slideShowContainer = document.createElement('div');
    slideShowContainer.id = 'slide-show-container';
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
            // case 'test': // Проверочный слайд
            //     try {
            //         // Если questions это строка "test", создаем пустой массив вопросов
            //         const questionsData = slide.questions === "test" ? '[]' : slide.questions;
            //         const questions = JSON.parse(questionsData || '[]'); // Парсим вопросы или используем пустой массив
            //         slideHtml = `
            //             <h2>Проверочный блок - Слайд ${index + 1}</h2>
            //             ${renderQuestions(questions)}
            //             ${slide.image ? `<img src="${slide.image}" class="slide-image">` : ''}
            //         `;
            //     } catch (e) {
            //         slideHtml = `<div class="error">Ошибка: ${e.message}</div>`;
            //     }
            //     break;
            case 'test': // Проверочный слайд
                try {
                    // Если questions это строка "test", создаем пустой массив вопросов
                    const questionsData = slide.questions === "test" ? [] : slide.questions;
                    const questions = Array.isArray(questionsData) ? questionsData : []; // Убедимся, что questions - это массив
                    slideHtml = `
                        <h2>Проверочный блок - Слайд ${index + 1}</h2>
                        ${renderQuestions(questions)}
                        ${slide.image ? `<img src="${slide.image}" class="slide-image">` : ''}
                    `;
                } catch (e) {
                    slideHtml = `<div class="error">Ошибка: ${e.message}</div>`;
                }
                break;

            case 'questionnaire': // Вопросник
                try {
                    const questionData = slide.questions;
                    slideHtml = `
                        <h2>Слайд ${index + 1} (Вопросник)</h2>
                        <div class="questionnaire">
                            <div class="question">
                                <div class="math-content">${renderKatexInText(questionData.question || "Вопрос не указан")}</div>
                            </div>
                            <div class="answers">
                                ${questionData.answers.map((answer, i) => `
                                    <div class="answer">
                                        <input
                                            type="radio"
                                            name="questionnaire-answer"
                                            value="${i}"
                                            ${answer.isCorrect ? 'checked' : ''}
                                        >
                                        <div class="math-content">${answer.text}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
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
    }

    // Функция для рендеринга вопросов
    // function renderQuestions(questions) {
    //     return questions.map((q, qIndex) => `
    //         <div class="question-block">
    //             <h3>Вопрос ${qIndex + 1}</h3>
    //             <div class="math-content">${q.question || ''}</div>
    //             ${q.questionImageUrl ? `<img src="${q.questionImageUrl}" class="question-image">` : ''}
    //             <div class="answers">
    //                 ${q.answers.map((a, aIndex) => `
    //                     <div class="answer ${a.isCorrect ? 'correct' : ''}">
    //                         <div class="math-content">${a.text}</div>
    //                     </div>
    //                 `).join('')}
    //             </div>
    //         </div>
    //     `).join('');
    // }
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
        }
    };

    window.nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            renderSlide(currentSlideIndex);
        }
    };

    window.closeSlideShow = () => {
        document.body.removeChild(slideShowContainer);
    };

    // Рендерим первый слайд
    renderSlide(currentSlideIndex);
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