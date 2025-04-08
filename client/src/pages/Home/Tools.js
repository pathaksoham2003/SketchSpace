import { useState, Fragment } from "react";
import Wheel from "@uiw/react-color-wheel";
import { CornerUpLeft, CornerUpRight, Download, Edit2, MessageCircle, Minus, Move, Square, Type, } from "react-feather";
import { hsvaToHex } from "@uiw/color-convert";
function Tools({ color, setColor, setTool, setSize, undo, redo }) {
    const [showWheel, setWheel] = useState(false);
    return (React.createElement(Fragment, null,
        showWheel ? (React.createElement("div", { style: { position: "absolute", bottom: 80, left: 25 } },
            React.createElement(Wheel, { color: color, onChange: (color) => setColor({ ...color, ...color.hsva }) }))) : (React.createElement(Fragment, null)),
        React.createElement("div", { style: {
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
            } },
            React.createElement("div", { onClick: () => setWheel((prev) => !prev), style: {
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: hsvaToHex(color),
                } }),
            React.createElement("input", { onChange: (e) => setSize(e.target.value), type: "range", id: "points", name: "points", min: "0", max: "10" }),
            React.createElement(Edit2, { size: 25, onClick: () => setTool("pencil") }),
            React.createElement(Minus, { style: { transform: 'rotate(-45deg)' }, size: 25, onClick: () => setTool("line") }),
            React.createElement(Square, { size: 25, onClick: () => setTool("rectangle") }),
            React.createElement(Type, { size: 25, onClick: () => setTool("text") }),
            React.createElement(CornerUpLeft, { size: 25, onClick: undo }),
            React.createElement(CornerUpRight, { size: 25, onClick: redo }),
            React.createElement(Move, { size: 25, onClick: () => setTool("selection") }),
            React.createElement(Download, { size: 25 }),
            React.createElement(MessageCircle, { size: 25 }))));
}
export default Tools;
