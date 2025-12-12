import { BASE_API_URL } from "./api";

export async function abortChat(id: string): Promise<Response> {
    const url = BASE_API_URL + '/api/abort';

    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })
}