'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { useChatSelection } from "@/context/chat-selection-context";
import { useStoredChatsContext } from "@/context/stored-chats-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Hammer, Drill, Globe, PlusCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { DeleteAlert } from "./delete-alert";
import { RenameDialog } from "./rename-dialog";
import { useState } from "react";

const data = {
    einarSite: Globe,
    newChat: PlusCircle,
    tools: [
        {
            name: "Tool 1",
            icon: Hammer,
        },
        {
            name: "Tool 2",
            icon: Drill,
        },
    ],
}

export function AppSidebar() {
    const isMobile = useIsMobile();
    const { open, toggleSidebar } = useSidebar();
    const { storedChats } = useStoredChatsContext();
    const { setSelectedChatId } = useChatSelection();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    
                    <div 
                        className={cn(
                            "transition-all duration-200",
                            open
                                ? "relative opacity-100 pointer-events-auto translate-x-0"
                                : "absolute opacity-0 pointer-events-none -translate-x-2"
                        )}
                    >
                        <div className="font-bold text-xl">Omniochat</div>
                        <div className="text-sm">Neobrutalist chat experience</div>
                    </div>

                    <SidebarTrigger />
                    
                </div>
            </SidebarHeader>
            <SidebarContent className="grid grid-rows-2"> 
                <SidebarGroup className="flex flex-col">
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarMenu className={`${open ? "" : "items-center"}`}>
                        {data.tools.map((tool) => (
                            <SidebarMenuItem className="flex gap-4" key={tool.name}>
                                <SidebarMenuButton asChild>
                                    <a>
                                        {tool.icon && <tool.icon />}
                                        <span>{tool.name}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup className="flex flex-col">
                    <SidebarGroupLabel>Chats</SidebarGroupLabel>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedChatId(null);
                                    if (isMobile) toggleSidebar();
                                }}
                            >
                                {data.newChat && <data.newChat />}
                                New chat
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenu className="overflow-y-auto p-2">
                        {storedChats?.map(chat => (
                            <SidebarMenuItem key={chat.id}>
                                <SidebarMenuButton className="p-0 pl-2">
                                    <div className="group/chat-row flex w-full h-full items-center justify-between min-w-0 space-x-2">
                                        <div
                                            className="min-w-0 w-full h-full overflow-hidden whitespace-nowrap text-xs text-left flex items-center"
                                            onClick={() => {
                                                setSelectedChatId(chat.id);
                                                if (isMobile) toggleSidebar();
                                            }}
                                        >
                                            {chat.name}
                                        </div>
                                        <DropdownMenu
                                            open={openDropdown === chat.id}
                                            onOpenChange={(open) => setOpenDropdown(open ? chat.id : null)}
                                        >
                                            <DropdownMenuTrigger className="mr-2" asChild onClick={(e) => e.stopPropagation()}>
                                                <div className="outline-none transition opacity-0 group-hover/chat-row:opacity-100">...</div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuItem
                                                    asChild
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setOpenDropdown(null);
                                                    }}
                                                >
                                                    <DeleteAlert id={chat.id} />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    asChild
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setOpenDropdown(null);
                                                    }}
                                                >
                                                    <RenameDialog id={chat.id} />
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroupLabel className="text-xs font-semibold">Created by Einar Logi</SidebarGroupLabel>
                    {open && (
                        <div className="flex flex-col gap-1 pl-2">
                            <a
                                href="https://einarlogi.is"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs underline hover:opacity-70 transition mb-2"
                            >
                                <data.einarSite size={16} strokeWidth={2} />
                                Checkout my other work
                            </a>

                            <a
                                href="https://github.com/EinarLogiOskars/omniochat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs underline hover:opacity-70 transition mb-4"
                            >
                                <img
                                    src="/github-mark.svg"
                                    alt="GitHub"
                                    className="w-4 h-4"
                                />
                                Omniochat on GitHub
                            </a>
                        </div>
                    )}
            </SidebarFooter>
        </Sidebar>
    )
}

