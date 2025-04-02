import {useEffect, useState} from 'react';
import { BlockMath } from 'react-katex';
import PropTypes from 'prop-types';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import '../App.css';

const TextSlide = ({ content, onChange, onImageUpload, slideId }) => {
    const [texInput, setTexInput] = useState(content || '');


    useEffect(() => {
        setTexInput(content || '');
    }, [content]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            fetch("/presentations/upload-image/", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.imageUrl) {
                    onImageUpload(data.imageUrl);
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
        <div className="text-slide">
            <div className="slide-header">
                <h2>Слайд {slideId + 1} - Текстовый</h2>
            </div>

            <div className="text-section">
                <label className="section-label">Текст слайда:</label>
                <textarea
                    className="text-textarea"
                    value={texInput}
                    onChange={(e) => {
                        setTexInput(e.target.value);
                        onChange(e.target.value);
                    }}
                    placeholder="Введите текст (поддерживается LaTeX: $формула$ или $$формула$$)..."
                />

                <div className="preview-container">
                    <h3 className="preview-title">Предпросмотр:</h3>
                    <div className="preview-content" dangerouslySetInnerHTML={{__html: renderedContent}}/>
                </div>
            </div>

            <div className="image-upload-section">
                <label className="section-label">Изображение для слайда:</label>
                <div className="upload-container">
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
            </div>
        </div>
    );
};

TextSlide.propTypes = {
    content: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    slideId: PropTypes.number.isRequired
};

export default TextSlide;