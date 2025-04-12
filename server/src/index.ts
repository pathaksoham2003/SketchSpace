//  import * as fs from fs


import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import BoardRoute from "./routes/board.js";
import AuthRouter from "./routes/auth.js";
import BoardChatRoute from "./routes/chat.js";

import setupSocketHandlers from "./socket/socketHandler.js";
// Below is to check the smtp configuration
// import {testSend} from "./utils/testEmail.js";
// testSend()

import {configDotenv} from "dotenv";
configDotenv();
connectDB();
const app = express();
app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/api/board", BoardRoute);
app.use("/api/board/chat", BoardChatRoute);
app.use("/api/user", AuthRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("client"));

setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
