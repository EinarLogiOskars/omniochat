import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatSelectionProvider } from "@/context/chat-selection-context";
import { StoredChatsProvider } from "@/context/stored-chats-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { 
  title: "Omniochat",
  description: "Chat interface to use when running an llm locally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SidebarProvider>
                  <StoredChatsProvider>
                    <ChatSelectionProvider>
                      <AppSidebar />
                      <SidebarInset>
                          {children}
                      </SidebarInset>
                    </ChatSelectionProvider>
                  </StoredChatsProvider>
                </SidebarProvider>
            </body>
        </html>
    );
}
