"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-data";

export function Contact() {
  return (
    <section
      id="contato"
      className="py-16 lg:py-24 bg-gradient-to-b from-zinc-50 to-white"
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
              Visite a Oficina
            </span>
            <div className="h-px w-8 bg-red-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-balance leading-tight">
            Venha nos{" "}
            <span className="text-red-700">conhecer pessoalmente</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-base lg:text-lg">
            Estamos em Inhaúma, Rio de Janeiro. Atendimento de segunda a sábado.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Map - 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="overflow-hidden p-0 border-zinc-200/60 h-full min-h-[400px]">
              <iframe
                src={SITE_CONFIG.mapsEmbed}
                className="size-full min-h-[400px] grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa — Cel-Car Funilaria e Pintura"
              />
            </Card>
          </motion.div>

          {/* Contact info - 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* Address card */}
            <Card className="p-5 border-zinc-200/60">
              <div className="flex gap-4">
                <div className="size-11 rounded-xl bg-red-600/10 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    Endereço
                  </p>
                  <p className="font-semibold text-foreground">
                    {SITE_CONFIG.address.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {SITE_CONFIG.address.district} — {SITE_CONFIG.address.city}/
                    {SITE_CONFIG.address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP {SITE_CONFIG.address.zip}
                  </p>
                  <a
                    href={SITE_CONFIG.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 mt-2 hover:underline"
                  >
                    Como chegar
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Phone card */}
            <Card className="p-5 border-zinc-200/60">
              <div className="flex gap-4">
                <div className="size-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <Phone className="size-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    Telefone & WhatsApp
                  </p>
                  <a
                    href={`tel:+${SITE_CONFIG.phoneRaw}`}
                    className="font-semibold text-foreground hover:text-red-700 transition-colors block"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                  <Button
                    size="sm"
                    asChild
                    className="mt-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-9"
                  >
                    <a
                      href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-4 mr-1.5" />
                      Chamar agora
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Email card */}
            <Card className="p-5 border-zinc-200/60">
              <div className="flex gap-4">
                <div className="size-11 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Mail className="size-5 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                    E-mail
                  </p>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="font-semibold text-foreground hover:text-red-700 transition-colors break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
            </Card>

            {/* Hours card */}
            <Card className="p-5 border-zinc-200/60 bg-zinc-900 text-white">
              <div className="flex gap-4">
                <div className="size-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Clock className="size-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
                    Horário de Atendimento
                  </p>
                  <ul className="space-y-1.5">
                    {SITE_CONFIG.hours.map((h) => (
                      <li
                        key={h.day}
                        className="flex justify-between text-sm gap-3"
                      >
                        <span className="text-zinc-300">{h.day}</span>
                        <span
                          className={
                            h.time === "Fechado"
                              ? "text-red-400 font-medium"
                              : "text-white font-semibold"
                          }
                        >
                          {h.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
