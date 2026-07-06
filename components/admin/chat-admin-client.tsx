"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdate, adminDelete } from "@/lib/admin-api";
import type { ChatMessage } from "@/lib/types";

export default function ChatAdminClient({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [busy, setBusy] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ลบข้อความของ "${name}"?`)) return;
    setBusy(id);
    try {
      await adminDelete("chat_messages", id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const handlePin = async (msg: ChatMessage) => {
    if (!msg.id) return;
    setBusy(msg.id);
    try {
      await adminUpdate("chat_messages", msg.id, { pinned: !msg.pinned });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, pinned: !m.pinned } : m))
      );
    } finally {
      setBusy(null);
    }
  };

  const handleHide = async (msg: ChatMessage) => {
    if (!msg.id) return;
    setBusy(msg.id);
    try {
      await adminUpdate("chat_messages", msg.id, { hidden: !msg.hidden });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, hidden: !m.hidden } : m))
      );
    } finally {
      setBusy(null);
    }
  };

  const formatDate = (ts?: string) => {
    if (!ts) return "";
    return new Date(ts).toLocaleString("th-TH", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const pinned = messages.filter((m) => m.pinned);
  const rest = messages.filter((m) => !m.pinned);

  return (
    <div className="space-y-6">
      {pinned.length > 0 && (
        <section>
          <p className="text-amber-500 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
            <i className="fa-solid fa-thumbtack"></i> ปักหมุด
          </p>
          <MessageList
            messages={pinned}
            busy={busy}
            onDelete={handleDelete}
            onPin={handlePin}
            onHide={handleHide}
            formatDate={formatDate}
            accent="#f59e0b"
          />
        </section>
      )}

      <section>
        {pinned.length > 0 && (
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
            ข้อความทั้งหมด ({rest.length})
          </p>
        )}
        {rest.length === 0 && pinned.length === 0 ? (
          <div
            className="rounded-2xl px-6 py-12 text-center text-slate-500 text-sm"
            style={{ background: "#fff", border: "1px solid #e5e7eb" }}
          >
            ยังไม่มีข้อความในแชต
          </div>
        ) : (
          <MessageList
            messages={rest}
            busy={busy}
            onDelete={handleDelete}
            onPin={handlePin}
            onHide={handleHide}
            formatDate={formatDate}
            accent="#157493"
          />
        )}
      </section>
    </div>
  );
}

function MessageList({
  messages,
  busy,
  onDelete,
  onPin,
  onHide,
  formatDate,
  accent,
}: {
  messages: ChatMessage[];
  busy: string | null;
  onDelete: (id: string, name: string) => void;
  onPin: (msg: ChatMessage) => void;
  onHide: (msg: ChatMessage) => void;
  formatDate: (ts?: string) => string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden divide-y"
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderColor: "#f3f4f6",
      }}
    >
      {messages.map((m) => (
        <div
          key={m.id}
          className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
          style={{ borderColor: "#f3f4f6", opacity: m.hidden ? 0.45 : 1 }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
            style={{ background: `${accent}1a`, color: accent }}
          >
            {(m.name || "G")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-gray-900 text-sm font-semibold">{m.name || "Guest"}</p>
              {m.pinned && (
                <span className="text-amber-500 text-[10px]">
                  <i className="fa-solid fa-thumbtack"></i>
                </span>
              )}
              {m.hidden && (
                <span className="text-red-500 text-[10px] font-semibold uppercase">ซ่อนอยู่</span>
              )}
              <p className="text-gray-400 text-xs">{formatDate(m.created_at)}</p>
            </div>
            <p className="text-gray-600 text-sm whitespace-pre-wrap break-words">{m.message}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPin(m)}
              disabled={busy === m.id}
              title={m.pinned ? "เลิกปักหมุด" : "ปักหมุด"}
              className="text-gray-400 hover:text-amber-500 transition-colors text-sm disabled:opacity-40"
            >
              <i className="fa-solid fa-thumbtack"></i>
            </button>
            <button
              onClick={() => onHide(m)}
              disabled={busy === m.id}
              title={m.hidden ? "แสดงข้อความ" : "ซ่อนข้อความ"}
              className="text-gray-400 hover:text-[#157493] transition-colors text-sm disabled:opacity-40"
            >
              <i className={`fa-solid ${m.hidden ? "fa-eye" : "fa-eye-slash"}`}></i>
            </button>
            <button
              onClick={() => m.id && onDelete(m.id, m.name)}
              disabled={busy === m.id}
              title="ลบข้อความ"
              className="text-gray-400 hover:text-red-500 transition-colors text-sm disabled:opacity-40"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
