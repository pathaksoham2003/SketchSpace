import { useState, Fragment } from "react";
import Wheel from "@uiw/react-color-wheel";
import {
  CornerUpLeft,
  CornerUpRight,
  Download,
  Edit2,
  MessageCircle,
  Minus,
  Move,
  Square,
  Type,
} from "react-feather";
import { hsvaToHex } from "@uiw/color-convert";

function Tools({ color, setColor, setTool, setSize, undo, redo }) {
  const [showWheel, setWheel] = useState(false);
  return (
    <Fragment>
      {showWheel ? (
        <div style={{ position: "absolute", bottom: 80, left: 25 }}>
          <Wheel
            color={color}
            onChange={(color) => setColor({ ...color, ...color.hsva })}
          />
        </div>
      ) : (
        <Fragment></Fragment>
      )}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          position: "absolute",
          alignItems: "center",
          justifyContent: "space-evenly",
          left: "80px",
          bottom: "10px",
          width: "700px",
          height: "auto",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          boxShadow: "1px 1px 10px black",
        }}
      >
        <div
          onClick={() => setWheel((prev) => !prev)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: hsvaToHex(color),
          }}
        ></div>
        <input
          onChange={(e) => setSize(e.target.value)}
          type="range"
          id="points"
          name="points"
          min="0"
          max="10"
        ></input>
        <Edit2 size={25} onClick={() => setTool("pencil")} />
        <Minus style={{transform:'rotate(-45deg)'}} size={25} onClick={() => setTool("line")} />
        <Square size={25} onClick={() => setTool("rectangle")} />
        {/* <XSquare size={25} onClick={() => setTool("eraser")} /> */}
        <Type size={25} onClick={() => setTool("text")} />
        <CornerUpLeft size={25} onClick={undo} />
        <CornerUpRight size={25} onClick={redo} />
        <Move size={25} onClick={() => setTool("selection")} />
        <Download size={25} />
        <MessageCircle size={25} />
      </div>
    </Fragment>
  );
}

export default Tools;
