import  { useState } from 'react';
import SlideTypeSelector from './components/SlideTypeSelector';
import TextSlide from './components/TextSlide';
import SlideList from './components/SlideList';
import SlideShow from './components/SlideShow';
import QuestionSlide from './components/QuestionSlide';
import CheckBlock from './components/CheckBlock';
// import TestSlide from './components/TestSlide';
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
            questions: []
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
        if (selectedSlideIndex === null) return;
        const updatedSlides = [...slides];
        updatedSlides[selectedSlideIndex].type = type;
        setSlides(updatedSlides);
    };


    const handleSelectSlide = (index) => {
        setSelectedSlideIndex(index);
    };

    const handleImageUpload = (index, imageUrl) => {
        const updatedSlides = [...slides];
        updatedSlides[index].image = imageUrl;  // Сохраняем URL изображения
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
                        questions={selectedSlide.questions}
                        onChange={(content) => {
                            const updatedSlides = [...slides];
                            updatedSlides[selectedSlideIndex].content = content;
                            setSlides(updatedSlides);
                        }}
                        onImageUpload={(image) => handleImageUpload(selectedSlideIndex, image)}
                        slideId={selectedSlideIndex}
                    />
                );
            case 'test':
                return (
                    <CheckBlock
                        questions={selectedSlide.questions}
                        onChange={(field, updatedQuestions) => {
                            const updatedSlides = [...slides];
                            updatedSlides[selectedSlideIndex].questions = updatedQuestions;  // Обновляем вопросы слайда
                            setSlides(updatedSlides);
                        }}
                        slideId={selectedSlideIndex}
                    />
                );
            case 'questionnaire':
                return (
                    <QuestionSlide
                        content={selectedSlide.content}
                        questions={selectedSlide.questions}
                        onChange={(field, value) => {
                            const updatedSlides = [...slides];
                            const slide = updatedSlides[selectedSlideIndex];
                            slide.questions = value;
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
                {/*{slides.length > 0 && (*/}
                {/*    <button onClick={() => setIsSlideShowActive(true)} style={{ marginTop: '20px' }}>*/}
                {/*        Показать презентацию*/}
                {/*    </button>*/}
                {/*)}*/}
            </div>
            {isSlideShowActive && (
                <SlideShow slides={slides} onClose={() => setIsSlideShowActive(false)} />
            )}
        </div>
    );
};

export default App;
