import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const SlideShow = ({ slides, onClose }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(true);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') handleNextSlide();
        if (e.key === 'ArrowLeft') handlePrevSlide();
        if (e.key === 'Escape') onClose();
    };

    // useEffect(() => {
    //     document.addEventListener('keydown', handleKeyDown);
    //     return () => document.removeEventListener('keydown', handleKeyDown);
    // }, [currentSlideIndex]);
    // В компонент SlideShow добавить:
    useEffect(() => {
    const handleResize = () => {
        const targetWidth = 800;
        const targetHeight = 600;
        const scale = Math.min(
            window.innerWidth / targetWidth,
            window.innerHeight / targetHeight
        ) * 0.9;
        document.documentElement.style.setProperty('--scale-factor', scale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Инициализация
    return () => window.removeEventListener('resize', handleResize);
}, []);

    useEffect(() => {
    document.body.classList.add('slide-show-active');
    return () => document.body.classList.remove('slide-show-active');
}, []);

    const handleNextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const handlePrevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    return (
        <div className={`slide-show ${isFullscreen ? 'fullscreen' : ''}`}>
            <div className="slide-nav">
                <button className="nav-button" onClick={onClose}>
                    ✕ Закрыть
                </button>
                <span className="slide-counter">
                    Слайд {currentSlideIndex + 1} из {slides.length}
                </span>
            </div>

            <div className="slide-content">
                {slides[currentSlideIndex]?.type === 'text' && (
                    <div className="text-slide">
                        <BlockMath>{slides[currentSlideIndex].content}</BlockMath>
                        {slides[currentSlideIndex]?.image && (
                            <img
                                src={slides[currentSlideIndex].image}
                                alt="Иллюстрация"
                                className="slide-image"
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="slide-controls">
                <button
                    className="control-button prev"
                    onClick={handlePrevSlide}
                    disabled={currentSlideIndex === 0}
                >
                    ← Назад
                </button>
                <button
                    className="control-button next"
                    onClick={handleNextSlide}
                    disabled={currentSlideIndex === slides.length - 1}
                >
                    Вперед →
                </button>
            </div>
        </div>
    );
};

export default SlideShow;