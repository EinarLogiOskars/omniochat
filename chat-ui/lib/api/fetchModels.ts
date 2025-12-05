const BASE_URL = process.env.BASE_API_URL || 'http://localhost:3001';

export default async function fetchModels(): Promise<Response>{
    const url = BASE_URL + '/api/list';
    return await fetch(url, {
        method: 'GET',
    });
}