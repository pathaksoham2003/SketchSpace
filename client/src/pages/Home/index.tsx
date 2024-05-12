import { Fragment, useEffect, useRef, useState } from "react";
import AuthLayout from "../../layout/AuthLayout";
import useHistory from "../../hooks/useHistory";
import Tools from "./Tools";
import Canvas from "../Canvas.tsx";
import {Socket, io}  from "socket.io-client";
import Chat from "./Chat.tsx";

const Home = () => {
  const isRun = useRef<boolean>(false);
  const socket = useRef<Socket | null>(null);
  const [elements, setElements, undo, redo] = useHistory([]);
  const [tool, setTool] = useState<string>("pencil");
  const [size, setSize] = useState<number>(3);
  const [color, setColor] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [chat,setChat] = useState(false);

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;
    const socketObj :Socket = io("http://localhost:8021");
    socketObj.on("connect",()=>{
      console.log(socketObj);
    })
    socket.current = socketObj;
  }, []);

  return (
    <AuthLayout>
      <Canvas
        elements={elements}
        setElements={setElements}
        undo={undo}
        redo={redo}
        tool={tool}
        socket={socket}
        size={size}
        color={color}
      />
      <Chat visible={chat} socket={socket}/>
      <Tools
        color={color}
        setColor={setColor}
        setTool={setTool}
        setSize={setSize}
        undo={undo}
        redo={redo}
        setChat={setChat}
      />
      {/* <button  onClick={()=>client.logout()} className="btn btn-primary">Logout</button> */}
    </AuthLayout>
  );
};

export default Home;
