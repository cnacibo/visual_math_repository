import React, { useState } from 'react';
import SlideTypeSelector from './components/SlideTypeSelector';
import TextSlide from './components/TextSlide';
import SlideList from './components/SlideList';
import SlideShow from './components/SlideShow';
import QuestionSlide from './components/QuestionSlide';
import CheckBlock from './components/CheckBlock';
import './App.css';
import './index.css';

const App = () => {
    const [slides, setSlides] = useState([]);
    const [selectedSlideIndex, setSelectedSlideIndex] = useState(null);
    const [isSlideShowActive, setIsSlideShowActive] = useState(false); // Состояние для режима презентации

    const handleAddSlide = () => {
        const newSlide = {
            id: Date.now(),
            type: null,
            content: '',
            image: null,
            questions: [],
            answers: []
        }; // добавляем id слайда
        setSlides([...slides, newSlide]);
        setSelectedSlideIndex(slides.length);
    };

    const handleRemoveSlide = (index) => {
        const updatedSlides = slides.filter((_, i) => i !== index);
        setSlides(updatedSlides);
        if (selectedSlideIndex === index) {
            setSelectedSlideIndex(null);
        }
    };

    const handleSlideTypeSelect = (type) => {
        const updatedSlides = [...slides];
        updatedSlides[selectedSlideIndex].type = type;
        setSlides(updatedSlides);
    };


    const handleSelectSlide = (index) => {
        setSelectedSlideIndex(index);
    };

    const handleImageUpload = (index, image) => {
        const updatedSlides = [...slides];
        updatedSlides[index].image = image;
        setSlides(updatedSlides);
    };

    const renderSelectedSlide = () => {
        if (selectedSlideIndex === null || !slides[selectedSlideIndex]) return null;

        const selectedSlide = slides[selectedSlideIndex];

        if (!selectedSlide.type) {
            return <SlideTypeSelector onSelect={handleSlideTypeSelect} selectedSlideIndex={selectedSlideIndex} />;
        }

        switch (selectedSlide.type) {
            case 'text':
                return (
                    <TextSlide
                        content={selectedSlide.content}
                        onChange={(content) => {
                            const updatedSlides = [...slides];
                            updatedSlides[selectedSlideIndex].content = content;
                            setSlides(updatedSlides);
                        }}
                        onImageUpload={(image) => handleImageUpload(selectedSlideIndex, image)}
                        slideId={selectedSlideIndex} // Передаем ID слайда в TextSlide
                    />
                );
            case 'test':
                return <CheckBlock />;
            case 'questionnaire':
                return (
                    <QuestionSlide
                        content={selectedSlide.content}
                        questions={selectedSlide.questions}
                        answers={selectedSlide.answers}
                        onChange={(field, value) => {
                            const updatedSlides = [...slides];
                            const slide = updatedSlides[selectedSlideIndex];
                            if (field === 'question'){
                                slide.questions = [value];
                            } else if (field === 'answers') {
                                slide.answers = value;
                            }
                            setSlides(updatedSlides);
                        }}
                        slideId={selectedSlideIndex}
                    />
                );
            default:
                return null;
        }
    };



    return (
        <div style={{ display: 'flex' }}>
            <SlideList
                slides={slides}
                onAddSlide={handleAddSlide}
                onRemoveSlide={handleRemoveSlide}
                onSelectSlide={handleSelectSlide}
            />
            <div style={{ flex: 1, padding: '10px' }}>
                {selectedSlideIndex !== null ? (
                    renderSelectedSlide()
                ) : (
                    <div>Выберите слайд или добавьте новый</div>
                )}
                {slides.length > 0 && (
                    <button onClick={() => setIsSlideShowActive(true)} style={{ marginTop: '20px' }}>
                        Показать презентацию
                    </button>
                )}
            </div>
            {isSlideShowActive && (
                <SlideShow slides={slides} onClose={() => setIsSlideShowActive(false)} />
            )}
        </div>
    );
};

export default App;
