import Navigation from "../components/Navigation";
import React, { useRef, useEffect, useState } from "react";

const Drawing = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isEraser, setIsEraser] = useState(false);

  // Brush settings
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(18);

  // Initialisation du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctxRef.current = ctx;

    const handleResize = () => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
      ctx.putImageData(imgData, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = brushColor;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [brushColor, brushSize]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setLastPos(getMousePos(e));
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    const pos = getMousePos(e);

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out"; // active la gomme
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over"; // pinceau normal
      ctx.strokeStyle = brushColor;
    }

    ctx.lineWidth = brushSize;
    ctx.shadowBlur = brushSize / 2;
    ctx.shadowColor = isEraser ? "transparent" : brushColor;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPos(pos);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleErase = () => {
    setIsEraser(true);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="Drawing-page">
      <div className="left">
        <div className="navigation-part">
          <Navigation />
        </div>

        <div className="tools-part">
          <h3>Outils</h3>

          <div className="tool-group">
            <label>Couleur:</label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => {
                setBrushColor(e.target.value);
                setIsEraser(false); // repasse en pinceau
              }}
            />
          </div>

          <div className="tool-group">
            <label>Taille:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
            />
          </div>

          <button onClick={handleErase}>Gomme</button>
          <button onClick={handleClear}>Effacer tout</button>
        </div>
      </div>

      <div className="box-drawing">
        <div className="h1-box">
          <h1>You can make your own drawing</h1>
        </div>

        <div className="drawing-wrapper">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>
    </div>
  );
};

export default Drawing;
