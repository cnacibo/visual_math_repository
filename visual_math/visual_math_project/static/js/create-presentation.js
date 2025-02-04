// Функция для отображения контента
function showContent(contentId) {
    // Скрываем все блоки контента
    document.querySelectorAll('.content > div').forEach(div => {
        div.classList.add('hidden');
    });

    // Показываем выбранный блок контента
    document.getElementById(contentId + '-content').classList.remove('hidden');
}

// Функция для скрытия контента
function hideContent(contentId) {
    // Скрываем выбранный блок контента
    document.getElementById(contentId).classList.add('hidden');

    // Показываем секцию навигации по сайту
    document.querySelector('.content').classList.remove('hidden');
}

// Функция для обновления кнопки с названием модуля
function updateModuleButton() {
    const moduleName = document.getElementById('module-name').value;
    const moduleButton = document.getElementById('module-button');
    moduleButton.textContent = moduleName || "Название модуля";
}

// Функция для загрузки модуля
function loadModule() {
    // Здесь можно добавить логику для загрузки модуля из библиотеки
    alert("Функция загрузки модуля из библиотеки будет реализована позже.");
}

// Функция для загрузки файла
document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('tex-input').value = e.target.result;
            renderKaTeX();
        };
        reader.readAsText(file);
    }
});

// Функция для рендеринга KaTeX
function renderKaTeX() {
    const texInput = document.getElementById('tex-input');
    const katexOutput = document.getElementById('katex-output');
    const texContent = texInput.value;

    // Заменяем // на <br> для переноса строк
    const htmlContent = texContent.replace(/\/\//g, '<br>');

    // Рендерим KaTeX
    katexOutput.innerHTML = htmlContent
        .split('$$')
        .map((part, index) => {
            if (index % 2 === 1) {
                // Рендерим выключные формулы
                return katex.renderToString(part, { displayMode: true });
            } else {
                // Рендерим inline формулы и текст
                return part.split('$').map((fragment, i) => {
                    if (i % 2 === 1) {
                        return katex.renderToString(fragment, { displayMode: false });
                    } else {
                        return fragment;
                    }
                }).join('');
            }
        })
        .join('');
}

// Обработка ввода
document.getElementById('tex-input').addEventListener('input', () => {
    renderKaTeX();
});

// Функция для переключения видимости меню
function toggleTabMenu(menuId) {
    // Закрываем все открытые меню
    document.querySelectorAll('.tab-menu').forEach(menu => {
        if (menu.id !== menuId) {
            menu.classList.add('hidden');
        }
    });

    const menu = document.getElementById(menuId);
    menu.classList.toggle("hidden");
}


// Функция для вставки текста
function insertText(startTag, endTag = '') {
    const texInput = document.getElementById('tex-input');
    if (!texInput) {
        console.error("Элемент tex-input не найден!");
        alert("Элемент tex-input не найден!");
        return;
    }
    const start = texInput.selectionStart;
    const end = texInput.selectionEnd;
    const text = texInput.value;
    const selectedText = text.substring(start, end);

    // Вставляем текст
    texInput.value = text.substring(0, start) + startTag + selectedText + endTag + text.substring(end);

    // Устанавливаем курсор
    texInput.selectionStart = start + startTag.length;
    texInput.selectionEnd = start + startTag.length + selectedText.length;

    // Рендерим KaTeX
    renderKaTeX();
}

// Инициализация
renderKaTeX();


function downloadTexFile() {
    const texContent = document.getElementById('tex-input').value;
    const fileName = document.getElementById('module-name').value || 'document'; // Имя файла из названия модуля
    const blob = new Blob([texContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Создаем ссылку для скачивания
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.tex`;
    a.click();

    // Освобождаем память
    URL.revokeObjectURL(url);
}

function downloadPdfFile() {
    alert("Функция загрузки из tex в pdf формат будет реализована позже.");
}

// Инициализация
renderPreview();


function toggleUploadMenu() {
    const menu = document.getElementById('upload-menu');
    menu.classList.toggle('hidden');
}

function loadFromLibrary() {
    alert('Загрузка из библиотеки...');
    // Здесь можно добавить логику для загрузки из библиотеки
    toggleUploadMenu(); // Закрыть меню после выбора
}

function loadFromComputer() {
    document.getElementById('file-input').click(); // Открыть диалог выбора файла
    toggleUploadMenu(); // Закрыть меню после выбора
}

// Обработка выбора файла
document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    // if (file) {
    //     alert(`Выбран файл: ${file.name}`);
    //     // Здесь можно добавить логику для обработки файла
    // }
});


// ВИЗУАЛЬНЫЙ МОДУЛЬ

const socket = new WebSocket('ws://your-websocket-server-url');

// Состояние камеры
let camera = {
    x: 0,
    y: 0,
    scale: 1,
};

// Canvas и контекст
const canvas = document.getElementById('visual-canvas');
const ctx = canvas.getContext('2d');

// Функция для загрузки визуального модуля
function loadVisualModule() {
    // Здесь можно добавить логику для загрузки модуля из библиотеки
    alert("Функция загрузки визуального модуля будет реализована позже.");
}

// Функция для приближения камеры
function zoomIn() {
    camera.scale *= 1.1;
    updateCamera();
}

// Функция для отдаления камеры
function zoomOut() {
    camera.scale /= 1.1;
    updateCamera();
}

// Функция для перемещения камеры
function moveCamera(direction) {
    const step = 10;
    switch (direction) {
        case 'left':
            camera.x -= step;
            break;
        case 'right':
            camera.x += step;
            break;
        case 'up':
            camera.y -= step;
            break;
        case 'down':
            camera.y += step;
            break;
    }
    updateCamera();
}

// Функция для обновления камеры и синхронизации
function updateCamera() {
    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Применение трансформации камеры
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.scale, camera.scale);

    // Отрисовка визуальных элементов (пример)
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 100, 100);

    ctx.restore();

    // Отправка состояния камеры на сервер
    socket.send(JSON.stringify({ type: 'camera', data: camera }));
}

// Обработка сообщений от сервера
socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'camera') {
        // Обновление камеры на стороне студента
        camera = message.data;
        updateCamera();
    }
});

// Инициализация canvas
function initCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    updateCamera();
}

// Запуск при загрузке страницы
window.addEventListener('load', initCanvas);

// Вопросник
const questionnaireInput = document.getElementById('questionnaire-input');
const questionnairePreview = document.getElementById('questionnaire-preview');

// Функция для визуализации текста
function renderPreview() {
    const questionnaireInput = document.getElementById('questionnaire-input');
    const questionnairePreview = document.getElementById('questionnaire-preview');

    if (!questionnaireInput || !questionnairePreview) {
        console.error("Элементы questionnaire-input или questionnaire-preview не найдены!");
        return;
    }
    const text = questionnaireInput.value;
    questionnairePreview.innerHTML = text
        .replace(/\n/g, '<br>') // Заменяем переносы строк на <br>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Жирный текст
        .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Курсив
}

// Обработка ввода
questionnaireInput.addEventListener('input', () => {
    renderPreview();
});

// Функция для загрузки вопросника
function loadQuestionnaire() {
    // Заглушка для загрузки вопросника
    alert("Функция загрузки вопросника будет реализована позже.");
}


