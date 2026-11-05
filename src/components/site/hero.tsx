"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Clock,
  Award,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG, STATS } from "@/lib/site-data";

interface HeroProps {
  onQuoteClick: () => void;
}

export function Hero({ onQuoteClick }: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-50 via-white to-red-50/40" />
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-60" />
      <div
        className="absolute top-1/4 -right-32 -z-10 w-[600px] h-[600px] rounded-full bg-red-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -left-32 -z-10 w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-3xl"
        aria-hidden
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start">
              <Badge
                variant="secondary"
                className="bg-red-50 text-red-700 border-red-200 px-3 py-1.5 text-xs font-semibold"
              >
                <span className="size-1.5 rounded-full bg-red-500 mr-2 animate-pulse" />
                Atendendo em Inhaúma — Rio de Janeiro
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-balance leading-[1.05]">
              Devolvemos o{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 bg-clip-text text-transparent">
                  brilho original
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C75 3 225 3 298 9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-amber-500"
                  />
                </svg>
              </span>{" "}
              do seu carro.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-xl mx-auto lg:mx-0">
              Repintura, funilaria e estética automotiva com{" "}
              <span className="font-semibold text-foreground">
                garantia de 1 ano
              </span>
              . Orçamento em até 5 minutos, atendimento humano de verdade.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onQuoteClick}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-900/20 px-7 h-12 text-base"
              >
                Fazer Orçamento Grátis
                <ArrowRight className="size-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 text-base border-zinc-300 hover:bg-zinc-50"
              >
                <a
                  href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-5 mr-2" />
                  WhatsApp Direto
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="size-4 text-red-600" />
                <span>Garantia de 1 ano</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4 text-red-600" />
                <span>Orçamento em 5 min</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="size-4 text-red-600" />
                <span>18+ anos de experiência</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Image with floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-zinc-900/20 border border-zinc-200/60">
              <img
                src="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e782ee85addb.jpg"
                alt="Carro com pintura restaurada e brilhante na Cel-Car"
                className="size-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="text-white">
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    Resultado real
                  </p>
                  <p className="font-bold text-lg">Pintura de fábrica</p>
                </div>
                <div className="flex items-center gap-1 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <span className="ml-1 text-xs font-bold text-zinc-900">4.9</span>
                </div>
              </div>
            </div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -left-4 lg:-left-8 bg-white rounded-2xl shadow-xl border border-zinc-200/60 p-4 lg:p-5 w-[260px] hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Award className="size-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-zinc-900 leading-none">
                    3.500+
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Carros restaurados
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 lg:p-5 rounded-2xl bg-white/60 backdrop-blur border border-zinc-200/60"
            >
              <p className="text-3xl lg:text-4xl font-black bg-gradient-to-br from-red-600 to-red-800 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1.5 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
