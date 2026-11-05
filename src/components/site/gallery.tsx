"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Car, ArrowLeftRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GALLERY_ITEMS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "repintura", label: "Repintura" },
  { id: "funilaria", label: "Funilaria" },
  { id: "polimento", label: "Polimento" },
  { id: "parachoques", label: "Parachoques" },
];

interface GalleryProps {
  onQuoteClick: () => void;
}

export function Gallery({ onQuoteClick }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [sliderPos, setSliderPos] = useState<Record<number, number>>({});

  const filteredItems =
    activeCategory === "todos"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const handleSliderToggle = (id: number) => {
    setSliderPos((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? 100 : prev[id] === 100 ? 0 : 100,
    }));
  };

  return (
    <section
      id="galeria"
      className="py-16 lg:py-24 bg-zinc-950 text-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-40" />
      <div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-red-600/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 lg:mb-14"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-red-500" />
            <span className="text-xs uppercase tracking-widest font-bold text-red-400">
              Trabalhos Reais
            </span>
            <div className="h-px w-8 bg-red-500" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-balance leading-tight">
            Antes e depois que{" "}
            <span className="text-red-400">vão te convencer</span>.
          </h2>
          <p className="mt-4 text-zinc-400 text-base lg:text-lg text-pretty">
            Arraste o controle deslizante sobre cada foto para ver a
            transformação real dos nossos trabalhos.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 lg:mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all border",
                activeCategory === cat.id
                  ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-900/30"
                  : "bg-transparent text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-500"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {filteredItems.map((item, i) => {
            const pos = sliderPos[item.id] ?? 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="group h-full bg-zinc-900/80 backdrop-blur border-zinc-800 hover:border-red-600/50 transition-colors overflow-hidden">
                  {/* Before/After slider */}
                  <div className="relative aspect-[4/3] overflow-hidden select-none">
                    {/* After (background, full) */}
                    <img
                      src={item.after}
                      alt={`Depois — ${item.title}`}
                      className="absolute inset-0 size-full object-cover"
                      loading="lazy"
                    />
                    {/* Before (clipped) */}
                    <div
                      className="absolute inset-0 overflow-hidden transition-[width] duration-300 ease-out"
                      style={{ width: `${100 - pos}%` }}
                    >
                      <img
                        src={item.before}
                        alt={`Antes — ${item.title}`}
                        className="absolute inset-0 size-full object-cover"
                        style={{ width: `${(100 / (100 - pos)) * 100}%` }}
                        loading="lazy"
                      />
                    </div>

                    {/* Labels */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "bg-black/70 text-white border-0 backdrop-blur text-xs font-bold uppercase tracking-wider transition-opacity",
                          pos > 50 && "opacity-0"
                        )}
                      >
                        Antes
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-red-600/90 text-white border-0 backdrop-blur text-xs font-bold uppercase tracking-wider transition-opacity"
                      >
                        Depois
                      </Badge>
                    </div>

                    {/* Slider toggle button */}
                    <button
                      onClick={() => handleSliderToggle(item.id)}
                      className="absolute inset-0 flex items-center justify-center cursor-ew-resize group/btn"
                      aria-label="Alternar entre antes e depois"
                    >
                      <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-zinc-900 text-xs font-bold flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowLeftRight className="size-3.5" />
                        Arraste para comparar
                      </div>
                    </button>

                    {/* Gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none" />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Car className="size-3" />
                      {item.vehicle}
                    </p>
                    <h3 className="font-bold text-base lg:text-lg mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>{item.service}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {item.duration}
                      </span>
                    </div>
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
          <p className="text-zinc-300 mb-4 text-lg">
            Quer um resultado assim no seu carro?
          </p>
          <Button
            size="lg"
            onClick={onQuoteClick}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-900/40 px-7 h-12"
          >
            Quero meu orçamento
            <ArrowRight className="size-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
