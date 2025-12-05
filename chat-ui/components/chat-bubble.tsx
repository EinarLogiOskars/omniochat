"use client";

import { ChatMessage } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PageProps = {
    message: ChatMessage;
    model: string;
}

export function ChatBubble({ message, model }: PageProps) {

    return (
        <Card className="bg-secondary-background lg:max-w-[70%]">
            <CardHeader className={message.role === "user" ? "place-self-end mr-6" : ""}>
                <CardTitle className="text-sm flex flex-col">
                    <span>{message.role === "user" ? "You" : "Omniochat"}</span>
                    <span className="text-xs text-neutral-600">{message.role === "assistant" ? "(" + model + ")": ""}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="markdown-body text-sm">
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            a: ({node, ...props}) => (
                                <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:opacity-80 break-all"
                                />
                            )
                        }}
                    >
                        {message.content}
                    </Markdown>
                </div>
            </CardContent>
        </Card>
    )
}
