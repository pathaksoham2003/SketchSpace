import Board from "../models/Board.js";
import User, {IUser} from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import {generateInvitationEmail} from "../utils/emailTemplate.js";
import {Request, Response} from "express";
import {AuthenticatedRequest} from "../types/auth.js";

export const createBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.auth.email;
    const user = await User.findOne({email});

    if (!user) return res.status(404).json({message: "User not found"});

    const board = new Board({
      name: req.body.name,
      creator: user._id,
      participants: [user._id],
    });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({message: "Error creating board", error: err});
  }
};

export const addMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const boardId = req.params.id;
    const {email: inviteeEmail} = req.body;
    const {email: inviterEmail} = req.auth;

    const inviter = await User.findOne({email: inviterEmail});
    if (!inviter) return res.status(404).json({message: "Inviter not found"});

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({message: "Board not found"});

    const invitee: IUser | null = await User.findOne({email: inviteeEmail});
    if (!invitee) return res.status(404).json({message: "Invitee not found"});

    if (
      board.participants.some(
        (participantId) => participantId.toString() === invitee._id.toString()
      )
    ) {
      return res.status(400).json({message: "User already a participant"});
    }

    board.participants.push(invitee._id);
    await board.save();

    const inviteLink = `${process.env.FRONTEND_URL}board/${board._id}`;
    const html = generateInvitationEmail({
      inviterName: inviter.name || inviter.email,
      boardName: board.name,
      inviteLink,
    });

    await sendEmail({
      to: inviteeEmail,
      subject: `${
        inviter.name || inviter.email
      } invited you to collaborate on "${board.name}"`,
      html: html,
    });

    res.status(200).json({message: "Invitation sent successfully", board});
  } catch (err) {
    console.error("Error sending invitation:", err);
    res.status(500).json({message: "Failed to send invitation", error: err});
  }
};

export const getBoardsShared = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {email} = req.auth as {email: string};
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({message: "User not found"});

    const boards = await Board.find({
      participants: user._id,
      creator: {$ne: user._id},
    }).populate({path: "participants", select: "_id name"}).populate({path:"creator",select:"_id name email"});

    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({message: "Error fetching boards", error: err});
  }
};

export const getBoardsByMe = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {email} = req.auth;
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({message: "User not found"});

    const boards = await Board.find({creator: user._id});
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({message: "Error fetching boards", error: err});
  }
};

export const getBoard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = req.params;
    const board = await Board.findOne({_id: id}).populate({
      path: "participants",
      select: "_id username name email",
    });

    if (!board) return res.status(404).json({message: "Board not found"});

    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({message: "Error fetching board data", error: err});
  }
};
