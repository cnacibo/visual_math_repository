import { useState } from 'react';
import PropTypes from 'prop-types';
// import SlideList from "./SlideList.jsx";

const TestSlide = ({ type, style, onUpdateStyle, onDelete }) => {
    // const [isResizing, setIsResizing] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (e.target === e.currentTarget) {
            setIsMoving(true);
            setStartPos({ x: e.clientX, y: e.clientY });
            e.stopPropagation();
        }
    };

    const handleMouseMove = (e) => {
        if (isMoving) {
            const newLeft = style.left + (e.clientX - startPos.x);
            const newTop = style.top + (e.clientY - startPos.y);
            onUpdateStyle({ ...style, left: newLeft, top: newTop });
            setStartPos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsMoving(false);
    };

    const handleDoubleClick = () => {
        onDelete();
    };

    const shapeStyle = {
        ...style,
        cursor: 'pointer',
    };

    if (type === 'circle') {
        shapeStyle.borderRadius = '50%';
    } else if (type === 'triangle') {
        shapeStyle.width = '0';
        shapeStyle.height = '0';
        shapeStyle.borderLeft = `${style.width / 2}px solid transparent`;
        shapeStyle.borderRight = `${style.width / 2}px solid transparent`;
        shapeStyle.borderBottom = `${style.height}px solid ${style.backgroundColor}`;
        shapeStyle.backgroundColor = 'transparent';
    } else if (type === 'line') {
        shapeStyle.height = '2px';
    }

    return (
        <div
            style={shapeStyle}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
        >
            {type}
        </div>
    );
};

TestSlide.propTypes = {
    type: PropTypes.oneOf(['circle', 'triangle', 'line']).isRequired, // <button class="citation-flag" data-index="1"><button class="citation-flag" data-index="7">
    style: PropTypes.shape({ // <button class="citation-flag" data-index="1"><button class="citation-flag" data-index="6">
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        backgroundColor: PropTypes.string.isRequired
    }).isRequired,
    onUpdateStyle: PropTypes.func.isRequired, // <button class="citation-flag" data-index="4"><button class="citation-flag" data-index="7">
    onDelete: PropTypes.func.isRequired // <button class="citation-flag" data-index="4"><button class="citation-flag" data-index="7">
};

export default TestSlide;