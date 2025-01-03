const introduction = "Этот сайт создан для того, чтобы сделать ваше обучение математике " +
    "более удобным, интерактивным и эффективным. Здесь вы найдете все необходимые инструменты для" +
    " изучения материала, подготовки к занятиям и проверки своих знаний. Платформа позволяет преподавателям " +
    "создавать и хранить учебные материалы, которые всегда будут доступны вам в одном месте. " +
    "Вы сможете участвовать в интерактивных лекциях, выполнять проверочные задания и тесты, чтобы " +
    "закрепить пройденное и оценить свой прогресс.";

const footer = "*При регистрации не забудьте обязательно указать свой статус: Студент/Преподаватель"

document.getElementById("introduction-text").textContent = introduction;
document.getElementById("footer").textContent = footer;



// Registration
let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".forms");

signup.addEventListener("click", () => {
    slider.style.transform = 'translateX(100%)';
    formSection.style.transform = 'translateX(-50%)';
});

login.addEventListener("click", () => {
    slider.style.transform = 'translateX(0)';
    formSection.style.transform = 'translateX(0)';
});


document.querySelector('.signup-box').addEventListener('submit', function (e) {
    e.preventDefault();
    const userType = document.querySelector('select[name="role"]').value;

    if (userType === 'student') {
        window.location.href = 'StudentHome.html';
    } else if (userType === 'teacher') {
        window.location.href = 'TeacherHome.html';
    } else {
        alert('Пожалуйста, выберите ваш статус!');
    }
});