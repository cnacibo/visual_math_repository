import React, { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const TextSlide = ({ content, onChange, onImageUpload }) => {
    const [texInput, setTexInput] = useState(content || '');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpload(reader.result); // Передаем изображение в App
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div>
            <h2>Текстовый слайд</h2>
            <textarea
                value={texInput}
                onChange={(e) => {
                    setTexInput(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder="Введите TeX код..."
            />
            <div>
                <h3>Предпросмотр:</h3>
                <BlockMath>{texInput}</BlockMath>
            </div>
            <div>
                <h3>Вставка изображения:</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
        </div>
    );
};

export default TextSlide;