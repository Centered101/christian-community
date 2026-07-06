import type { Metadata } from "next";
import ChatSection from "@/components/sections/chat-section";

export const metadata: Metadata = { title: "แชต | ศาสนาจักรของพระเยซูคริสต์" };

export default function ChatPage() {
  return <ChatSection />;
}
