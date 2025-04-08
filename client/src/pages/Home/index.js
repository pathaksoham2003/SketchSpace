import { useEffect, useRef, useState } from "react";
import AuthLayout from "../../layout/AuthLayout";
import useHistory from "../../hooks/useHistory";
import Tools from "./Tools";
import Canvas from "../Canvas.tsx";
import { io } from "socket.io-client";
const Home = () => {
    const isRun = useRef(false);
    const socket = useRef(null);
    const [elements, setElements, undo, redo] = useHistory([]);
    const [tool, setTool] = useState("rectangle");
    const [size, setSize] = useState(0);
    const [color, setColor] = useState({ h: 214, s: 43, v: 90, a: 1 });
    useEffect(() => {
        if (isRun.current)
            return;
        isRun.current = true;
        const socketObj = io("http://localhost:8021");
        socketObj.on("connect", () => {
            console.log(socketObj);
        });
        socket.current = socketObj;
    }, []);
    return (React.createElement(AuthLayout, null,
        React.createElement(Canvas, { elements: elements, setElements: setElements, undo: undo, redo: redo, tool: tool, setTool: setTool, socket: socket }),
        React.createElement(Tools, { color: color, setColor: setColor, setTool: setTool, setSize: setSize, undo: undo, redo: redo })));
};
export default Home;
