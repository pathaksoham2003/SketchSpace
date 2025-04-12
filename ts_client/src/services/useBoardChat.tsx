import React from 'react'
import useRequest from './useRequest'
import { urls } from './urls';

const useBoardChat = () => {
    const Request = useRequest();
    const getChats = async (boardId:string) => {
        const res = await Request.get(urls.boardChat+boardId);
        return res.data;
    }
    return {getChats}
}

export default useBoardChat