import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import PropTypes from 'prop-types';

const TextSlide = ({ content, onChange, onImageUpload, slideId }) => {
    const [texInput, setTexInput] = useState(content || '');

    const handleImageUpload = (e) => {
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
                    onImageUpload(data.imageUrl);  // Передаем URL изображения
                } else {
                    alert('Ошибка загрузки изображения');
                }
            })
            .catch(error => {
                console.error("Ошибка загрузки изображения:", error);
            });
        }
    };


    return (
        <div>
            <h2>Слайд {slideId + 1} - текстовый</h2> {/* Здесь отображаем ID слайда */}
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

TextSlide.propTypes = {
    content: PropTypes.string, // Содержимое слайда (может быть пустым)
    onChange: PropTypes.func.isRequired, // Функция для обновления содержимого
    onImageUpload: PropTypes.func.isRequired, // Функция для загрузки изображения
    slideId: PropTypes.number.isRequired, // Идентификатор слайда
};

export default TextSlide;
