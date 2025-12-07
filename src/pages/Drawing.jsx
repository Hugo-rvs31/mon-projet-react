// src/pages/Drawing.jsx  (ou le chemin où est ton fichier)
import Navigation from "../components/Navigation";
import React, { useRef, useEffect, useState } from "react";

const DRAWER_WIDTH = 210; // largeur du tiroir en px
const TOGGLE_WIDTH = 28; // largeur du bouton visible en px

const Drawing = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isEraser, setIsEraser] = useState(false);
  const [stickerDrawerOpen, setStickerDrawerOpen] = useState(false);

  // Brush settings
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(18);

  // initial canvas setup + on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    const resize = () => {
      const wrapper = canvas.parentElement;
      if (!wrapper) return;
      const dpr = window.devicePixelRatio || 1;
      // CSS size
      const cssWidth = wrapper.clientWidth;
      const cssHeight = wrapper.clientHeight;
      // actual pixel size
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      // scale context to match DPR
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // reapply brush settings
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = brushColor;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only once

  // update brush properties when settings change
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineWidth = Number(brushSize);
    ctx.strokeStyle = brushColor;
  }, [brushColor, brushSize]);

  // helper: get position from mouse or touch event
  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    // compute scale between canvas pixel buffer and displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const pos = getEventPos(e);

    if (selectedSticker) {
      placeSticker(pos);
      return;
    }

    setIsDrawing(true);
    setLastPos(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = ctxRef.current;
    const pos = getEventPos(e);

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.shadowBlur = 0;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.shadowBlur = Number(brushSize) / 2;
      ctx.shadowColor = brushColor;
    }

    ctx.lineWidth = Number(brushSize);

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    setLastPos(pos);
  };

  const handleMouseUp = (e) => {
    if (e) e.preventDefault();
    setIsDrawing(false);
  };

  // Touch wrappers (pour compatibilité mobile)
  const handleTouchStart = (e) => handleMouseDown(e);
  const handleTouchMove = (e) => handleMouseMove(e);
  const handleTouchEnd = (e) => handleMouseUp(e);

  const handleErase = () => {
    setIsEraser(true);
    setSelectedSticker(null);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    // clear full canvas buffer (respect devicePixelRatio)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform to clear full pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const placeSticker = (pos) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;

    // Use a font size scaled by brushSize; note: canvas is DPR-scaled
    const size = Number(brushSize) * 2;
    ctx.font = `${size}px serif`;
    // Fill at position (pos coordinates are in pixel buffer units)
    ctx.fillText(selectedSticker, pos.x, pos.y);
  };

  return (
    <div className="Drawing-page">
      <div
        className={`left ${isOpen ? "open" : ""}`}
        style={{ width: `${DRAWER_WIDTH}px` }}
        aria-hidden={!isOpen}
      >
        {/* drawer-toggle reste dans la .left mais dépasse grâce au CSS */}
        <button
          className="drawer-toggle"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fermer le tiroir" : "Ouvrir le tiroir"}
        >
          {isOpen ? "❮" : "❯"}
        </button>

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
                setIsEraser(false);
                setSelectedSticker(null);
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
              onChange={(e) => setBrushSize(Number(e.target.value))}
            />
          </div>

          <div className="tool-group">
            <label>Autocollants :</label>

            <button
              className="toggle-stickers"
              onClick={() => setStickerDrawerOpen(!stickerDrawerOpen)}
            >
              {stickerDrawerOpen ? "Fermer" : "Voir les autocollants"}
            </button>

            {stickerDrawerOpen && (
              <div className="stickers-drawer">
                {[
                  "❤️",
                  "🧡",
                  "💛",
                  "💚",
                  "💙",
                  "💜",
                  "✨",
                  "⭐",
                  "🌟",
                  "⚡",
                  "🌸",
                  "🌼",
                  "🌺",
                  "🍀",
                  "🍁",
                  "🔥",
                  "🌈",
                  "🎈",
                  "🎉",
                  "🐱",
                  "🐶",
                  "🐰",
                  "🐸",
                  "🐼",
                  "🐻",
                  "🍓",
                  "🍒",
                  "🍉",
                  "🥐",
                  "✦",
                  "✧",
                ].map((item) => (
                  <button
                    key={item}
                    className={`sticker-btn ${
                      selectedSticker === item ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelectedSticker(item);
                      setIsEraser(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default Drawing;
