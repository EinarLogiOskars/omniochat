"use client";

import { ChatMessage } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "./ui/skeleton";

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

type SkeletonProps = {
    model?: string;
}

export function ChatBubbleSkeleton({ model }: SkeletonProps) {
    
    return (
        <Card className="bg-secondary-background w-[300px]">
            <CardHeader>
                <CardTitle className="text-sm flex flex-col">
                    <span>Omniochat</span>
                    {model && <span className="text-xs text-neutral-600">({model})</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <Skeleton className="h-5 sm:w-[250px] w-[100px]" />
                <Skeleton className="h-5 sm:w-[220px] w-[100px]" />
            </CardContent>
        </Card>
    )   
}
