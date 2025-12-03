import Navigation from "../components/Navigation";
import React, { useRef, useEffect, useState } from "react";

const Drawing = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [selectedSticker, setSelectedSticker] = useState(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [isEraser, setIsEraser] = useState(false);
  const [stickerDrawerOpen, setStickerDrawerOpen] = useState(false);

  // Brush settings
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(18);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;
  }, []); // ← Très important : vide

  // 🟦 Mise à jour pinceau/couleur — sans reset du canvas
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
  }, [brushColor, brushSize]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // rapport largeur réelle / largeur CSS
    const scaleY = canvas.height / rect.height; // rapport hauteur réelle / hauteur CSS
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);

    if (selectedSticker) {
      placeSticker(pos);
      return;
    }

    setIsDrawing(true);
    setLastPos(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const ctx = ctxRef.current;
    const pos = getMousePos(e);

    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.shadowBlur = 0;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.shadowBlur = brushSize / 2;
      ctx.shadowColor = brushColor;
    }

    ctx.lineWidth = brushSize;

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
    setSelectedSticker(null);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const placeSticker = (pos) => {
    const ctx = ctxRef.current;

    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;

    ctx.font = `${brushSize * 2}px serif`;
    ctx.fillText(selectedSticker, pos.x, pos.y);
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
              onChange={(e) => setBrushSize(e.target.value)}
            />
          </div>

          <div className="tool-group">
            <label>Autocollants :</label>

            {/* bouton pour ouvrir / fermer */}
            <button
              className="toggle-stickers"
              onClick={() => setStickerDrawerOpen(!stickerDrawerOpen)}
            >
              {stickerDrawerOpen ? "Fermer" : "Voir les autocollants"}
            </button>

            {/* tiroir */}
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
                  "✩",
                  "✪",
                  "✫",
                  "✬",
                  "✭",
                  "✮",
                  "✯",
                  "🪼",
                  "🫧",
                  "🫠",
                  "🫥",
                  "🫨",
                  "🪄",
                  "🪶",
                  "🪩",
                  "🪬",
                  "👁️‍🗨️",
                  "👾",
                  "🛸",
                  "🔮",
                  "🪐",
                  "🧿",
                  "☄️",
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
          />
        </div>
      </div>
    </div>
  );
};

export default Drawing;
