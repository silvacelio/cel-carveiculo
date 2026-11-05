"use client";

import { motion } from "framer-motion";
import { ClipboardList, Camera, Wrench, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "1. Solicite o orçamento",
    description:
      "Preencha o formulário no site em 5 minutos ou chame no WhatsApp. Diga o que aconteceu e qual peça.",
    color: "from-red-500 to-red-700",
  },
  {
    icon: Camera,
    title: "2. Envie fotos do dano",
    description:
      "Anexe fotos direto no formulário ou pelo WhatsApp. Quanto mais claras, mais preciso o orçamento.",
    color: "from-amber-500 to-amber-700",
  },
  {
    icon: Wrench,
    title: "3. Avaliação técnica",
    description:
      "Avaliamos o dano, definimos o serviço (funilaria, pintura ou ambos) e te enviamos o orçamento detalhado.",
    color: "from-red-500 to-red-700",
  },
  {
    icon: Sparkles,
    title: "4. Carro restaurado",
    description:
      "Aprovado? Mão na massa! Quando ficar pronto, avisamos. Você busca seu carro com aquele brilho de fábrica.",
    color: "from-amber-500 to-amber-700",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
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
              Como Funciona
            </span>
            <div className="h-px w-8 bg-red-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-balance leading-tight">
            Do primeiro contato ao carro{" "}
            <span className="text-red-700">pronto em 4 passos</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-base lg:text-lg text-pretty">
            Simples, transparente e rápido. Sem letra miúda, sem surpresa no
            meio do caminho.
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-red-200 via-amber-200 to-red-200" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center lg:text-left"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-3">
                  {/* Icon circle */}
                  <div className="mx-auto lg:mx-0 relative">
                    <div
                      className={`size-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative z-10`}
                    >
                      <Icon className="size-7 text-white" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 lg:pt-2">
                    <h3 className="font-bold text-base lg:text-lg mb-1.5 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
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
          className="mt-12 lg:mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-zinc-50 to-red-50/40 border border-red-100">
            <p className="text-sm lg:text-base font-semibold text-foreground">
              Pronto para começar?
            </p>
            <a
              href="#inicio"
              className="text-sm font-bold text-red-700 hover:text-red-900 transition-colors"
            >
              Solicitar meu orçamento grátis →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
