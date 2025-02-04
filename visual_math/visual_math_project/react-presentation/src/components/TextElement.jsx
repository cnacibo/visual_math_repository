import React, { useState } from 'react';

const TextElement = ({ initialText, onUpdate }) => {
    const [text, setText] = useState(initialText);

    const handleChange = (e) => {
        setText(e.target.value);
        onUpdate(e.target.value);
    };

    return (
        <textarea
            value={text}
            onChange={handleChange}
            placeholder="Введите текст"
        />
    );
};

export default TextElement;