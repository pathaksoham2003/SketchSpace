import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  creator: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  content: any[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    content: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Board = mongoose.model<IBoard>("Board", BoardSchema);
export default Board;
