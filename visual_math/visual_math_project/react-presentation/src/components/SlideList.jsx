import React from 'react';

const SlideList = ({ slides, onAddSlide, onRemoveSlide, onSelectSlide }) => {
    return (
        <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '10px' }}>
            <h3>Слайды</h3>
            <button onClick={onAddSlide}>Добавить слайд</button>
            <ul>
                {slides.map((slide, index) => (
                    <li key={index} style={{ margin: '5px 0', cursor: 'pointer' }} onClick={() => onSelectSlide(index)}>
                        Слайд {index + 1}
                        <button onClick={(e) => { e.stopPropagation(); onRemoveSlide(index); }}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SlideList;