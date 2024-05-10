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

  socket.on("mm-send", (mousePosition) => {
    connections.forEach((socketId) => {
      if (socketId !== socket.id) {
        socket.to(socketId).emit("mm-recieve", mousePosition);
      }
    });
  });

  socket.on("recieve-msg", (data) => {
    console.log(socket.id, "sent message :- ", data);
    connections.forEach(socket);
  });

  socket.on("disconnect", (reason) => {
    console.log("A user has disconnected", socket.id);
    connections = connections.filter((item) => item !== socket.id);
    console.log("Array after disconnection ", connections);
  });
});
