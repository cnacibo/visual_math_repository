import { useState } from 'react';
import PropTypes from 'prop-types';

const SlideList = ({ slides, onAddSlide, onRemoveSlide, onSelectSlide }) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('Calculus');


    const getCSRFToken = () => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookie ? cookie.split('=')[1] : null;
    };
    // Функция для сохранения презентации в БД
    const savePresentation = async () => {
        if (!title.trim()) {
            alert('Введите название лекции!');
            return;
        }



    const presentationData = {
        title,
        subject,
        slides,
    }

        console.log("Данные для отправки:", presentationData);

        try {
            const response = await fetch('/presentations/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(), // Добавляем CSRF-токен
                },
                credentials: 'include', // Важно для передачи cookies
                body: JSON.stringify(presentationData),
            });

            if (response.ok) {
                alert('Презентация сохранена!');
            } else {
                const errorResponse = await response.json();  // Читаем ответ сервера в формате JSON
                alert(`Ошибка при сохранении презентации: ${errorResponse.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка соединения с сервером');
        }
    };

    const goToHomePage = () => {
      const shouldLeave = confirm('Не забудьте сохранить презентацию перед выходом!\n\nНажмите "OK" чтобы выйти или "Отмена" чтобы остаться');

      if (shouldLeave) {
        window.location.href = "/home";
      }
    };

    return (
        <div className="slide-list-container">
            <div className="presentation-settings">
                <h3 className="settings-title">Настройки презентации</h3>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Название лекции:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="subject" className="form-label">Предмет:</label>
                    <select
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="Calculus">Математический анализ</option>
                        <option value="Algebra">Алгебра</option>
                        <option value="Discrete">Дискретная математика</option>
                    </select>
                </div>
            </div>

            <div className="slides-section">
                <h3 className="slides-title">Слайды</h3>
                <ul className="slides-list">
                    {slides.map((slide, index) => (
                        <li
                            key={index}
                            className="slide-item"
                            onClick={() => onSelectSlide(index)}
                        >
                            <span className="slide-number">Слайд {index + 1}</span>
                            <button
                                className="delete-slide-btn"
                                onClick={(e) => { e.stopPropagation(); onRemoveSlide(index); }}>Удалить</button>
                        </li>
                    ))}
                </ul>
                <button className="add-slide-btn" onClick={onAddSlide}>+ Добавить слайд</button>
            </div>
            <div className="action-buttons">
                <button className="save-btn" onClick={savePresentation}>
                    Сохранить презентацию
                </button>
                 <button className="exit-btn" onClick={goToHomePage}>
                    Выйти из редактирования
                </button>
            </div>
        </div>
    );
};
SlideList.propTypes = {
    slides: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired, // Тип слайда
            content: PropTypes.string, // Содержимое слайда
            questions: PropTypes.array, // Вопросы (если есть)
        })
    ).isRequired, // Массив слайдов
    onAddSlide: PropTypes.func.isRequired, // Добавление нового слайда
    onRemoveSlide: PropTypes.func.isRequired, // Удаление слайда
    onSelectSlide: PropTypes.func.isRequired, // Выбор слайда
};
export default SlideList;
