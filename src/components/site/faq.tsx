"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, HelpCircle } from "lucide-react";
import { FAQ_ITEMS, SITE_CONFIG } from "@/lib/site-data";

export function Faq() {
  return (
    <section id="faq" className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 lg:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-red-600" />
            <span className="text-xs uppercase tracking-widest font-bold text-red-700">
              Perguntas Frequentes
            </span>
            <div className="h-px w-8 bg-red-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-balance leading-tight">
            Tudo o que você{" "}
            <span className="text-red-700">precisa saber</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-base lg:text-lg">
            Não achou sua resposta? Fale com a gente — estamos a uma mensagem de
            distância.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            defaultValue="faq-0"
          >
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-zinc-200 rounded-xl px-5 bg-zinc-50/40 hover:bg-zinc-50 transition-colors data-[state=open]:bg-white data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left text-base lg:text-lg font-semibold hover:no-underline py-5">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
                    <span>{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm lg:text-base text-muted-foreground leading-relaxed pb-5 pl-8">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 text-white"
        >
          <h3 className="text-xl lg:text-2xl font-bold mb-2">
            Ainda com dúvidas?
          </h3>
          <p className="text-zinc-300 mb-5 text-sm lg:text-base">
            Chame a gente no WhatsApp — resposta rápida em horário comercial.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <a
              href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="size-5 mr-2" />
              Chamar no WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
