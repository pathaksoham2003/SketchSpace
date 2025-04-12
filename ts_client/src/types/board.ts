import { User } from "./user";

export interface Board {
    _id: string;
    name: string;
    creator: User;
    participants: User[];
    createdAt: string;
  }