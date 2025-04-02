// import React from 'react';
import PropTypes from 'prop-types';

const SlideTypeSelector = ({ onSelect, selectedSlideIndex }) => {
    return (
        <div className="type-selector-container">
            <div className="type-selector-header">
                <h1 className="slide-number-show">Слайд {selectedSlideIndex + 1}</h1>
                <h2 className="type-selector-title">Выберите тип слайда:</h2>
            </div>
            <div className="type-buttons-container">
                <button className="type-button text-type"  onClick={() => onSelect('text')}>Текстовый</button>
                <button className="type-button questionnaire-type" onClick={() => onSelect('questionnaire')}>Вопросник</button>
                <button className="type-button test-type" onClick={() => onSelect('test')}>Проверочный</button>
            </div>
        </div>
    );
};

SlideTypeSelector.propTypes = {
    onSelect: PropTypes.func.isRequired, // Функция выбора типа слайда
    selectedSlideIndex: PropTypes.number.isRequired, // Индекс выбранного слайда
};

export default SlideTypeSelector;
