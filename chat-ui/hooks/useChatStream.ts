import { abortChat } from "@/lib/api/abortChat";
import fetchChat from "@/lib/api/fetchChat";
import { Chat, ChatMessage } from "@/types/chat";
import { useState } from "react";

type SendArgs = {
    request: {
        id?: string | null,
        chat: Chat
    };
    setIsStreaming: () => void;
    onChunk: (message: ChatMessage) => void;
}

type AbortArgs = {
    id?: string | null;
    setIsStreaming: () => void;
}

export function useChatStream() {
    const [isPending, setIsPending] = useState(false);


    async function send({ request, setIsStreaming, onChunk }: SendArgs) {
        setIsPending(true);
        const res = await fetchChat(request);
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        let buffer = "";
        let firstChunk = true;

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                setIsPending(false);
                setIsStreaming();
                break;
            };

            if (firstChunk) {
                setIsPending(false);
                firstChunk = false;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === "data: [DONE]" || trimmed === "data:") continue;

                const jsonStr = trimmed.replace(/^data:\s*/, "");
                try {
                    const parsed = JSON.parse(jsonStr);
                    if (parsed.message?.content) {
                        onChunk({ role: parsed.message.role, content: parsed.message.content });
                    }
                    if (parsed.done) {
                        setIsStreaming();
                        return;
                    }
                } catch (e) {
                    console.warn("Could not parse line: ", line);
                }
            }
        }
    }

    async function abort({ id, setIsStreaming}: AbortArgs) {
        if (!id) return;
        try {
            await abortChat(id);
        } finally {
            setIsPending(false);
            setIsStreaming();
        }
    }
    return { send, abort, isPending };
}
