"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Phone, Mail, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-data";

const DIFFERENTIALS = [
  {
    title: "Equipamentos profissionais",
    description:
      "Cabine de pintura pressurizada, compressor de alta vazão e pistolas HVLP para acabamento de fábrica.",
  },
  {
    title: "Tintas premium",
    description:
      "Trabalhamos exclusivamente com tintas PU de marcas reconhecidas, garantindo durabilidade e fidelidade de cor.",
  },
  {
    title: "Garantia real",
    description:
      "Toda repintura tem 1 ano de garantia contra bolhas, descascamento ou defeitos de aplicação.",
  },
  {
    title: "Atendimento humano",
    description:
      "Você fala diretamente com o Célio. Sem terceirizados, sem robôs, sem pegadinhas.",
  },
];

export function About() {
  return (
    <section id="sobre" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-zinc-200/60">
              <img
                src="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ae22d26ea20b.jpg"
                alt="Célio Evangelista trabalhando na oficina Cel-Car"
                className="size-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs uppercase tracking-widest opacity-80">
                  Fundador & Responsável Técnico
                </p>
                <p className="text-xl font-bold mt-1">Célio Evangelista</p>
                <p className="text-sm opacity-90">
                  Mais de 18 anos transformando carros no Rio
                </p>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 -z-10 w-32 h-32 bg-amber-400/20 rounded-3xl rotate-12 hidden sm:block" />
            <div className="absolute -bottom-4 -left-4 -z-10 w-32 h-32 bg-red-500/15 rounded-3xl -rotate-12 hidden sm:block" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-red-600" />
              <span className="text-xs uppercase tracking-widest font-bold text-red-700">
                Sobre a Cel-Car
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-balance leading-tight">
              Quem faz a diferença é{" "}
              <span className="text-red-700">quem coloca a mão na massa</span>.
            </h2>

            <div className="space-y-4 text-muted-foreground text-base lg:text-lg">
              <p>
                A <strong className="text-foreground">Cel-Car</strong> nasceu da
                paixão do funileiro e pintor{" "}
                <strong className="text-foreground">Célio Evangelista</strong> por
                devolver a carros surrados o brilho e a dignidade de um veículo
                cuidado. Há mais de 18 anos atendendo Inhaúma e região, a oficina
                virou ponto de referência em repintura e funilaria no Rio.
              </p>
              <p>
                Aqui você não fala com atendente de call center. Você fala direto
                com quem entende — e quem executa — do começo ao fim. Cada carro
                que entra sai com o acabamento de fábrica e a garantia de quem
                conhece o ofício.
              </p>
            </div>

            {/* Differentials grid */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {DIFFERENTIALS.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-4 rounded-xl border border-zinc-200/60 bg-zinc-50/50 hover:bg-white hover:shadow-md transition-all"
                >
                  <CheckCircle2 className="size-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact quick row */}
            <div className="mt-4 pt-6 border-t border-zinc-200 grid sm:grid-cols-3 gap-3 text-sm">
              <a
                href={`tel:+${SITE_CONFIG.phoneRaw}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-red-700 transition-colors"
              >
                <Phone className="size-4 text-red-600" />
                <span>{SITE_CONFIG.phone}</span>
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-red-700 transition-colors truncate"
              >
                <Mail className="size-4 text-red-600 shrink-0" />
                <span className="truncate">E-mail</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 text-red-600 shrink-0" />
                <span className="truncate">Inhaúma, RJ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
