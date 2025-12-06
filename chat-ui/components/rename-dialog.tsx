"use client";

import { useStoredChatsContext } from "@/context/stored-chats-context";
import { StoredChat } from "@/types/chat";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Label } from "./ui/label";

type Props = {
    id: string;
}

export function RenameDialog({ id }: Props) {
    const [chat, setChat] = useState<StoredChat>();
    const [newName, setNewName] = useState("");
    const { getChat, updateChat } = useStoredChatsContext();
    
    
    useEffect(() => {
        if(!id) return;
        setChat(getChat(id));
    }, [id, getChat]);

    useEffect(() => {
        if (chat) setNewName(chat.name);
    }, [chat]);

    if (!chat) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if(!chat) return;

        const trimmed = newName.trim();
        const updated: StoredChat = { ...chat, name: trimmed };

        updateChat(updated);
    }

    return (
        <Dialog>
            <DialogTrigger className="w-full" asChild onClick={(e) => e.stopPropagation()}>
                <Button className="border-none w-full cursor-pointer hover:brightness-120" variant={"noShadow"}>Rename</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[300px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Rename chat</DialogTitle>
                        <DialogDescription>
                            Please choose a new name for the chat.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label htmlFor="name">Chat name</Label>
                        <Input id="name" name="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="neutral">Cancel</Button>
                        </DialogClose>
                        <DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}