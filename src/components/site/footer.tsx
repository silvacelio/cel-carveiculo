"use client";

import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-12 lg:pt-16 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 lg:pb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
                <span className="font-black text-amber-400 text-xl">C</span>
              </div>
              <div className="leading-tight">
                <p className="font-black text-base text-white">CEL-CAR</p>
                <p className="text-[10px] uppercase tracking-widest">
                  Funilaria & Pintura
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Repintura, funilaria e estética automotiva no Rio de Janeiro. Mais
              de 18 anos devolvendo o brilho original dos carros da cidade.
            </p>
            <p className="text-xs text-zinc-500">
              Responsável técnico:{" "}
              <span className="text-zinc-300 font-medium">
                {SITE_CONFIG.owner}
              </span>
            </p>
          </div>

          {/* Services column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
              Serviços
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#servicos" className="hover:text-red-400 transition-colors">
                  Repintura Automotiva
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-red-400 transition-colors">
                  Funilaria
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-red-400 transition-colors">
                  Polimento & Cristalização
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-red-400 transition-colors">
                  Recuperação de Parachoques
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-red-400 transition-colors">
                  Alinhamento de Painéis
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-red-400 transition-colors">
                  Estética Automotiva
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#inicio" className="hover:text-red-400 transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-red-400 transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-red-400 transition-colors">
                  Trabalhos
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-red-400 transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-red-400 transition-colors">
                  Dúvidas Frequentes
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-red-400 transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
              Contato
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 text-red-500 shrink-0 mt-0.5" />
                <a
                  href={SITE_CONFIG.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  {SITE_CONFIG.address.street}
                  <br />
                  {SITE_CONFIG.address.district} — {SITE_CONFIG.address.city}/
                  {SITE_CONFIG.address.state}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 text-red-500 shrink-0" />
                <a
                  href={`tel:+${SITE_CONFIG.phoneRaw}`}
                  className="hover:text-red-400 transition-colors"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-red-500 shrink-0" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-red-400 transition-colors break-all"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors"
                >
                  <MessageCircle className="size-4" />
                  Falar no WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/80 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>
            © {year} {SITE_CONFIG.companyFullName} — CNPJ {SITE_CONFIG.cnpj}
          </p>
          <p>
            Feito com dedicação no Rio de Janeiro. 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
