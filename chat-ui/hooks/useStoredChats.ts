import { StoredChat, StoredChats } from "@/types/chat";
import { useEffect, useState } from "react";

export function useStoredChats() {
    const STORAGE_KEY = 'omnio_chats';
    const [storedChats, setStoredChats] = useState<StoredChats>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setStoredChats(JSON.parse(saved));
            } catch (e) {
                console.warn("Bad stored chats, resetting", e);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedChats));
    }, [hydrated, storedChats]);

    const getChat = (id: string) => storedChats.find(chat => chat.id === id);

    const sortChats = (chats: StoredChats) => 
        [...chats].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const addChat = (chat: StoredChat) => setStoredChats(prev => sortChats([...prev, chat]));
    
    const updateChat = (updated: StoredChat) => 
        setStoredChats(prev => sortChats(prev.map(chat => (chat.id === updated.id ? updated : chat))));

    const deleteChat = (id: string) => {
        let newStoredChats = storedChats.filter(chat => chat.id !== id);
        setStoredChats(newStoredChats);
    }

    return {
        storedChats,
        getChat,
        addChat,
        updateChat,
        deleteChat,
    }
}