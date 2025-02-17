import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import QuestionSlide from './QuestionSlide';

const CheckBlock = () => {
    const [questions, setQuestions] = useState([{}]); // Храним список вопросов

    const addQuestionField = () => {
      setQuestions([...questions, {}]); // Добавляем новый вопрос
    };

    return (
      <div>
        <h2>Проверочный блок</h2>
        {questions.map((_, index) => (
          <div key={index}>
            <QuestionSlide />
          </div>
        ))}
        <button onClick={addQuestionField}>Добавить вопрос</button>
      </div>
    );
  };

  export default CheckBlock;