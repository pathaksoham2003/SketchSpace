import express from "express";
import keycloak from "./middlewarre/keycloak.js";
import cors from "cors";
import testRoute from "./routes/menuItems.js";
import { Server } from "socket.io";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(keycloak.middleware());

app.use("/api", testRoute);

const server = app.listen(8021, () => {
  console.log("Server Started");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let connections = [];

// Everything inside the below function will run for the sockets part
io.on("connection", (socket) => {
  connections.push(socket.id);
  console.log("Array after connection ", connections);

  // mouse movement
  socket.on("mm-send", (mousePosition) => {
    connections.forEach((socketId) => {
      if (socketId !== socket.id) {
        socket.to(socketId).emit("mm-recieve",{socketId:socketId,...mousePosition});
      }
    });
  });

  // drawing

  socket.on("createElement", (data)=>{
    connections.forEach(socketId=>{
      if(socket.id !== socketId){
        socket.to(socketId).emit("onmousedown",data);
      }
    })
  })

  socket.on("send-mousemove",(data)=>{
    connections.forEach(socketId=>{
      if(socket.id!==socketId){
        socket.to(socketId).emit("recieve-mouse-move",data);
      }
    })
  })

  socket.on("send-mouseup",(data)=>{
    connections.forEach(socketId=>{
      if(socket.id!==socketId){
        socket.to(socketId).emit("recieve-mouseup",data);
      }
    })
  })

  socket.on("send-elements",(data)=>{
    connections.forEach(socketId=>{
      if(socket.id!==socketId){
        socket.to(socketId).emit("recieve-elements",data);
      }
    })
  })

  // chatting 
  socket.on("drawing",(data)=>{
    console.log(data);
    connections.forEach(socketId=>{
      if(socket.id !== socketId){
        socket.to(socketId).emit("recieveThirdPartyDraw",data);
      }
    })
  });

  socket.on("send-msg", (data) => {
    connections.forEach(socketId => {
      if(socket.id !== socketId){
        socket.to(socketId).emit("recieve-msg",data);
      }
    });
  });

  socket.on("disconnect", (reason) => {
    connections = connections.filter((item) => item !== socket.id);
  });
});
