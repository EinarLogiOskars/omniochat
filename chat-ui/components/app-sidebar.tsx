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
import { cn } from "@/lib/utils";
import { Hammer, Drill, Link } from "lucide-react";

const data = {
    einar: {
        icon: Link,
    },
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
    const { open } = useSidebar();

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
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroupLabel className="text-xs font-semibold mt-5">Created by Einar Logi</SidebarGroupLabel>
                <SidebarMenuItem>
                    <SidebarMenuButton className="mb-5" asChild>
                        <a href="https://einarlogi.is">
                            {data.einar.icon && <data.einar.icon />}
                            <span className="text-xs underline text-blue">Checkout my other work</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    )
}

