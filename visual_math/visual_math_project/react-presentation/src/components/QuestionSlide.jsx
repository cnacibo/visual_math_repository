import  { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import PropTypes from 'prop-types';
import '../App.css';

const QuestionSlide = ({ content = '', onChange, onImageUpload, slideId }) => {
  const [questionData, setQuestionData] = useState({
    question: content || '',
    answers: [{ text: '', isCorrect: false }], // Начальный массив ответов
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

  // const handleAnswerImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //           onImageUpload(reader.result, `answer-${index}`); // Передаем изображение для конкретного ответа
  //       };
  //       reader.readAsDataURL(file);
  //   }
  // };

  // const handleQuestionChange = (e) => {
  //   const updatedQuestion = e.target.value;
  //   setQuestionData((prev) => ({
  //     ...prev,
  //     question: updatedQuestion,
  //   }));
  //   onChange('questionData', {
  //     ...questionData,
  //     question: updatedQuestion,
  //   });
  // };
  //   const handleQuestionChange = (e) => {
  //   const updatedQuestion = e.target.value;
  //   setQuestionData(prev => ({ ...prev, question: updatedQuestion }));
  //
  //   // Сериализуем весь объект вопроса
  //   onChange('content', JSON.stringify({
  //       ...questionData,
  //       question: updatedQuestion
  //   }));
  //   onChange('type', 'questionnaire');
  //   };

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
      <h2>Слайд {slideId + 1} - вопрос</h2> {/* Здесь отображаем ID слайда */}
      <textarea
        value={questionData.question}
        onChange={handleQuestionChange}
        placeholder="Введите TeX код..."
      />
      <div className="preview-container">
            <h3>Предпросмотр вопроса:</h3>
            {/*<BlockMath>{questionData.question || ''}</BlockMath>*/}
            <div dangerouslySetInnerHTML={{__html: renderedContentq}}/>
      </div>

      {/* Загрузка изображения для вопроса */}
      <div>
        <h3>Вставка изображения для вопроса:</h3>
        <input type="file" accept="image/*" onChange={handleQuestionImageUpload} />
      </div>

      <div className="answer-container input">
        <label>
          <input
            type="radio"
            value="radio"
            checked={!questionData.isMultiple}
            onChange={handleAnswerTypeChange}
          />
          Радиокнопки
        </label>
        <label>
          <input
            type="radio"
            value="checkbox"
            checked={questionData.isMultiple}
            onChange={handleAnswerTypeChange}
          />
          Чекбоксы
        </label>
      </div>

      {questionData.answers.map((answer, index) => (
        <div key={index} className="answer-container">
          <input
            type={questionData.isMultiple ? 'checkbox' : 'radio'}
            name="answer"
            value={answer.text}
            checked={answer.isCorrect}
            onChange={() => handleCorrectAnswerChange(index)}
          />
          <textarea
            value={answer.text}
            onChange={(e) => handleAnswerChange(index, e)}
            placeholder={`Ответ ${index + 1} с TeX кодом...`}
          />
           <div className="preview-container">
                <h3>Предпросмотр ответа {index + 1}:</h3>
                {/*<BlockMath>{questionData.question || ''}</BlockMath>*/}
                <div dangerouslySetInnerHTML={{__html: renderKatexInText(answer.text)}}/>
          </div>
          {/*<div className="preview-container">*/}
          {/*  <h3>Предпросмотр ответа {index + 1}:</h3>*/}
          {/*  <BlockMath>{answer.text}</BlockMath>*/}
          {/*</div>*/}
        </div>
      ))}

      <button onClick={addAnswerField}>Добавить ответ</button>

    </div>
  );
};
// QuestionSlide.propTypes = {
//   content: PropTypes.string, // Текущий контент вопроса
//   onChange: PropTypes.func.isRequired, // Обработчик изменения данных
//   onImageUpload: PropTypes.func.isRequired, // Обработчик загрузки изображения
//   slideId: PropTypes.number.isRequired, // ID слайда
// };
export default QuestionSlide