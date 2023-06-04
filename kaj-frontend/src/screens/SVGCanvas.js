import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faSquare, faPencilAlt, faTimes, faSave, faTrash, faFont } from '@fortawesome/free-solid-svg-icons';
import './assets/SVGCanvas.css';

// Component for the SVG canvas
const SVGCanvas = () => {
  const [drawings, setDrawings] = useState([]);
  const [shape, setShape] = useState('circle');
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [text, setText] = useState('');
  const svgRef = useRef();
  const drawingRef = useRef();
  const navigate = useNavigate();

   // Handler for mouse down event on the SVG canvas
  const handleMouseDown = (event) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (shape === 'text') {
      const newDrawing = { shape, color, x, y, text };
      setDrawings([...drawings, newDrawing]);
      setText('');
      setShape('');
    } else {
      const newDrawing = { shape, color, x, y, size: 10 };
      if (shape === 'pencil') {
        newDrawing.path = `M${x},${y}`;
      }
      setDrawings([...drawings, newDrawing]);
      drawingRef.current = newDrawing;
      setIsDrawing(true);
    }
  };

  // Handler for mouse move event on the SVG canvas
  const handleMouseMove = (event) => {
    if (!isDrawing || shape === 'text') return;
    const rect = svgRef.current.getBoundingClientRect();

    if (shape === 'pencil') {
      const newPath = ` L${event.clientX - rect.left},${event.clientY - rect.top}`;
      drawingRef.current.path += newPath;
    } else {
      const size = Math.abs(event.clientX - rect.left - drawingRef.current.x);
      drawingRef.current.size = size;
    }

    setDrawings([...drawings]);
  };

  // Handler for mouse up event on the SVG canvas
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Handler for the clear button
  const handleClear = () => {
    setDrawings([]);
    localStorage.removeItem("drawings");
  };

  // Handler for the save and exit button
  const handleSaveAndExit = () => {
    localStorage.setItem("drawings", JSON.stringify(drawings));
    navigate('/calendar');
  };

  // Handler for the exit button
  const handleExit = () => {
    navigate('/calendar');
  };

  // Load saved drawings from local storage on component mount
  useEffect(() => {
    const savedDrawings = JSON.parse(localStorage.getItem("drawings"));
    if (savedDrawings) {
      setDrawings(savedDrawings);
    }
  }, []);

  return (
    <div className="svg-canvas-container">
      <nav className="menu-canvas">
        <div className="menu-row">
          <FontAwesomeIcon icon={faCircle} onClick={() => setShape('circle')} />
          <FontAwesomeIcon icon={faSquare} onClick={() => setShape('square')} />
          <FontAwesomeIcon icon={faPencilAlt} onClick={() => setShape('pencil')} />
          <FontAwesomeIcon icon={faFont} onClick={() => setShape('text')} />
        </div>
        <div className="menu-row">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="menu-row">
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type something..." />
        </div>
        <div className="menu-row">
          <FontAwesomeIcon icon={faTrash} onClick={handleClear} />
          <FontAwesomeIcon icon={faSave} onClick={handleSaveAndExit} />
          <FontAwesomeIcon icon={faTimes} onClick={handleExit} />
        </div>
      </nav>
      <svg
        ref={svgRef}
        className="svg-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e) => {
          e.preventDefault();
          svgRef.current.scrollTop += e.deltaY;
          svgRef.current.scrollLeft += e.deltaX;
        }}
      >
        {drawings.map((drawing, index) => drawing.shape === 'circle' ?
          (<circle
            key={index}
            cx={drawing.x}
            cy={drawing.y}
            r={drawing.size / 2}
            fill={drawing.color}
          />) :
          drawing.shape === 'square' ?
          (<rect
            key={index}
            x={drawing.x}
            y={drawing.y}
            width={drawing.size}
            height={drawing.size}
            fill={drawing.color}
          />) :
          drawing.shape === 'pencil' ?
          (<path
            key={index}
            d={drawing.path}
            stroke={drawing.color}
            fill="none"
          />) :
          (<text
            key={index}
            x={drawing.x}
            y={drawing.y}
            fill={drawing.color}
          >{drawing.text}</text>)
        )}
      </svg>
    </div>
  );
};

export default SVGCanvas;
