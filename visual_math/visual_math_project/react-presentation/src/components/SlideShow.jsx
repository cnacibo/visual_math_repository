import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
// import './SlideShow.css';

const SlideShow = ({ slides, onClose, isStandalone = false }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isFullscreen] = useState(true);

    useEffect(() => {
    if (isStandalone) {
      // Специфичная логика для standalone-режима
      document.body.classList.add('presentation-mode');
      return () => document.body.classList.remove('presentation-mode');
    }
  }, []);

    useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}, [onClose]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNextSlide();
            if (e.key === 'ArrowLeft') handlePrevSlide();
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentSlideIndex]);

    useEffect(() => {
        const handleResize = () => {
            const container = document.querySelector('.slide-show');
            const targetWidth = container.clientWidth;
            const targetHeight = container.clientHeight;
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

    // Функция для открытия презентации
// const openPresentation = async (lectureId) => {
//   try {
//     const response = await fetch(`/presentations/api/${lectureId}/slides`);
//     const slidesData = await response.json();
//     setCurrentSlideIndex(slidesData);
//   } catch (error) {
//     console.error('Ошибка загрузки слайдов:', error);
//   }
// };

    const renderSlideContent = () => {
        const currentSlide = slides[currentSlideIndex];

        switch(currentSlide?.type) {
            case 'text':
                return (
                    <div className="text-slide">
                        <BlockMath>{currentSlide.content}</BlockMath>
                        {currentSlide?.image && (
                            <img
                                src={currentSlide.image}
                                alt="Иллюстрация"
                                className="slide-image"
                            />
                        )}
                    </div>
                );

            case 'questionnaire':
                return (
                    <div className="question-slide">
                        <h2>Вопросник</h2>
                        <BlockMath>{currentSlide.content}</BlockMath>
                        <div className="questions-list">
                            {currentSlide.questions?.map((q, index) => (
                                <div key={index} className="question-item">
                                    <BlockMath>{q.question}</BlockMath>
                                    <div className="answers">
                                        {q.answers?.map((a, ansIndex) => (
                                            <div
                                                key={ansIndex}
                                                className={`answer ${a.isCorrect ? 'correct' : ''}`}
                                            >
                                                <BlockMath>{a.text}</BlockMath>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'test':
                return (
                    <div className="test-slide">
                        <h2>Проверочный тест</h2>
                        {currentSlide.questions?.map((q, index) => (
                            <div key={index} className="test-question">
                                <h3>Вопрос {index + 1}</h3>
                                <BlockMath>{q.question}</BlockMath>
                                <div className="answers">
                                    {q.answers?.map((a, ansIndex) => (
                                        <div
                                            key={ansIndex}
                                            className={`answer ${a.isCorrect ? 'correct' : ''}`}
                                        >
                                            <BlockMath>{a.text}</BlockMath>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return <div>Неизвестный тип слайда</div>;
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
                {renderSlideContent()}
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
SlideShow.propTypes = {
    slides: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            content: PropTypes.string,
            image: PropTypes.string,
            questions: PropTypes.arrayOf(
                PropTypes.shape({
                    text: PropTypes.string,
                    isCorrect: PropTypes.bool
                })
            )
        })
    ).isRequired,
    onClose: PropTypes.func.isRequired,
    isStandalone: PropTypes.bool
};
export default SlideShow;