import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import QuestionSlide from './QuestionSlide';

const CheckBlock = ({ onChange, slideId }) => {
    const [questions, setQuestions] = useState([{}]);
        // useState([{
        //     question: "",
        //     answers: [{ text: "", isCorrect: false }],
        //     questionImageUrl: ""}]); // Начальный список с одним пустым вопросом

    const addQuestionField = () => {
        setQuestions([...questions, {
            question: "",
            answers: [{ text: "", isCorrect: false }],
            questionImageUrl: "",
            isMultiple: false,
        }]); // Добавляем новый вопрос
    };
     const removeQuestion = (index) => {
            if (questions.length <= 1) return;
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
            onChange('questions', newQuestions);
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
        <div className="check-block-container">
            <div className="check-block-header">
                <h2>Слайд {slideId + 1} - Проверочный блок</h2>
                <button className="add-question-button" onClick={addQuestionField}>
                    <span>+</span> Добавить вопрос
                </button>
            </div>

            <div className="questions-list">
                {questions.map((question, index) => (
                    <div key={index} className="question-item">
                        <div className="question-header">
                            <div className="question-number">Вопрос {index + 1}</div>
                            {questions.length > 1 && (
                                <button
                                    className="remove-question-button"
                                    onClick={() => removeQuestion(index)}
                                >
                                    × Удалить
                                </button>
                            )}
                        </div>

                        <QuestionSlide
                            content={questions[index].question || ''}
                            onChange={(field, value) => handleQuestionChange(index, field, value)}
                            slideId={`${slideId}-${index}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

CheckBlock.propTypes = {
    onChange: PropTypes.func.isRequired,
    slideId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string
};

export default CheckBlock;