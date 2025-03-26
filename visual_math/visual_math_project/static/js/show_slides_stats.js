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
        alert("Нет данных для слайда.");
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
}