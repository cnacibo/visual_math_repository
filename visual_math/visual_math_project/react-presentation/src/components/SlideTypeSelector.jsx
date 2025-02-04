import React, { useState } from 'react';

const SlideTypeSelector = ({ onSelect }) => {
    return (
        <div>
            <h2>Выберите тип слайда:</h2>
            <button onClick={() => onSelect('text')}>Текстовый</button>
            <button onClick={() => onSelect('test')}>Проверочный</button>
            <button onClick={() => onSelect('questionnaire')}>Вопросник</button>
        </div>
    );
};

export default SlideTypeSelector;