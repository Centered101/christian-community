"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { containsProfanity } from "@/lib/profanity";
import { useLocale } from "@/lib/i18n/locale-context";
import type { ChatMessage } from "@/lib/types";

export default function ChatSection() {
  const { t, locale } = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (!sb) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await sb
      .from("chat_messages")
      .select("id,name,message,pinned,created_at")
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) { setLoadError(true); toast.error(t("loadFailedToast")); }
    else { setLoadError(false); setMessages((data as ChatMessage[]) ?? []); }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    void load();
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const channel = sb
      .channel("chat_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages" }, (payload) => {
        setMessages((prev) => prev.filter((m) => m.id !== (payload.old as ChatMessage).id));
      })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = message.trim();
    if (!msg) return;
    if (containsProfanity(name) || containsProfanity(msg)) {
      toast.error(t("profanityError"));
      return;
    }
    setSending(true);
    const sb = getSupabaseBrowser();
    if (!sb) { toast.error(t("systemNotReady")); setSending(false); return; }
    const { error } = await sb.from("chat_messages").insert({
      name: name.trim() || t("anonymous"),
      message: msg,
    });
    if (error) toast.error(t("sendFailed"));
    else { setMessage(""); toast.success(t("sentSuccess")); }
    setSending(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(e as unknown as React.FormEvent); }
  };

  const formatTime = (ts?: string) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString(locale === "th" ? "th-TH" : "en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const initial = (n: string) => (n || "?")[0].toUpperCase();
  const avatarColor = (n: string) => {
    const colors = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#be185d"];
    let hash = 0;
    for (const c of n) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
    return colors[Math.abs(hash)];
  };

  return (
    <div className="pt-6 md:pt-24 pb-16 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="divider"></div>
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">{t("chatPageTitle")}</h2>
          <p className="text-slate-500 mt-3">{t("chatPageSub")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Messages card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col" style={{ maxHeight: 560 }} data-aos="fade-right">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-blue-50">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <i className="fa-regular fa-comment text-blue-600"></i>
              </div>
              <p className="flex-1 font-semibold text-blue-900 text-sm">{t("everyonesMessages")}</p>
              <button
                onClick={load}
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                <i className="fa-solid fa-rotate mr-1.5"></i>{t("refresh")}
              </button>
            </div>

            {loadError && (
              <div className="mx-5 mt-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs px-3 py-2">
                {t("loadFailedRetry")}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 py-10">
                  <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-500"></i>
                  <p className="text-sm">{t("loadingMessages")}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <i className="fa-regular fa-comments text-2xl text-blue-300"></i>
                  </div>
                  <p className="font-semibold text-slate-700 text-sm">{t("noMessagesYet")}</p>
                  <p className="text-slate-400 text-xs">{t("beFirstToWrite")}</p>
                </div>
              ) : (
                messages.map((m, i) => {
                  const showDate = i === 0 || new Date(m.created_at!).toDateString() !== new Date(messages[i - 1].created_at!).toDateString();
                  return (
                    <div key={m.id ?? i}>
                      {showDate && (
                        <div className="text-center my-3">
                          <span className="bg-slate-100 text-slate-500 text-[11px] font-semibold rounded-full px-3 py-1">
                            {new Date(m.created_at!).toLocaleDateString(locale === "th" ? "th-TH" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                          style={{ background: avatarColor(m.name || "") }}
                        >
                          {initial(m.name || t("unnamed"))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-bold" style={{ color: avatarColor(m.name || "") }}>{m.name || t("anonymous")}</span>
                            {m.pinned && (
                              <span className="text-[10px] bg-amber-50 text-amber-600 rounded font-semibold px-1.5 py-0.5">
                                📌 {t("pinnedLabel")}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400">{formatTime(m.created_at)}</span>
                          </div>
                          <div
                            className={`text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm px-3.5 py-2.5 border ${
                              m.pinned ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"
                            }`}
                          >
                            {m.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-md p-6" data-aos="fade-left" data-aos-delay="150">
            <p className="font-semibold text-blue-900 text-sm mb-5">
              <i className="fa-regular fa-pen-to-square text-blue-500 mr-2"></i>{t("writeMessagePrompt")}
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("nameOptional")}</label>
                <input
                  type="text" maxLength={40} value={name} onChange={e => setName(e.target.value)}
                  placeholder="เช่น John"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">{t("messageLabel")}</label>
                <textarea
                  ref={inputRef}
                  required maxLength={500}
                  value={message} onChange={e => setMessage(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t("messagePlaceholder")}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none resize-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{t("sendHint")}</span>
                <span className="text-xs text-slate-300">{message.length}/500</span>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-3 transition-colors flex items-center justify-center gap-2"
              >
                {sending
                  ? <i className="fa-solid fa-circle-notch fa-spin"></i>
                  : <i className="fa-solid fa-paper-plane"></i>
                }
                {t("sendMessage")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
