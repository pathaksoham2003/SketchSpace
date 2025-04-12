import mongoose, { Document, Schema, Types } from "mongoose";

// Define IUser interface extending Document
export interface IUser extends Document {
  _id: Types.ObjectId; // Correctly typed ObjectId from mongoose.Types
  name: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Define the schema for the User model
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
