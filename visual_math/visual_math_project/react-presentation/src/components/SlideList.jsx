import React, { useState } from 'react';

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
        };

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
                alert('Ошибка при сохранении презентации');
            }
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка соединения с сервером');
        }
    };

    return (
        <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '10px' }}>
            <h3>Настройки презентации</h3>
            <label htmlFor="title">Название лекции:</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-control"
                style={{ width: '100%', marginBottom: '10px' }}
            />

            <label htmlFor="subject">Предмет:</label>
            <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="form-control"
                style={{ width: '100%', marginBottom: '20px' }}
            >
                <option value="Calculus">Математический анализ</option>
                <option value="Algebra">Алгебра</option>
                <option value="Discrete">Дискретная математика</option>
            </select>

            <h3>Слайды</h3>
            <ul>
                {slides.map((slide, index) => (
                    <li
                        key={index}
                        style={{ margin: '5px 0', cursor: 'pointer' }}
                        onClick={() => onSelectSlide(index)}
                    >
                        Слайд {index + 1}
                        <button onClick={(e) => { e.stopPropagation(); onRemoveSlide(index); }}>Удалить</button>
                    </li>
                ))}
            </ul>
            <button onClick={onAddSlide}>Добавить слайд</button>
            <button onClick={savePresentation} style={{ marginTop: '10px', backgroundColor: 'green', color: 'white' }}>
                Сохранить презентацию
            </button>
        </div>
    );
};

export default SlideList;
