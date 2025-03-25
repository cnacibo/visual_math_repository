import { useState } from 'react';
import { BlockMath } from 'react-katex';
import PropTypes from 'prop-types';
import 'katex/dist/katex.min.css';
import katex from 'katex';
// import 'visual_math_project/react-presentation/src/components/TextSlied.css';
import '../App.css';

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

    const renderedContent = renderKatexInText(texInput);


    return (
        <div  className="text_slide">
            <h2>Слайд {slideId + 1} - текстовый</h2> {/* Здесь отображаем ID слайда */}
            <textarea
                value={texInput}
                onChange={(e) => {
                    setTexInput(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder="Введите TeX код..."
            />
            <div className="preview-container">
                <h3>Предпросмотр:</h3>
                <div dangerouslySetInnerHTML={{__html: renderedContent}}/>
            </div>
            <div>
                <h3>Вставка изображения:</h3>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
        </div>
    );
};
TextSlide.propTypes = {
    content: PropTypes.string, // Optional initial TeX content <button class="citation-flag" data-index="1">
    onChange: PropTypes.func.isRequired, // Callback for content changes <button class="citation-flag" data-index="1">
    onImageUpload: PropTypes.func.isRequired, // Callback for image uploads <button class="citation-flag" data-index="1">
    slideId: PropTypes.number.isRequired // Unique slide identifier <button class="citation-flag" data-index="1">
};
export default TextSlide;
