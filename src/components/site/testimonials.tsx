"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/lib/site-data";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-16 lg:py-24 bg-gradient-to-b from-white to-zinc-50"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 lg:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-red-600" />
            <span className="text-xs uppercase tracking-widest font-bold text-red-700">
              Depoimentos
            </span>
            <div className="h-px w-8 bg-red-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-balance leading-tight">
            Clientes que saíram{" "}
            <span className="text-red-700">sorrindo daqui</span>.
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="size-6 fill-amber-500 text-amber-500"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              <span className="text-foreground font-bold">4.9/5</span> — baseado
              em mais de 320 avaliações
            </p>
          </div>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full p-6 border-zinc-200/60 hover:shadow-lg transition-shadow bg-white relative">
                <Quote className="size-8 text-red-600/20 absolute top-5 right-5" />

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="size-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                  <Avatar className="size-10 bg-gradient-to-br from-red-600 to-red-800 text-white">
                    <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-sm">
                      {getInitials(t.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.vehicle} · {t.service}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                    {t.date}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer about example testimonials */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs text-muted-foreground/70 mt-8"
        >
          * Os depoimentos acima são exemplos ilustrativos. Em breve,
          substituiremos por avaliações reais enviadas pelos nossos clientes.
        </motion.p>
      </div>
    </section>
  );
}
