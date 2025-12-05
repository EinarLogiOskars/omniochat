"use client";
import { createContext, useContext, ReactNode } from "react";
import { useStoredChats } from "@/hooks/useStoredChats";

const StoredChatsContext = createContext<ReturnType<typeof useStoredChats> | null>(null);

export function StoredChatsProvider({ children }: { children: ReactNode }) {
    const value = useStoredChats();
    return <StoredChatsContext.Provider value={value}>{children}</StoredChatsContext.Provider>;
}

export function useStoredChatsContext() {
    const ctx = useContext(StoredChatsContext);
    if (!ctx) throw new Error("useStoredChatsContext must be used within StoredChatsProvider");
    return ctx;
}