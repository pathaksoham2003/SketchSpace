import React, { useRef, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface DrawingData {
  x: number;
  y: number;
}

const socket: Socket = io('http://localhost:3000');

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const drawFromServer = (data: DrawingData) => {
      drawDot(context, data.x, data.y);
    };

    socket.on('drawing', drawFromServer);

    return () => {
      socket.off('drawing', drawFromServer);
    };
  }, []);

  const drawDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseDown = () => setDrawing(true);
  const handleMouseUp = () => setDrawing(false);
  const handleMouseOut = () => setDrawing(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      drawDot(ctx, x, y);
      socket.emit('drawing', { x, y });
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid #000', display: 'block', margin: 'auto' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onMouseMove={handleMouseMove}
    />
  );
};

export default Whiteboard;
