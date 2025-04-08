import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { saveAs } from "file-saver";
import { io } from "socket.io-client";
import { useKeycloak } from "@react-keycloak/web";

const socket = io("http://localhost:3000");

interface LineProps {
    tool: string;
    points: number[];
    stroke: string;
    strokeWidth: number;
    userId: string;
}

const Whiteboard: React.FC = () => {
    const { initialized, keycloak } = useKeycloak();
    const [lines, setLines] = useState<LineProps[]>([]);
    const [tool, setTool] = useState("pen");
    const [stroke, setStroke] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [history, setHistory] = useState<LineProps[][]>([]);
    const [redoStack, setRedoStack] = useState<LineProps[][]>([]);
    const isDrawing = useRef(false);
    const stageRef = useRef<any>(null);

    // 👇 Redirect to Keycloak login if not authenticated
    useEffect(() => {
        if (initialized && !keycloak.authenticated) {
            keycloak.login();
        }
    }, [initialized, keycloak]);

    useEffect(() => {
        socket.on("draw", (line: LineProps) => {
            setLines((prev) => [...prev, line]);
        });
    }, []);

    const handleMouseDown = (e: any) => {
        if (!keycloak.authenticated) return;
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        const newLine: LineProps = {
            tool,
            points: [pos.x, pos.y],
            stroke,
            strokeWidth,
            userId: keycloak.tokenParsed?.sub || "anon"
        };
        setLines([...lines, newLine]);
        setHistory([...history, [...lines]]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing.current) return;
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines([...lines]);
        socket.emit("draw", lastLine);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleUndo = () => {
        const newHistory = [...history];
        if (newHistory.length > 0) {
            const lastState = newHistory.pop();
            setRedoStack([...redoStack, lines]);
            setLines(lastState!);
            setHistory(newHistory);
        }
    };

    const handleRedo = () => {
        const newRedo = [...redoStack];
        if (newRedo.length > 0) {
            const restored = newRedo.pop();
            setHistory([...history, lines]);
            setLines(restored!);
            setRedoStack(newRedo);
        }
    };

    const handleExportImage = () => {
        const uri = stageRef.current.toDataURL();
        saveAs(uri, "whiteboard.png");
    };

    // 👇 You can remove this fallback now since login is auto-triggered
    if (!initialized) return <div>Loading Keycloak...</div>;
    if (!keycloak.authenticated) return null; // Or a loading spinner


    return (
        <div className="container p-4">
            <div className="mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="d-flex gap-2 flex-wrap">
                    <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} />
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    />
                    <button onClick={handleUndo}>Undo</button>
                    <button onClick={handleRedo}>Redo</button>
                    <button onClick={handleExportImage}>Save Image</button>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <span className="text-muted small">
                        {keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.email || "User"}
                    </span>
                    <button
                        onClick={() => keycloak.logout()}
                        className="btn btn-sm btn-outline-danger"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <Stage
                width={window.innerWidth - 50}
                height={window.innerHeight - 150}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.stroke}
                            strokeWidth={line.strokeWidth}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation="source-over"
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default Whiteboard;
