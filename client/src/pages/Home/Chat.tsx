import React, { useEffect, useState } from "react";
import { Send } from "react-feather";

const Chat = ({ socket ,visible}) => {
  const [message, setMessage] = useState<string>("");
  const [msg, setMsg] = useState([]);

  const handleSendMessage = () => {
    if (message.trim() === "") {
      return;
    }
    console.log(socket.current.id);
    socket.current.emit("send-msg", {
      socketId: socket.current.id,
      data: message,
    });
    setMsg((prev) => [...prev, { socketId: socket.current.id, data: message }]);
    setMessage("");
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-msg", (data) => {
        setMsg((prev) => [...prev, data]);
      });
    }
  }, []);

  return (
    <div
      style={{
        display: visible ? "flex" : "none",
        position: "absolute",
        right: "20px",
        top: "10px",
        width: "400px",
        height: "500px",
        borderRadius: "20px",
        backgroundColor: "white",
        zIndex: 10,
        flexDirection: "column",
        boxShadow: "1px 1px 20px grey",
        padding: "10px",
      }}
    >
      <div
        style={{
          height: "60px",
          backgroundColor: "#B1F2F7",
          borderRadius: "20px",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          padding: "10px",
          backdropFilter: "blue(10px)",
        }}
      >
        <span style={{ fontSize: "20px" }}>Chat</span>
      </div>
      <div
        style={{
          height: "100%",
          backgroundColor: "#FFFFFFF1",
          paddingInline: "5px",
          display: "flex",
          flexDirection: "column",
          overflowY:"scroll"
        }}
      >
        {msg.map((msg) => {
          return (
            <div
              style={{
                maxWidth: "90%",
                width: "fit-content",
                backgroundColor: "#B1F2F7",
                padding: "5px",
                display: "flex",
                [socket.current.id === msg.socketId
                  ? "marginLeft"
                  : "marginRight"]: "auto",
                flexDirection: "column",
                borderRadius: "10px",
                marginTop: "5px",
              }}
            >
              <span style={{ fontSize: 10 }}>{msg.socketId}</span>
              <span>{msg.data}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          height: "80px",
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#B1F2F7",
          borderRadius: "30px",
        }}
      >
        <input
          style={{
            backgroundColor: "white",
            height: "100%",
            border: "none",
            width: "100%",
            marginInlineEnd: "10px",
            borderRadius: "20px",
            padding: "5px",
          }}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Type your message..."
        />
        <div onClick={handleSendMessage}>
          <Send
            style={{ marginTop: 5, marginRight: "10px" }}
            size={28}
            color="#074168"
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
