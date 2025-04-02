const introduction = "<div style=\"display: flex; align-items: center; font-family: 'Montserrat Medium', serif; justify-content: center; gap: 6px;\"><span style=\"font-weight: bold; text-align: center; font-size: 40px;\">Немного о платформе</span></div>" +
    "<span style='font-weight: bold;'>Этот сайт создан </span> " +
    "для того, чтобы сделать ваше обучение математике " +
    "более  <span style='color:#2C6E49; font-weight: bold; font-size: 25px'>удобным</span>" +
    ", <span style='color: #2C6E49; font-weight: bold; font-size: 25px; '>интерактивным</span> и " +
    "<span style='color: #2C6E49; font-weight: bold; font-size: 25px; '>" +
    "эффективным</span>. Здесь вы найдете все необходимые инструменты для" +
    " изучения материала, подготовки к занятиям и проверки своих знаний. <br> <br>" +
    "<span style='font-weight: bold; '>Платформа позволяет</span> преподавателям " +
    "создавать и хранить учебные материалы, которые всегда будут доступны вам в одном месте. " +
    "Вы сможете участвовать в интерактивных лекциях, выполнять проверочные задания и тесты, чтобы " +
    "закрепить пройденное и оценить свой прогресс.";

const footer = "<span style='color: red; font-weight: bold; font-size: 28px'>!</span>  При " +
    "регистрации пользователю автоматически присваивается статус <span style='font-weight: bold; font-size: 20px'>Студент</span>." +
    "<br>Если хотите получить статус преподавателя, нажмите на кнопку <span style='font-weight: bold; font-size: 20px'>Вы преподаватель?</span>"

document.getElementById("introduction-text").innerHTML = introduction;
document.getElementById("footer").innerHTML = footer;



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

function IsTeacher() {
    alert(
        "Пожалуйста, напишите на нашу почту: visualmathproject2024@gmail.com\n\n" +
        "Не забудьте указать:\n" +
        "- Ваше ФИО и название ВУЗа.\n" +
        "- Имя пользователя аккаунта."
    );
}