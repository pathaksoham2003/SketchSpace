import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../types/message";
import { User } from "../types/user";

interface LineProps {
  tool: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
  userId: string;
}

interface WhiteboardState {
  boardName: string;
  lines: LineProps[];
  tool: string;
  stroke: string;
  strokeWidth: number;
  history: LineProps[][];
  redoStack: LineProps[][];
  showParticipantsModal: boolean;
  showChatModal: boolean;
  participants: User[];
  inviteEmail: string;
  chatMessages: ChatMessage[];
  chatInput: string;
}

const initialState: WhiteboardState = {
  boardName: "",
  lines: [],
  tool: "pen",
  stroke: "#000000",
  strokeWidth: 3,
  history: [],
  redoStack: [],
  showParticipantsModal: false,
  showChatModal: false,
  participants: [],
  inviteEmail: "",
  chatMessages: [],
  chatInput: "",
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setBoardName(state, action: PayloadAction<string>) {
      state.boardName = action.payload;
    },
    setLines(state, action: PayloadAction<LineProps[]>) {
      state.lines = action.payload;
    },
    addLine(state, action: PayloadAction<LineProps>) {
      state.history.push(state.lines); 
      state.redoStack = []; 
      state.lines.push(action.payload);
    },
    setStroke(state, action: PayloadAction<string>) {
      state.stroke = action.payload;
    },
    setStrokeWidth(state, action: PayloadAction<number>) {
      state.strokeWidth = action.payload;
    },
    undoLine(state) {
      if (state.lines.length > 0) {
        state.redoStack.push(state.lines);
        state.lines = state.history.pop() || [];
      }
    },
    redoLine(state) {
      if (state.redoStack.length > 0) {
        state.history.push(state.lines);
        state.lines = state.redoStack.pop() || [];
      }
    },
    setRedoStack: (state, action: PayloadAction<LineProps[][]>) => {
      state.redoStack = action.payload;
    },
    clearBoard(state) {
      state.history.push(state.lines);
      state.lines = [];
      state.redoStack = [];
    },
    toggleParticipantsModal(state) {
      state.showParticipantsModal = !state.showParticipantsModal;
    },
    toggleChatModal(state) {
      state.showChatModal = !state.showChatModal;
    },
    setParticipants(state, action: PayloadAction<User[]>) {
      state.participants = action.payload;
    },
    setInviteEmail(state, action: PayloadAction<string>) {
      state.inviteEmail = action.payload;
    },
    setChatMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.chatMessages = action.payload;
    },
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push(action.payload);
    },
    setChatInput(state, action: PayloadAction<string>) {
      state.chatInput = action.payload;
    },
  },
});

export const {
  setBoardName,
  setLines,
  addLine,
  setStroke,
  setStrokeWidth,
  undoLine,
  redoLine,
  clearBoard,
  setRedoStack,
  toggleParticipantsModal,
  toggleChatModal,
  setParticipants,
  setInviteEmail,
  setChatMessages,
  addChatMessage,
  setChatInput,
} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;
