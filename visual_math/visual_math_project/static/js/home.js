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
        list.innerHTML = '';
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