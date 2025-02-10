import React from 'react';

const SlideTypeSelector = ({ onSelect, selectedSlideIndex }) => {
    return (
        <div>
            <h1>Слайд {selectedSlideIndex + 1}</h1> {/* Показываем индекс слайда (прибавляем 1, чтобы нумерация начиналась с 1) */}
            <h2>Выберите тип слайда:</h2>
            <button onClick={() => onSelect('text')}>Текстовый</button>
            <button onClick={() => onSelect('test')}>Проверочный</button>
            <button onClick={() => onSelect('questionnaire')}>Вопросник</button>
        </div>
    );
};

export default SlideTypeSelector;
