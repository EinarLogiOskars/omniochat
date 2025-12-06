'use client';

import { ChatBubble } from "@/components/chat-bubble";
import { ModelAlert } from "@/components/model-alert";
import { Button } from "@/components/ui/button";
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useChatSelection } from "@/context/chat-selection-context";
import { useStoredChatsContext } from "@/context/stored-chats-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatStream } from "@/hooks/useChatStream";
import { useModels } from "@/hooks/useModels";
import { newStoredChat, updateStoredChat } from "@/lib/storedChatUtils";
import { Chat, ChatMessage, StoredChat } from "@/types/chat";
import { useEffect, useRef, useState } from "react";

const initialChat: Chat = {
    model: '',
    messages: [],
    stream: true,
    options: { num_ctx: 2048 }
};

export default function Home() {

    const isMobile = useIsMobile();
    const { models, loading } = useModels();
    const { send } = useChatStream();
    const { storedChats, addChat, updateChat } = useStoredChatsContext();
    const { selectedChatId, setSelectedChatId } = useChatSelection();


    const [model, setModel] = useState("");
    const [input, setInput] = useState("");
    const [stream, setStream] = useState(true);
    const [storedChat, setStoredChat] = useState<StoredChat>();
    const [chat, setChat] = useState<Chat>({
        model: model,
        messages: [],
        stream: stream,
        options: {
            num_ctx: 2048,
        },
    });
    const [isStreaming, setIsStreaming] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const lastContent =
        chat.messages.length > 0
        ? chat.messages[chat.messages.length - 1].content
        : "";


    useEffect(() => {
        if (!selectedChatId) {
            setModel('');
            setStoredChat(undefined);
            setChat(initialChat);
            return;
        }

        const found = storedChats.find(chat => chat.id === selectedChatId);
        if (!found) return;

        setStoredChat(found);
        setChat(found.chat);
        setModel(found.chat.model);
    }, [selectedChatId, storedChats])


    useEffect(() => {
        if (!storedChat) return;
        const updated = updateStoredChat(storedChat, chat);
        setStoredChat(updated);
        updateChat(updated);
    }, [isStreaming])


    useEffect(() => {
        setChat(prev => ({
            ...prev,
            model: model,
        }));
    }, [model])


    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
            setAutoScroll(atBottom);
        }

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!autoScroll) return;
        bottomRef.current?.scrollIntoView({
            behavior: isStreaming ? "smooth" : "instant",
            block: "end",
        });
    }, [lastContent, isStreaming, autoScroll])



    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        if (!model) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input,
        }

        const nextChat: Chat = {
            ...chat,
            messages: [...chat.messages, userMessage],
        }

        setChat(nextChat);
        
        if (nextChat.stream) {
            setIsStreaming(true);
        }
        
        
        if (!selectedChatId) {
            const newStored: StoredChat = newStoredChat(nextChat);
            setStoredChat(newStored);
            addChat(newStored);
            setSelectedChatId(newStored.id);
        }


        send({
            request: nextChat,
            setIsStreaming: () => setIsStreaming(false),
            onChunk: (message: ChatMessage) => {
                setChat(prev => {
                    const messages = [...prev.messages];
                    const last = messages[messages.length - 1];

                    if (last && last.role === "assistant") {
                        messages[messages.length - 1] = {
                            ...last,
                            content: last.content + message.content,
                        };
                    } else {
                        messages.push(message);
                    }

                    return { ...prev, messages };
                })
            },
        });
        
        setInput("");
    }



    return (
        <main className="min-h-dvh">
            <div className="flex h-dvh">

                <section className="flex-1 flex flex-col">
                    
                    <header className="bg-secondary-background border-b border-border px-6 py-4 flex items-center justify-end">
                        <div className="flex items-center justify-between min-w-[100%]">
                            {isMobile && (
                                <SidebarTrigger />
                            )}
                            <Select value={model} onValueChange={(value) => setModel(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Models</SelectLabel>
                                        {models?.map((model, index) => (
                                            <SelectItem key={index} value={model.name}>{model.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </header>
                
                    <div
                        ref={scrollRef} 
                        className="flex-1 min-h-0 overflow-y-auto neo-grid bg-background px-3 py-3 space-y-3 md:px-10 md:space-y-6 md:pt-10"
                    >
                        {!model && <ModelAlert />}
                        {chat.messages.map((message, key) => (
                            <div
                                key={key}
                                className={`flex ${
                                    message.role === "user" ? "justify-end lg:mr-4" : "justify-start lg:ml-4"
                                }`}
                            >
                                <ChatBubble message={message} model={model} />
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <footer className="bg-secondary-background border-t border-border px-6 py-4 flex-shrink-0">
                        <form
                            className="flex items-center gap-3"
                            onSubmit={(e) => handleSubmit(e)}
                        >
                            <Textarea
                                id="input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything!"
                                className="flex-1"
                                onKeyDown={handleKeyDown}
                            />

                            <div className="-translate-y-[4px]">
                                <Button type="submit" disabled={isStreaming || !input.trim() || !model}>Send</Button>
                            </div>
                        </form>
                    </footer>
                    
                </section>
            
            </div>
        </main>
    );
}
