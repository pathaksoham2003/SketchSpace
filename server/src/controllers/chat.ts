import { Request, Response } from "express";
import ChatMessageModel from "../models/ChatMesssage.js";
import { AuthenticatedRequest } from "../types/auth.js";

export const getBoardChat = async (req:AuthenticatedRequest,res:Response) => {
    try{
        const boardId = req.params.boardId;
        const messages = await ChatMessageModel.find({boardId:boardId}).sort({timestamp:1});
        res.status(200).json(messages);
    }catch(e){
        res.status(404).json({error:e});
    }
}