import React, { useState } from 'react';
import QuestionSlide from './QuestionSlide';

const CheckBlock = ({ onChange, slideId }) => {
    const [questions, setQuestions] = useState([{}]); // Начальный список с одним пустым вопросом

    const addQuestionField = () => {
        setQuestions([...questions, {}]); // Добавляем новый вопрос
    };

    // Обработчик изменения вопроса
    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }; // Обновляем поле вопроса
        setQuestions(updatedQuestions);

        // Передаем обновленные данные родительскому компоненту
        onChange('questions', updatedQuestions);
    };

    return (
        <div>
            <h2>Проверочный блок</h2>
            {questions.map((_, index) => (
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

export default CheckBlock;
