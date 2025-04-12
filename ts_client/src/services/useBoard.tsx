import React from 'react';
import useRequest from './useRequest';
import { urls } from './urls';

const useBoard = () => {
    const Request = useRequest();

    const create = async (data: any) => {
        const res = await Request.post(urls.board, data);
        return res.data;
    }

    const inviteMember = async (whiteBoardId:string,inviteeEmail: string) => {
        const res = await Request.post(urls.board + `${whiteBoardId}/` + "add/", {email:inviteeEmail});
        return res.data;
    }

    const getByMe = async () => {
        const res = await Request.get(urls.board + "me/");
        return res.data;
    }

    const getSharedToMe = async () => {
        const res = await Request.get(urls.board + "shared/");
        return res.data;
    }

    const getBoard = async (id: string) => {
        const res = await Request.get(urls.board + id);
        return res.data;
    }

    return { create, inviteMember, getByMe, getSharedToMe, getBoard }
}

export default useBoard