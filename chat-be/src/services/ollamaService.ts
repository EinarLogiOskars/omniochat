import { ChatRequest, ChatResponse, Ollama } from "ollama";
import { ollamaClient, ollama } from "../lib/ollama";

const activeClients = new Map<string, Ollama>();

export const chatStream = async (
    id: string,
    args: ChatRequest & { stream: true }
): Promise<AsyncIterable<ChatResponse>> => {
    let client = activeClients.get(id);
    if (!client) {
        client = ollamaClient();
        activeClients.set(id, client);
    }

    const iterator = await client.chat(args);

    async function* wrapped() {
        try {
            for await (const chunk of iterator) {
                yield chunk;
            }
        } finally {
            activeClients.delete(id);
        }
    }

    return wrapped();
};

export const abortStream = (id: string) => {
    let client = activeClients.get(id);
    if (!client) return false;
    activeClients.delete(id);
    client.abort();
    return true;
}

export const chatOnce = (
    args: ChatRequest & { stream?: false }
): Promise<ChatResponse> => ollama.chat({ ...args, stream: false });

export const listModels = () => ollama.list();
export const listActive = () => ollama.ps();
export const pullModel = (model: string) => ollama.pull({ model });
export const deleteModel = (model: string) => ollama.delete({ model });
