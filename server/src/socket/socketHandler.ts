import { Server, Socket } from "socket.io";
import Board from "../models/Board.js";
import ChatMessageModel from "../models/ChatMesssage.js";

interface DrawEventData {
  boardId: string;
  line: any; 
}

interface UndoRedoEventData {
  boardId: string;
  userId: string;
  removedLine?: any[];
  restoredLines?: any[];
}

interface CleanBoardEventData {
  boardId: string;
  userId: string;
}

interface ChatMessageEventData {
  boardId: string;
  userId: string;
  username: string;
  message: string;
}

export default function setupSocketHandlers(io: Server): void {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-board", (boardId: string) => {
      socket.join(boardId);
    });

    socket.on("draw", async ({ boardId, line }: DrawEventData) => {
      socket.to(boardId).emit("draw", line);
      try {
        await Board.findByIdAndUpdate(boardId, {
          $push: { content: line },
        });
      } catch (err) {
        console.error("Failed to save drawing to DB:", err);
      }
    });

    socket.on("undo", async ({ boardId, userId, removedLine }: UndoRedoEventData) => {
      try {
        const board = await Board.findById(boardId);
        if (board && removedLine) {
          board.content = board.content.filter(
            (line: any) => JSON.stringify(line) !== JSON.stringify(removedLine[0])
          );
          await board.save();
          io.to(boardId).emit("update-lines", board.content);
        }
      } catch (err) {
        console.error("Failed to undo line:", err);
      }
    });

    socket.on("redo", async ({ boardId, userId, restoredLines }: UndoRedoEventData) => {
      try {
        const board = await Board.findById(boardId);
        if (board && restoredLines) {
          board.content.push(...restoredLines);
          await board.save();
          io.to(boardId).emit("update-lines", board.content);
        }
      } catch (err) {
        console.error("Failed to redo lines:", err);
      }
    });

    socket.on("clean-board", async ({ boardId, userId }: CleanBoardEventData) => {
      try {
        const board = await Board.findById(boardId);
        if (!board) return;
        board.content = board.content.filter((line: any) => line.userId !== userId);
        await board.save();
        io.to(boardId).emit("update-lines", board.content);
      } catch (err) {
        console.error("Failed to clean board:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on("chat-message", async (data: ChatMessageEventData) => {
      try {
        const { boardId, userId, message, username } = data;
        const newMessage = new ChatMessageModel({
          boardId,
          userId,
          username,
          message,
          timestamp: new Date(),
        });

        await newMessage.save();
        io.to(boardId).emit("chat-message", data);
      } catch (err) {
        console.error("Failed to send chat message:", err);
      }
    });
  });
}
