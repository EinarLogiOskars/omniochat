import { config } from "dotenv";
config();

import { Ollama } from "ollama";

const host = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/';

export function ollamaClient() {
    return new Ollama({
        host
    });
}

export const ollama = new Ollama({ host });
