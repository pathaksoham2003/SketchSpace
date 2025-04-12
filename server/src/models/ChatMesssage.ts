import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  boardId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  message: string;
  timestamp: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const ChatMessageModel = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
export default ChatMessageModel;
