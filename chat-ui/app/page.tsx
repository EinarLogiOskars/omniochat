'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectGroup, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";

const mockMessages = [
    { id: 1, author: "You", text: "Hey, how's it going?" },
    { id: 2, author: "Omniochat", text: "All good! Ready to build a chat UI?" },
    { id: 3, author: "You", text: "Yep, using Tailwind + shadcn + neobrutalism!" },
];

export default function Home() {

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("Sending...");
    }

    return (
        <main className="min-h-screen">
            <div className="flex h-screen">

                <section className="flex-1 flex flex-col">
                    
                    <header className="bg-secondary-background border-b border-border px-6 py-4 flex items-center justify-end">
                        <div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Models</SelectLabel>
                                        <SelectItem value="Deepseek-coder-v2:lite">Deepseek-coder-v2:Lite</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </header>
                
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 neo-grid p-10 bg-background">
                        {mockMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.author === "You" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={"bg-secondary-background max-w-[70%] rounded-xl border-2 border-border px-3 py-2 shadow-sm"}
                                >
                                    <div className="text-xs font-semibold opacity-80 mb-1">
                                        {message.author}
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <footer className="bg-secondary-background border-t border-border px-6 py-4">
                        <form
                            className="flex items-center gap-3"
                            onSubmit={(e) => handleSubmit(e)}
                        >
                            <Input placeholder="Ask me anything!" className="flex-1" />
                            <div className="-translate-y-[4px]">
                                <Button type="submit">Send</Button>
                            </div>
                        </form>
                    </footer>
                    
                </section>
            
            </div>
        </main>
    );
}
