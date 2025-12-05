'use client';

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from 'react';

type ChatSelectionContextValue = {
    selectedChatId: string | null;
    setSelectedChatId: (id: string | null) => void;
};

const ChatSelectionContext = createContext<ChatSelectionContextValue | undefined>(
    undefined
);

export function ChatSelectionProvider({ children }: { children: ReactNode}) {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    return (
        <ChatSelectionContext.Provider value={{ selectedChatId, setSelectedChatId }}>
            {children}
        </ChatSelectionContext.Provider>
    );
}

export function useChatSelection() {
    const ctx = useContext(ChatSelectionContext);
    if (!ctx) {
        throw new Error("useChatSelection must be used within ChatSelectionProvider");
    }
    return ctx;
}