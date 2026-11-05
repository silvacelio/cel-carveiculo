"use client";

import { useState, useEffect } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/site-data";

const NAV_ITEMS = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#galeria", label: "Trabalhos" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#faq", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

interface HeaderProps {
  onQuoteClick: () => void;
}

export function Header({ onQuoteClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center shadow-lg shadow-red-900/20 transition-transform group-hover:scale-105">
              <span className="font-black text-amber-400 text-xl">C</span>
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-red-600 to-red-900 -z-10 blur opacity-40 group-hover:opacity-70 transition-opacity" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-base lg:text-lg tracking-tight">
                CEL-CAR
              </span>
              <span className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-widest">
                Funilaria & Pintura
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a
                href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4 mr-2" />
                WhatsApp
              </a>
            </Button>
            <Button
              size="sm"
              onClick={onQuoteClick}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md shadow-red-900/20"
            >
              Fazer Orçamento
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border shadow-lg">
          <nav className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm font-medium text-foreground hover:bg-accent/40 rounded-md transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
              <Button
                variant="outline"
                asChild
                className="w-full"
              >
                <a
                  href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4 mr-2" />
                  Falar no WhatsApp
                </a>
              </Button>
              <Button
                onClick={() => {
                  setMobileOpen(false);
                  onQuoteClick();
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Fazer Orçamento
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
