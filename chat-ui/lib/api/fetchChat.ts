import { Chat } from "@/types/chat";

const BASE_URL = process.env.BASE_API_URL || 'http://localhost:3001';

export default async function fetchChat(request: Chat): Promise<Response>{
    const url = BASE_URL + '/api/chat';
    const reqBody = JSON.stringify(request);
    return await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: reqBody,
    });
}