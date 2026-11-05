"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONFIG } from "@/lib/site-data";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LeadData {
  name?: string;
  vehicle?: string;
  part?: string;
}

const QUICK_REPLIES = [
  "Preciso de um orçamento de pintura",
  "Quanto custa polir meu carro?",
  "Vocês atendem seguro?",
  "Como funciona a garantia?",
];

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Olá! 👋 Sou o assistente virtual da Cel-Car. Posso te ajudar com dúvidas sobre pintura, funilaria, polimento e muito mais. Como posso te ajudar hoje?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [unread, setUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  // Auto-focus input when opened
  useEffect(() => {
    if (open && !loading) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, loading]);

  // Show unread badge when there's a new message and chat is closed
  useEffect(() => {
    if (!open && messages.length > 1) {
      setUnread(true);
    }
  }, [messages.length, open]);

  // Try to extract lead data from user messages
  const tryExtractLead = (text: string) => {
    const updated: LeadData = { ...leadData };
    // Look for vehicle patterns (e.g., "Honda Civic", "Fiat Uno")
    const vehicleMatch = text.match(
      /\b(?:honda|toyota|volkswagen|vw|chevrolet|fiat|hyundai|nissan|renault|peugeot|citroen|ford|jeep)\s+\w+/i
    );
    if (vehicleMatch && !updated.vehicle) {
      updated.vehicle = vehicleMatch[0];
    }
    // Look for parts
    const partMatch = text.match(
      /\b(capô|para-choque|parachoque|porta|para-lama|paralama|teto|retrovisor|lateral|pára-choque|pára-lama)\b/i
    );
    if (partMatch && !updated.part) {
      updated.part = partMatch[0];
    }
    setLeadData(updated);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || loading) return;

    tryExtractLead(text);

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          leadData,
        }),
      });

      const data = await response.json();
      const reply =
        data.reply ??
        "Tive um problema técnico. Pode me chamar no WhatsApp (21) 97708-6841?";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Tive um problema de conexão. Pode tentar de novo ou me chamar no WhatsApp (21) 97708-6841?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleQuickReply = (text: string) => {
    handleSend(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="hidden sm:flex items-center gap-2 bg-white shadow-xl rounded-full pl-4 pr-2 py-2 border border-zinc-200"
            >
              <div className="text-sm">
                <p className="font-semibold text-zinc-900 leading-tight">
                  Precisa de ajuda?
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  Fale com a Cel-Car agora
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={() => {
            setOpen((v) => !v);
            setUnread(false);
          }}
          className={cn(
            "relative size-14 rounded-full shadow-xl shadow-red-900/30 p-0",
            open
              ? "bg-zinc-900 hover:bg-zinc-800"
              : "bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
          )}
          aria-label={open ? "Fechar chat" : "Abrir chat de atendimento"}
        >
          {open ? (
            <X className="size-6 text-white" />
          ) : (
            <>
              <MessageCircle className="size-6 text-white" />
              {unread && (
                <span className="absolute top-1 right-1 size-3 rounded-full bg-amber-400 ring-2 ring-red-700" />
              )}
              {!unread && (
                <span className="absolute inset-0 rounded-full ring-2 ring-red-400/40 animate-ping" />
              )}
            </>
          )}
        </Button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-5 sm:w-[380px] z-50 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[70vh] sm:max-h-[600px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-4 flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
                  <Sparkles className="size-5 text-amber-300" />
                </div>
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-400 ring-2 ring-red-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">
                  Assistente Cel-Car
                </p>
                <p className="text-xs text-red-100/90 leading-tight">
                  Online agora · responde em segundos
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-white hover:bg-white/10 size-8"
                aria-label="Fechar"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-gradient-to-br from-red-600 to-red-700 text-white rounded-br-md shadow-sm"
                        : "bg-white text-foreground border border-zinc-200 rounded-bl-md shadow-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-zinc-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="size-2 rounded-full bg-zinc-400 animate-bounce" />
                      <span
                        className="size-2 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="size-2 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick replies — show only when few messages */}
              {messages.length <= 1 && !loading && (
                <div className="pt-2 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Sugestões rápidas:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_REPLIES.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickReply(q)}
                        className="text-xs bg-white border border-red-200 text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white border-t border-zinc-200 flex items-end gap-2"
            >
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                rows={1}
                className="resize-none max-h-32 min-h-[40px] flex-1 text-sm border-zinc-200 focus-visible:ring-red-600/30 focus-visible:border-red-400"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shrink-0 size-10 rounded-xl"
                aria-label="Enviar mensagem"
              >
                <Send className="size-4" />
              </Button>
            </form>

            {/* Footer with WhatsApp fallback */}
            <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-100">
              <a
                href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-green-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="size-3.5" />
                Prefere falar com humano? Chame no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
