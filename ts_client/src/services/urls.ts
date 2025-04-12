
const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";
const API_URL = SERVER_URL + "api/"
export const urls = {
    user : API_URL + "user/",
    board: API_URL + "board/",
    boardChat: API_URL + "board/chat/",
}