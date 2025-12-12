import { Chat } from "@/types/chat";
import { BASE_API_URL } from "./api";

export default async function fetchChat({ id, chat}: { id?: string | null, chat: Chat }): Promise<Response>{
    const url = BASE_API_URL + '/api/chat';
    const body = JSON.stringify({ id, ...chat });
    return await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body
    });
}