import fetchChat from "@/lib/api/fetchChat";
import { Chat, ChatMessage } from "@/types/chat";

type PageProps = {
    request: Chat;
    setIsStreaming: () => void;
    onChunk: (message: ChatMessage) => void;
}

export function useChatStream() {

    async function send({ request, setIsStreaming, onChunk }: PageProps) {
        const res = await fetchChat(request);
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                setIsStreaming();
                break;
            };

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
    return { send };
}