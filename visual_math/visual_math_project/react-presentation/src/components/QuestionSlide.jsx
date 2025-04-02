import {useEffect, useState} from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import PropTypes from 'prop-types';
import '../App.css';

const QuestionSlide = ({ content = '', onChange, onImageUpload, slideId }) => {
  const [questionData, setQuestionData] = useState({
    question: content || '',
    answers: [{ text: '', isCorrect: false }],
    questionImageUrl: '',
    isMultiple: false,
  });
  //const [isMultiple, setIsMultiple] = useState(false); // Для чекбоксов (множество правильных ответов)

  const handleQuestionImageUpload = (e) => {
    const file = e.target.files[0];
        if (file) {
             const formData = new FormData();
             formData.append("image", file);
             // Отправьте изображение на сервер
             fetch("/presentations/upload-image/", {
                 method: "POST",
                 body: formData,
             })
             .then(response => response.json())
             .then(data => {
                 if (data.imageUrl) {
                     setQuestionData((prev) => ({
                       ...prev,
                       questionImageUrl: data.imageUrl, // Сохраняем URL изображения
                     }));
                     onImageUpload(data.imageUrl, 'question'); // Передаем URL родительскому компоненту
                 } else {
                     alert("Ошибка загрузки изображения");
                 }
             })
             .catch(error => {
                 console.error("Ошибка загрузки изображения:", error);
             });
         }
  };
    const handleQuestionChange = (e) => {
        const updatedQuestion = e.target.value;
        setQuestionData((prev) => ({
          ...prev,
          question: updatedQuestion,
        }));
        onChange('questionData', {
          ...questionData,
          question: updatedQuestion,
        });
    };

  const handleAnswerChange = (index, e) => {
    const updatedAnswers = [...questionData.answers];
    updatedAnswers[index].text = e.target.value;

    // Обновляем объект состояния
    setQuestionData((prev) => ({
      ...prev,
      answers: updatedAnswers,
    }));

    // Сообщаем об изменении родительскому компоненту
    onChange('questionData', {
      ...questionData,
      answers: updatedAnswers,
    });
  };

  const addAnswerField = () => {
    setQuestionData((prev) => ({
      ...prev,
      answers: [...prev.answers, { text: '', isCorrect: false }], // Добавляем новое поле для ответа
    }));
  };

  const handleAnswerTypeChange = (e) => {
    const newIsMultiple = e.target.value === 'checkbox';

    setQuestionData((prev) => {
        const resetAnswers = newIsMultiple ? prev.answers : prev.answers.map(a => ({ ...a, isCorrect: false }));

        return {
            ...prev,
            isMultiple: newIsMultiple,
            answers: resetAnswers,
        };
    });

    onChange('questionData', {
        ...questionData,
        isMultiple: newIsMultiple,
        answers: newIsMultiple ? questionData.answers : questionData.answers.map(a => ({ ...a, isCorrect: false })),
    });
  };


  const handleCorrectAnswerChange = (index) => {

    const updatedAnswers = questionData.answers.map((answer, i) => {
      if (questionData.isMultiple) {
        // Если чекбоксы, меняем только у текущего ответа
        if (i === index) {
          return { ...answer, isCorrect: !answer.isCorrect };
        }
        return answer;
      } else {
        // Если радиокнопки, делаем текущий ответ единственным правильным
        return { ...answer, isCorrect: i === index };
      }
    });

    setQuestionData((prev) => ({
      ...prev,
      answers: updatedAnswers,
    }));

    onChange('questionData', {
      ...questionData,
      answers: updatedAnswers,
    });
  };

  const renderKatexInText = (text) => {
        const katexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;

        return text.replace(katexRegex, (match, blockFormula, inlineFormula) => {
            try {
                if (blockFormula) {
                    return katex.renderToString(blockFormula, { displayMode: true });
                } else if (inlineFormula) {
                    return katex.renderToString(inlineFormula, { displayMode: false });
                }
            } catch (e) {
                console.error('Ошибка рендеринга формулы:', e);
                return match;
            }
        });
    };

const renderedContentq = renderKatexInText(questionData.question);



  return (
    <div className="question-slide">
         <div className="slide-header">
          <h2>
              {(typeof slideId === 'string' && slideId.includes('-'))
                ? `Вопрос`
                : `Слайд ${parseInt(slideId) + 1} - Вопрос`}
            </h2>
        </div>
        <div className="question-section">
            <label className="section-label">Текст вопроса:</label>
            <textarea
                 className="question-textarea"
                value={questionData.question}
                onChange={handleQuestionChange}
                placeholder="Введите текст вопроса (поддерживается LaTeX: $формула$ или $$формула$$)..."
            />
            <div className="preview-container">
                <h3 className="preview-title">Предпросмотр вопроса:</h3>
                <div className="preview-content" dangerouslySetInnerHTML={{__html: renderedContentq}}/>
            </div>
        </div>

        <div className="image-upload-section">
          {/* Загрузка изображения для вопроса */}
          <label className="section-label">Изображение для вопроса:</label>
          <div className="upload-container">
            <input type="file" accept="image/*" onChange={handleQuestionImageUpload} />
          </div>
          {questionData.questionImageUrl && (
            <span className="file-name">Изображение загружено</span>
          )}
        </div>

      <div className="answer-type-section">
        <label className="section-label">Тип ответов:</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              value="radio"
              checked={!questionData.isMultiple}
              onChange={handleAnswerTypeChange}
            />
            <span className="radio-label">Один верный ответ</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="checkbox"
              checked={questionData.isMultiple}
              onChange={handleAnswerTypeChange}
            />
            <span className="radio-label">Несколько верных ответов</span>
          </label>
        </div>
      </div>

      <div className="answers-section">
        <label className="section-label">Варианты ответов:</label>
        {questionData.answers.map((answer, index) => (
          <div key={index} className="answer-item">
            <div className="answer-controls">
              <input
                type={questionData.isMultiple ? 'checkbox' : 'radio'}
                className="answer-checkbox"
                checked={answer.isCorrect}
                onChange={() => handleCorrectAnswerChange(index)}
              />
              <span className="answer-number">Ответ {index + 1}</span>
            </div>
            <textarea
              className="answer-textarea"
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, e)}
              placeholder={`Текст ответа ${index + 1}...`}
            />
            <div className="preview-container">
              <h3 className="preview-title">Предпросмотр:</h3>
              <div className="preview-content" dangerouslySetInnerHTML={{__html: renderKatexInText(answer.text)}}/>
            </div>
          </div>
        ))}
      </div>

      <button className="add-answer-button" onClick={addAnswerField}>
        + Добавить ответ
      </button>

    </div>
  );
};

export default QuestionSlide