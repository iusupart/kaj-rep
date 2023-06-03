import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './SVGCanvas.css';

const SVGCanvas = () => {
  const [drawings, setDrawings] = useState([]);
  const [shape, setShape] = useState('circle');
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [text, setText] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef();
  const drawingRef = useRef();
  const navigate = useNavigate();

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

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setDrawings([]);
    localStorage.removeItem("drawings");
  };

  const handleSaveAndExit = () => {
    localStorage.setItem("drawings", JSON.stringify(drawings));
    navigate('/calendar');
  };

  const handleExit = () => {
    navigate('/calendar');
  };

  useEffect(() => {
    const savedDrawings = JSON.parse(localStorage.getItem("drawings"));
    if (savedDrawings) {
      setDrawings(savedDrawings);
    }
  }, []);

  return (
    <div className="svg-canvas-container">
      <div className="menu-canvas">
        <button onClick={() => setShape('circle')}>Circle</button>
        <button onClick={() => setShape('square')}>Square</button>
        <button onClick={() => setShape('pencil')}>Pencil</button>
        <button onClick={handleClear}>Clear</button>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={() => setShape('text')}>Add Text</button>
        <button onClick={handleSaveAndExit}>Save and Exit</button>
        <button onClick={handleExit}>Exit without Saving</button>
      </div>
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
