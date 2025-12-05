export type Chat = {
    model: string;
    messages: Array<ChatMessage>;
    stream?: boolean;
    options: {
        num_ctx: number,
    }
}

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export type StoredChat = {
    id: string;
    name: string;
    chat: Chat;
    createdAt: string;
    updatedAt: string;
}

export type StoredChats = StoredChat[];