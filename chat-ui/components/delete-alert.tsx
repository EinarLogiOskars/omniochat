"use client";

import { useStoredChatsContext } from "@/context/stored-chats-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "./ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";
import { useChatSelection } from "@/context/chat-selection-context";

type Props = {
    id: string;
}

export function DeleteAlert({ id }: Props) {
    const { deleteChat } = useStoredChatsContext();
    const { selectedChatId, setSelectedChatId } = useChatSelection();

    const handleDelete = () => {
        deleteChat(id);
        if ( selectedChatId === id) {
            setSelectedChatId(null);
        }
    }
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="border-none w-full cursor-pointer hover:brightness-120" variant={"noShadow"} onClick={(e) => e.stopPropagation()}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the chat.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete()}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}