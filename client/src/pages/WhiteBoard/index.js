import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');
const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context)
            return;
        const drawFromServer = (data) => {
            drawDot(context, data.x, data.y);
        };
        socket.on('drawing', drawFromServer);
        return () => {
            socket.off('drawing', drawFromServer);
        };
    }, []);
    const drawDot = (ctx, x, y) => {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    };
    const handleMouseDown = () => setDrawing(true);
    const handleMouseUp = () => setDrawing(false);
    const handleMouseOut = () => setDrawing(false);
    const handleMouseMove = (e) => {
        if (!drawing || !canvasRef.current)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            drawDot(ctx, x, y);
            socket.emit('drawing', { x, y });
        }
    };
    return (React.createElement("canvas", { ref: canvasRef, width: 800, height: 600, style: { border: '1px solid #000', display: 'block', margin: 'auto' }, onMouseDown: handleMouseDown, onMouseUp: handleMouseUp, onMouseOut: handleMouseOut, onMouseMove: handleMouseMove }));
};
export default Whiteboard;
