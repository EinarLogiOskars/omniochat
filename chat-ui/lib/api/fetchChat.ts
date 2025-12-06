import { Chat } from "@/types/chat";
import { BASE_API_URL } from "./api";

export default async function fetchChat(request: Chat): Promise<Response>{
    const url = BASE_API_URL + '/api/chat';
    const reqBody = JSON.stringify(request);
    return await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: reqBody,
    });
}