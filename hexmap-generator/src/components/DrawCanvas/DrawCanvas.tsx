import React, { useRef, useCallback, useEffect } from 'react';
import { useHexMap } from '../../context/HexMapContext';
import styles from './DrawCanvas.module.css';

const DrawCanvas: React.FC = () => {
  const { activeTool, drawPaths, addDrawPath, paintColor, drawCanvasRef } = useHexMap();
  const canvasRef = drawCanvasRef as React.RefObject<HTMLCanvasElement>;
  const isDrawing = useRef(false);
  const currentPath = useRef<{ x: number; y: number }[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const path of drawPaths) {
      if (path.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    }

    if (currentPath.current.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = paintColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(currentPath.current[0].x, currentPath.current[0].y);
      for (let i = 1; i < currentPath.current.length; i++) {
        ctx.lineTo(currentPath.current[i].x, currentPath.current[i].y);
      }
      ctx.stroke();
    }
  }, [drawPaths, paintColor, canvasRef]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const parent = parentRef.current;
      if (canvas && parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [redraw, canvasRef, parentRef]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'draw') return;
    isDrawing.current = true;
    currentPath.current = [getPos(e)];
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    currentPath.current.push(getPos(e));
    redraw();
  };

  const onMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentPath.current.length >= 2) {
      addDrawPath({ points: [...currentPath.current], color: paintColor, width: 3 });
    }
    currentPath.current = [];
  };

  const isActive = activeTool === 'draw';

  return (
    <div ref={parentRef} className={`${styles.overlay} ${isActive ? styles.active : ''}`}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
    </div>
  );
};

export default DrawCanvas;