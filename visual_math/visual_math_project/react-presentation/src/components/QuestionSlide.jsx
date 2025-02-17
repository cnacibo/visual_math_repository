import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const QuestionSlide = ({ content, onChange, onImageUpload, slideId }) => {
  const [question, setQuestion] = useState(content || ''); // Хранит сам вопрос
  const [answers, setAnswers] = useState(['']); // Хранит ответы
  const [isMultiple, setIsMultiple] = useState(false); // Для чекбоксов (множество правильных ответов)

  const handleQuestionImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageUpload(reader.result, 'question'); // Передаем изображение для вопроса
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAnswerImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageUpload(reader.result, 'answer-${index}'); // Передаем изображение для конкретного ответа
        };
        reader.readAsDataURL(file);
    }
  };

  const handleQuestionChange = (e) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    onChange('question', newQuestion);
  };

  const handleAnswerChange = (index, e) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
    onChange('answers', newAnswers);
  };

  const addAnswerField = () => {
    setAnswers([...answers, '']); // Добавляем новое поле для ответа
  };

  const handleAnswerTypeChange = (e) => {
    setIsMultiple(e.target.value === 'checkbox'); // Выбор радиокнопки или чекбокса
  };

  return (
    <div>
      <h2>Слайд {slideId + 1} - вопрос</h2> {/* Здесь отображаем ID слайда */}
      <textarea
        value={question}
        onChange={handleQuestionChange}
        placeholder="Введите TeX код..."
      />
      <div>
      <h3>Предпросмотр вопроса:</h3>
        <BlockMath>{question}</BlockMath>
      </div>

      {/* Загрузка изображения для вопроса */}
      <div>
        <h3>Вставка изображения для вопроса:</h3>
        <input type="file" accept="image/*" onChange={handleQuestionImageUpload} />
      </div>

      <div>
        <label>
          <input
            type="radio"
            value="radio"
            checked={!isMultiple}
            onChange={handleAnswerTypeChange}
          />
          Радиокнопки
        </label>
        <label>
          <input
            type="radio"
            value="checkbox"
            checked={isMultiple}
            onChange={handleAnswerTypeChange}
          />
          Чекбоксы
        </label>
      </div>

      {answers.map((answer, index) => (
        <div key={index}>
          <input
            type={isMultiple ? 'checkbox' : 'radio'}
            name="answer"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e)}
          />
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(index, e)}
            placeholder={`Ответ ${index + 1} с TeX кодом...`}
          />
          <div>
            <h3>Предпросмотр ответа {index + 1}:</h3>
            <BlockMath>{answer}</BlockMath>
          </div>

           {/* Загрузка изображения для ответа */}
           <div>
            <h3>Вставка изображения для ответа {index + 1}:</h3>
            <input type="file" accept="image/*" onChange={(e) => handleAnswerImageUpload(index, e)} />
          </div>
        </div>
      ))}

      <button onClick={addAnswerField}>Добавить ответ</button>

    </div>
  );
};

export default QuestionSlide;