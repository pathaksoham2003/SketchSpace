import React, { useRef, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { saveAs } from "file-saver";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { motion } from "framer-motion";
import { FaUndo, FaRedo, FaSave, FaEraser } from "react-icons/fa";
import { MdGroup, MdHome, MdMessage } from "react-icons/md";
import { getKey } from "../../utils/localStorage";
import useBoard from "../../services/useBoard";
import useBoardChat from "../../services/useBoardChat";
import ChatModal from "../../component/ChatModal";
import ParticipantsModal from "../../component/ParticipantsModal";

import {
  setLines,
  addLine,
  setRedoStack,
  clearBoard,
  setStroke,
  setStrokeWidth,
  setChatInput,
  addChatMessage,
  setParticipants,
  setBoardName,
  setInviteEmail,
  setChatMessages,
  toggleChatModal,
  toggleParticipantsModal,
} from "../../slices/BoardSlice";

const socket = io(import.meta.env.VITE_SOCKET_URL);

const generateColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 70%, 50%)`;
};

const Whiteboard: React.FC = () => {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const { initialized, keycloak } = useKeycloak();
  const dispatch = useAppDispatch();
  const {
    lines,
    tool,
    stroke,
    strokeWidth,
    redoStack,
    chatMessages,
    chatInput,
    boardName,
    participants,
    inviteEmail,
    showChatModal,
    showParticipantsModal,
  } = useAppSelector((state) => state.whiteboard);

  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const { getBoard, inviteMember } = useBoard();
  const { getChats } = useBoardChat();

  const updateBoard = async () => {
    if (boardId) {
      try {
        const board = await getBoard(boardId);
        if (board?.name) dispatch(setBoardName(board.name));
        if (board?.content) dispatch(setLines(board.content));
        if (board?.participants) dispatch(setParticipants(board.participants));
        const messages = await getChats(boardId);
        dispatch(setChatMessages(messages));
      } catch (err) {
        console.error("Failed to fetch board data:", err);
      }
    }
  };

  useEffect(() => {
    updateBoard();
  }, []);

  useEffect(() => {
    socket.on("update-lines", (updatedLines) => dispatch(setLines(updatedLines)));
    socket.on("draw", (line) => dispatch(addLine(line)));
    socket.on("chat-message", (msg) => dispatch(addChatMessage(msg)));

    return () => {
      socket.off("update-lines");
      socket.off("draw");
      socket.off("chat-message");
    };
  }, []);

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      socket.emit("join-board", boardId);
      updateBoard();
    }
  }, [initialized, keycloak, boardId]);

  const handleMouseDown = (e: any) => {
    if (!keycloak.authenticated) return;
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      tool,
      points: [pos.x, pos.y],
      stroke,
      strokeWidth,
      userId: keycloak.tokenParsed?.sub || "anon",
    };
    dispatch(addLine(newLine));
    dispatch(setRedoStack([]));
  };


  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = { ...lines[lines.length - 1] };
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    const updatedLines = [...lines.slice(0, -1), lastLine];
    dispatch(setLines(updatedLines));
    socket.emit("draw", { boardId, line: lastLine });
  };

  const handleMouseUp = () => (isDrawing.current = false);

  const handleUndo = () => {
    const userId = keycloak.tokenParsed?.sub || "anon";
    const newLines = [...lines];

    for (let i = newLines.length - 1; i >= 0; i--) {
      if (newLines[i].userId === userId) {
        const removedLine = newLines.splice(i, 1);

        dispatch(setLines(newLines));
        dispatch(setRedoStack([...redoStack, removedLine]));
        socket.emit("undo", { boardId, userId, removedLine });
        break;
      }
    }
  };


  const handleRedo = () => {
    const userId = keycloak.tokenParsed?.sub || "anon";

    if (redoStack.length === 0) return;

    const lastRedo = redoStack[redoStack.length - 1];

    const filteredRedo = lastRedo.filter((l) => l.userId === userId);
    if (filteredRedo.length === 0) return;

    const newLines = [...lines, ...filteredRedo];
    dispatch(setLines(newLines));
    dispatch(setRedoStack(redoStack.slice(0, -1)));

    socket.emit("redo", { boardId, userId, restoredLines: filteredRedo });
  };



  const handleCleanBoard = () => {
    const userId = keycloak.tokenParsed?.sub || "anon";
    dispatch(clearBoard());
    socket.emit("clean-board", { boardId, userId });
  };

  const handleExportImage = () => {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL({ pixelRatio: 2 });

    const image = new Image();
    image.src = dataURL;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(image, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, "whiteboard.png");
      }, "image/png");
    };
  };


  const handleInvite = async () => {
    try {
      if (!boardId) return;
      const res = await inviteMember(boardId, inviteEmail);
      alert("Invitation sent!");
      dispatch(setInviteEmail(""));
      dispatch(setParticipants(res.board.participants));
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  const sendMessage = () => {
    const msg = chatInput.trim();
    if (msg) {
      const userData = getKey("user");
      const userId = userData._id;
      const username = userData.username;
      const data = { boardId, userId, message: msg, username };
      socket.emit("chat-message", data);
      dispatch(setChatInput(""));
    }
  };

  if (!initialized) return <div>Loading Keycloak...</div>;
  if (!keycloak.authenticated) return null;

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const user = keycloak.tokenParsed;
  const userInitials = initials(user?.preferred_username || "U");

  return (
    <div className="relative p-4 w-full min-h-screen bg-white">
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Sketch Space <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="text-indigo-600 font-semibold">| {boardName}</motion.span>
        </motion.h1>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: generateColorFromString(user?.name || "User") }}
          >
            {userInitials}
          </div>
          <span className="text-gray-700 font-medium">{user?.name || "User"}</span>
        </div>
      </div>

      <ParticipantsModal
        show={showParticipantsModal}
        participants={participants}
        inviteEmail={inviteEmail}
        setInviteEmail={(email: string) => dispatch(setInviteEmail(email))}
        handleInvite={handleInvite}
        onClose={() => dispatch(toggleParticipantsModal())}
      />

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input type="color" value={stroke} onChange={(e) => dispatch(setStroke(e.target.value))} className="rounded-full w-10 h-10 border border-gray-300" />
          <input type="range" min="1" max="10" value={strokeWidth} onChange={(e) => dispatch(setStrokeWidth(Number(e.target.value)))} className="w-24" />
          <button onClick={handleUndo} className="btn-action" title="Undo"><FaUndo /></button>
          <button onClick={handleRedo} className="btn-action" title="Redo"><FaRedo /></button>
          <button onClick={handleCleanBoard} className="btn-action" title="Clear Board"><FaEraser /></button>
          <button onClick={handleExportImage} className="btn-action" title="Export Image"><FaSave /></button>
        </div>
        <div className="flex">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/")} className="px-4 py-2 mr-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2">
            <MdHome /> Home
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => dispatch(toggleParticipantsModal())} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 flex items-center gap-2">
            <MdGroup /> Participants
          </motion.button>
        </div>
      </div>

      <div className="absolute right-10 bottom-10 bg-gradient-to-tr from-purple-200 via-indigo-200 z-30 to-white shadow-2xl shadow-black h-16 w-16 flex items-center justify-center rounded-full">
        <button
          onClick={() => dispatch(toggleChatModal())}
          className="rounded-full w-full h-full flex items-center justify-center btn-action shadow-lg hover:shadow-xl transition-all"
        >
          <MdMessage size={25} />
        </button>
      </div>


      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 150}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-gray-300"
      >
        <Layer>
          {lines.map((line, index) => (
            <Line key={index} points={line.points} stroke={line.stroke} strokeWidth={line.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" />
          ))}
        </Layer>
      </Stage>

      <ChatModal
        show={showChatModal}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={(value: string) => dispatch(setChatInput(value))}
        sendMessage={sendMessage}
        onClose={() => dispatch(toggleChatModal())}
      />
    </div>
  );
};

export default Whiteboard;
