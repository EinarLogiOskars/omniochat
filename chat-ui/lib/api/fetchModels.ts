import { BASE_API_URL } from "./api";

export default async function fetchModels(): Promise<Response>{
    const url = BASE_API_URL + '/api/list';
    return await fetch(url, {
        method: 'GET',
    });
}