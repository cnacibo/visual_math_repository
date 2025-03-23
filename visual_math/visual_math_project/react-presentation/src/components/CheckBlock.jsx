import {useState } from 'react';
import PropTypes from 'prop-types';
import QuestionSlide from './QuestionSlide';

const CheckBlock = ({ onChange, slideId }) => {
    const [questions, setQuestions] =
        useState([{
            question: "",
            answers: [{ text: "", isCorrect: false }],
            questionImageUrl: ""}]); // Начальный список с одним пустым вопросом

    const addQuestionField = () => {
        setQuestions([...questions, {
            question: "",
            answers: [{ text: "", isCorrect: false }],
            questionImageUrl: ""
        }]); // Добавляем новый вопрос
    };

    // Обработчик изменения вопроса
    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }; // Обновляем поле вопроса
        setQuestions(updatedQuestions);

        // Передаем обновленные данные родительскому компоненту
        onChange('questions', updatedQuestions);
        // Сериализуем вопросы в JSON
        // onChange('content', JSON.stringify(updatedQuestions));
        // onChange('content', updatedQuestions);
        // onChange('type', 'test');
    };


    return (
        <div className="check-block">
            <h2>Проверочный блок</h2>
            {questions.map((question, index) => (
                <div key={index}>
                    <QuestionSlide
                        content={questions[index].question || ''}  // Передаем текущее содержание вопроса
                        onChange={(field, value) => handleQuestionChange(index, field, value)}  // Обработчик изменений
                        slideId={slideId}
                    />
                </div>
            ))}
            <button onClick={addQuestionField}>Добавить вопрос</button>
        </div>
    );
};

// Валидация типов для props
CheckBlock.propTypes = {
    onChange: PropTypes.func.isRequired, // Функция для обновления данных
    slideId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired // Идентификатор слайда (строка или число)
};
export default CheckBlock;
