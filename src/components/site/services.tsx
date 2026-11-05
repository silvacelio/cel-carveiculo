"use client";

import { motion } from "framer-motion";
import {
  Paintbrush,
  Hammer,
  Sparkles,
  Shield,
  Ruler,
  Gem,
  Clock,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/site-data";

const ICON_MAP: Record<string, LucideIcon> = {
  paintbrush: Paintbrush,
  hammer: Hammer,
  sparkles: Sparkles,
  shield: Shield,
  ruler: Ruler,
  gem: Gem,
};

interface ServicesProps {
  onQuoteClick: () => void;
}

export function Services({ onQuoteClick }: ServicesProps) {
  return (
    <section
      id="servicos"
      className="py-16 lg:py-24 bg-gradient-to-b from-zinc-50 to-white relative"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-red-600" />
            <span className="text-xs uppercase tracking-widest font-bold text-red-700">
              Nossos Serviços
            </span>
            <div className="h-px w-8 bg-red-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-balance leading-tight">
            Tudo o que seu carro precisa,{" "}
            <span className="text-red-700">numa oficina só</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-base lg:text-lg text-pretty">
            Da repintura completa ao polimento estético — equipe especializada e
            equipamentos de ponta para cada tipo de serviço.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? Paintbrush;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="group h-full p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-zinc-200/60 bg-white relative overflow-hidden">
                  {/* Decorative gradient on hover */}
                  <div className="absolute -top-12 -right-12 size-32 bg-gradient-to-br from-red-500/10 to-amber-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-md shadow-red-900/20 mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="size-6" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg lg:text-xl font-bold mb-2 text-foreground">
                      {service.title}
                    </h3>

                    {/* Short description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {service.short}
                    </p>

                    {/* Duration badge */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 w-fit mb-4">
                      <Clock className="size-3" />
                      {service.duration}
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 mt-3">
                      {service.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="size-3.5 text-red-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Não encontrou o serviço que precisa? Conte para a gente.
          </p>
          <Button
            size="lg"
            onClick={onQuoteClick}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-900/20 px-7 h-12"
          >
            Solicitar Orçamento
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
