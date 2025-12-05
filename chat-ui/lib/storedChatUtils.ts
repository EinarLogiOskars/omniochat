import { Chat, StoredChat } from "@/types/chat";

function generateChatName(firstMessage: string): string {
    let title = firstMessage.trim();
    if(!title) return "Untitled chat";

    title = title.charAt(0).toUpperCase() + title.slice(1);
    if (title.length > 50) title = title.slice(0, 50).trim() + "...";
    return title;
}

function generateChatId() {
    return 'Chat' + crypto.randomUUID();
}

export function newStoredChat(chat: Chat): StoredChat {
    const now = new Date().toISOString();
    return {
        id: generateChatId(),
        name: generateChatName(chat.messages[0].content),
        chat,
        createdAt: now,
        updatedAt: now,
    }
}

export function updateStoredChat(storedChat: StoredChat, chat: Chat): StoredChat {
    const now = new Date().toISOString();
    return {
        id: storedChat.id,
        name: storedChat.name,
        chat: chat,
        createdAt: storedChat.createdAt,
        updatedAt: now
    }
}