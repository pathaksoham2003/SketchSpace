import { Request, Response } from "express";
import User, { IUser } from "../models/User.js";
import { AuthenticatedRequest } from "../types/auth.js";

export const storeUserData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, preferred_username, given_name, family_name, name } = req.auth;

    if (!email) {
      return res.status(400).json({ error: "Missing email in token" });
    }

    let user: IUser | null = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        username: preferred_username,
        firstName: given_name,
        lastName: family_name,
      });

      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
