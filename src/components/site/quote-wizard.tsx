"use client";

import { useState, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Car,
  Camera,
  User,
  Send,
  Loader2,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Upload,
  Trash2,
  FileImage,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/site-data";
import { cn } from "@/lib/utils";

interface QuoteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DAMAGE_TYPES = [
  { id: "batida", label: "Batida / Amassado", emoji: "💥" },
  { id: "arranhao", label: "Arranhão / Risca", emoji: "📏" },
  { id: "repintura", label: "Repintura completa", emoji: "🎨" },
  { id: "parachoques", label: "Parachoques danificado", emoji: "🛡️" },
  { id: "ferrugem", label: "Ferrugem", emoji: "🦠" },
  { id: "outro", label: "Outro", emoji: "🔧" },
];

const PARTS_OPTIONS = [
  { id: "capo", label: "Capô" },
  { id: "parachoque-dianteiro", label: "Para-choque dianteiro" },
  { id: "parachoque-traseiro", label: "Para-choque traseiro" },
  { id: "porta", label: "Porta(s)" },
  { id: "para-lama", label: "Para-lama" },
  { id: "lateral", label: "Lateral completa" },
  { id: "teto", label: "Teto" },
  { id: "retrovisor", label: "Retrovisor" },
  { id: "maparancho", label: "Maçaneta / Retrovisor" },
  { id: "outro", label: "Outro" },
];

const STEPS = [
  { id: 0, label: "Dano", icon: Car },
  { id: 1, label: "Peça", icon: Car },
  { id: 2, label: "Fotos", icon: Camera },
  { id: 3, label: "Dados", icon: User },
  { id: 4, label: "Confirma", icon: Check },
];

interface FormData {
  damageType: string;
  parts: string[];
  description: string;
  vehicle: string;
  year: string;
  plate: string;
  name: string;
  phone: string;
  email: string;
}

interface UploadedPhoto {
  path: string; // agora guarda um data URL (base64) — funciona em qualquer hospedagem
  name: string;
  size: number;
}

const INITIAL_FORM: FormData = {
  damageType: "",
  parts: [],
  description: "",
  vehicle: "",
  year: "",
  plate: "",
  name: "",
  phone: "",
  email: "",
};

const MAX_PHOTOS = 5;
const MAX_SOURCE_MB = 15; // limite do arquivo ORIGINAL que o usuário escolhe
const COMPRESS_MAX_DIMENSION = 1024; // redimensiona para no máximo 1024px (era 1280)
const COMPRESS_QUALITY = 0.62; // qualidade JPEG (era 0.72 — mais agressivo)
// Limite total do payload que vamos enviar para a Vercel.
// A Vercel corta em 4.5 MB no plano grátis — deixamos margem de segurança.
const MAX_TOTAL_PAYLOAD_BYTES = 3_500_000; // ~3.3 MB (deixa folga p/ outros campos)

export function QuoteWizard({ open, onOpenChange }: QuoteWizardProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep(0);
    setForm(INITIAL_FORM);
    setSuccess(false);
    setSubmitting(false);
    setPhotos([]);
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(reset, 300);
    }
  };

  const canProceed = (): boolean => {
    if (step === 0) return !!form.damageType;
    if (step === 1) return form.parts.length > 0;
    if (step === 2) return true; // photos are optional
    if (step === 3)
      return (
        !!form.name && form.phone.replace(/\D/g, "").length >= 10 && !!form.vehicle
      );
    return true;
  };

  const togglePart = (id: string) => {
    setForm((prev) => ({
      ...prev,
      parts: prev.parts.includes(id)
        ? prev.parts.filter((p) => p !== id)
        : [...prev.parts, id],
    }));
  };

  /**
   * Lê um File de imagem, redimensiona para no máximo COMPRESS_MAX_DIMENSION px
   * (mantendo proporção) e devolve um data URL JPEG.
   *
   * Faz tudo isso no navegador (Canvas API), sem chamar API nenhuma.
   * Funciona em qualquer hospedagem (Vercel, Netlify, etc.) porque
   * não depende de escrever em disco.
   *
   * Se a foto ficar maior que TARGET_SIZE_BYTES após a primeira compressão,
   * recomprime com qualidade progressivamente menor até caber.
   */
  const compressImage = async (file: File): Promise<string> => {
    const TARGET_SIZE_BYTES = 350_000; // ~350 KB por foto (base64 ≈ 470 KB)

    const readImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onerror = () => reject(new Error("Imagem inválida ou corrompida."));
        img.onload = () => resolve(img);
        img.src = src;
      });

    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    });

    const img = await readImg(dataUrl);
    let { width, height } = img;

    // Redimensiona mantendo proporção se algum lado > máximo
    if (width > height && width > COMPRESS_MAX_DIMENSION) {
      height = Math.round((height * COMPRESS_MAX_DIMENSION) / width);
      width = COMPRESS_MAX_DIMENSION;
    } else if (height > COMPRESS_MAX_DIMENSION) {
      width = Math.round((width * COMPRESS_MAX_DIMENSION) / height);
      height = COMPRESS_MAX_DIMENSION;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas não suportado neste navegador.");
    }

    // Fundo branco para imagens PNG com transparência virarem JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Mantém PNG só se a original for PNG; caso contrário JPEG (bem menor)
    const usePng = file.type === "image/png";
    const mime = usePng ? "image/png" : "image/jpeg";

    // Compressão iterativa: se ainda estiver grande, baixa a qualidade.
    let quality = COMPRESS_QUALITY;
    let out = canvas.toDataURL(mime, quality);
    while (!usePng && out.length > TARGET_SIZE_BYTES && quality > 0.25) {
      quality -= 0.12;
      out = canvas.toDataURL(mime, quality);
    }

    return out;
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const available = MAX_PHOTOS - photos.length;
    if (available <= 0) {
      toast.error(`Máximo de ${MAX_PHOTOS} fotos.`);
      e.target.value = "";
      return;
    }

    const toProcess = Array.from(files).slice(0, available);
    setUploadingPhotos(true);

    const newPhotos: UploadedPhoto[] = [];

    try {
      for (const f of toProcess) {
        // Valida tipo — aceita qualquer imagem (image/*)
        if (!f.type.startsWith("image/")) {
          toast.error(`${f.name} não é uma imagem válida.`);
          continue;
        }
        // Valida tamanho do arquivo original (15 MB)
        if (f.size > MAX_SOURCE_MB * 1024 * 1024) {
          toast.error(`${f.name} excede ${MAX_SOURCE_MB}MB.`);
          continue;
        }

        try {
          const dataUrl = await compressImage(f);
          newPhotos.push({
            path: dataUrl, // data URL base64
            name: f.name,
            size: f.size,
          });
        } catch (err) {
          console.error("[Compress error]", f.name, err);
          toast.error(`${f.name} não pôde ser processada.`);
        }
      }

      if (newPhotos.length > 0) {
        setPhotos((prev) => [...prev, ...newPhotos]);
        toast.success(`${newPhotos.length} foto(s) adicionada(s).`);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Falha ao processar fotos."
      );
    } finally {
      setUploadingPhotos(false);
      e.target.value = "";
    }
  };

  const removePhoto = (path: string) => {
    setPhotos((prev) => prev.filter((p) => p.path !== path));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const photosJson =
        photos.length > 0 ? JSON.stringify(photos.map((p) => p.path)) : undefined;

      // Verificação de segurança: se o total passar de 3.3 MB,
      // a Vercel rejeita com 413. Avisamos o usuário antes.
      if (photosJson && photosJson.length > MAX_TOTAL_PAYLOAD_BYTES) {
        toast.error(
          "Fotos muito grandes. Remova algumas e tente novamente, ou envie pelo WhatsApp."
        );
        setSubmitting(false);
        return;
      }

      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        vehicle: form.vehicle,
        plate: form.plate || undefined,
        year: form.year || undefined,
        damageType:
          DAMAGE_TYPES.find((d) => d.id === form.damageType)?.label ||
          form.damageType,
        parts: form.parts
          .map((id) => PARTS_OPTIONS.find((p) => p.id === id)?.label || id)
          .join(", "),
        description: form.description,
        // photos agora é um array de data URLs (base64) — vai direto como JSON
        photos: photosJson,
      };

      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Lida com resposta não-JSON (ex.: 413 da Vercel) de forma amigável
      let data: { error?: string; success?: boolean; id?: string };
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Vercel pode retornar HTML (413, 504, etc.) — usa status para msg
        if (response.status === 413) {
          throw new Error(
            "Fotos grandes demais. Reduza a quantidade ou envie pelo WhatsApp."
          );
        }
        throw new Error(
          `Erro ${response.status}. Tente novamente ou chame no WhatsApp.`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar orçamento");
      }

      setSuccess(true);
      toast.success("Orçamento enviado! A Cel-Car vai responder em breve.");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar agora. Tente pelo WhatsApp (21) 97708-6841."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const buildWhatsAppMessage = () => {
    const damageLabel =
      DAMAGE_TYPES.find((d) => d.id === form.damageType)?.label || "";
    const partsLabel = form.parts
      .map((id) => PARTS_OPTIONS.find((p) => p.id === id)?.label || id)
      .join(", ");
    return encodeURIComponent(
      `Olá! Vim pelo site da Cel-Car. Gostaria de um orçamento.\n\n` +
        `*Nome:* ${form.name}\n` +
        `*Veículo:* ${form.vehicle}\n` +
        `*Ano:* ${form.year || "-"}\n` +
        `*Placa:* ${form.plate || "-"}\n` +
        `*Tipo de dano:* ${damageLabel}\n` +
        `*Peça(s):* ${partsLabel}\n` +
        `*Descrição:* ${form.description || "-"}\n` +
        `*Telefone:* ${form.phone}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0 max-h-[95vh] flex flex-col">
        <DialogTitle className="sr-only">
          Solicitar orçamento — Cel-Car
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados do veículo e do dano para receber um orçamento
          personalizado da Cel-Car.
        </DialogDescription>

        {/* Header with progress */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-4 lg:p-5 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-base">Solicitar Orçamento</p>
              <p className="text-xs text-red-100/90">
                Cel-Car · Funilaria e Pintura
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleClose(false)}
              className="text-white hover:bg-white/10 size-8"
              aria-label="Fechar"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isCurrent = i === step;
              const isDone = i < step || success;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all",
                      isCurrent && "bg-white/20",
                      isDone && "text-amber-300",
                      !isCurrent && !isDone && "text-white/60"
                    )}
                  >
                    <div
                      className={cn(
                        "size-5 rounded-full flex items-center justify-center text-[10px]",
                        isDone
                          ? "bg-amber-400 text-red-900"
                          : isCurrent
                          ? "bg-white text-red-700"
                          : "bg-white/20 text-white/60"
                      )}
                    >
                      {isDone ? <Check className="size-3" /> : i + 1}
                    </div>
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "h-px flex-1 mx-1",
                        isDone ? "bg-amber-400/60" : "bg-white/20"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 lg:p-6 overflow-y-auto flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 px-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="inline-flex items-center justify-center size-20 rounded-full bg-green-100 mb-5"
                >
                  <CheckCircle2 className="size-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-black mb-2 text-balance">
                  Orçamento enviado! 🎉
                </h3>
                <p className="text-muted-foreground mb-1 text-pretty">
                  Recebemos sua solicitação, <strong>{form.name}</strong>.
                </p>
                <p className="text-muted-foreground mb-6 text-sm">
                  A Cel-Car vai analisar e responder em até 1 dia útil. Para
                  resposta mais rápida, complete o envio pelo WhatsApp:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <a
                      href={`https://wa.me/${SITE_CONFIG.phoneRaw}?text=${buildWhatsAppMessage()}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="size-4 mr-2" />
                      Enviar pelo WhatsApp
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleClose(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Step 0: Damage type */}
                {step === 0 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        O que aconteceu com seu carro?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Selecione o tipo de dano. Isso nos ajuda a entender o
                        serviço necessário.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {DAMAGE_TYPES.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, damageType: d.id }))
                          }
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all flex flex-col gap-1",
                            form.damageType === d.id
                              ? "border-red-600 bg-red-50 shadow-sm"
                              : "border-zinc-200 hover:border-red-300 hover:bg-zinc-50"
                          )}
                        >
                          <span className="text-2xl">{d.emoji}</span>
                          <span className="text-sm font-semibold">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 1: Parts */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        Qual(is) peça(s) precisa de reparo?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Pode selecionar mais de uma. Toque para marcar.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {PARTS_OPTIONS.map((p) => {
                        const selected = form.parts.includes(p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => togglePart(p.id)}
                            className={cn(
                              "px-3 py-2.5 rounded-lg border-2 text-sm text-left transition-all flex items-center justify-between",
                              selected
                                ? "border-red-600 bg-red-50 text-red-900 font-semibold"
                                : "border-zinc-200 hover:border-red-300"
                            )}
                          >
                            {p.label}
                            {selected && <Check className="size-4 text-red-600" />}
                          </button>
                        );
                      })}
                    </div>
                    {form.parts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {form.parts.map((id) => (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="bg-red-100 text-red-800"
                          >
                            {PARTS_OPTIONS.find((p) => p.id === id)?.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div>
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold mb-1.5 block"
                      >
                        Descreva o dano (opcional)
                      </Label>
                      <Textarea
                        id="description"
                        value={form.description}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Ex.: bati num poste e amassei o para-choque, tem arranhão na porta do motorista..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Photos */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        Envie fotos do dano (opcional)
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Fotos ajudam a dar um orçamento mais preciso. Até{" "}
                        {MAX_PHOTOS} fotos. Elas são comprimidas
                        automaticamente para enviar mais rápido. Você também
                        pode pular esta etapa.
                      </p>
                    </div>

                    {/* Upload dropzone */}
                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhotos}
                        className="w-full rounded-xl border-2 border-dashed border-zinc-300 hover:border-red-400 hover:bg-red-50/30 p-6 text-center bg-zinc-50/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingPhotos ? (
                          <>
                            <Loader2 className="size-10 text-red-600 mx-auto mb-2 animate-spin" />
                            <p className="text-sm font-semibold text-foreground">
                              Processando fotos...
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="size-10 text-zinc-400 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-foreground">
                              Clique para enviar fotos
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              JPG, PNG ou WEBP — comprimimos automaticamente
                            </p>
                          </>
                        )}
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    {/* Photos preview grid */}
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, i) => (
                          <div
                            key={photo.path}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100"
                          >
                            <img
                              src={photo.path}
                              alt={`Foto ${i + 1}`}
                              className="size-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(photo.path)}
                              className="absolute top-1 right-1 size-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                              aria-label="Remover foto"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                              <p className="text-[10px] text-white font-medium truncate">
                                {photo.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Photo counter */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <FileImage className="size-3.5" />
                        {photos.length} / {MAX_PHOTOS} fotos enviadas
                      </span>
                      {photos.length > 0 && photos.length < MAX_PHOTOS && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-red-700 hover:underline font-semibold"
                        >
                          + Adicionar mais
                        </button>
                      )}
                    </div>

                    {/* Tip */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        <strong>Dica:</strong> tire as fotos com boa luz, de
                        perto e de longe, mostrando o veículo todo.
                      </p>
                    </div>

                    {/* WhatsApp fallback */}
                    <div className="pt-2 text-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        Prefere enviar pelo WhatsApp?
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-white"
                      >
                        <a
                          href={`https://wa.me/${SITE_CONFIG.phoneRaw}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="size-4 mr-2" />
                          Chamar no WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Customer data */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        Seus dados de contato
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Para retornarmos com o orçamento. Não compartilhamos com
                        terceiros.
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold">
                          Nome completo *
                        </Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Seu nome"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold">
                          WhatsApp / Telefone *
                        </Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="(21) 99999-9999"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="vehicle"
                        className="text-sm font-semibold"
                      >
                        Veículo (marca e modelo) *
                      </Label>
                      <Input
                        id="vehicle"
                        value={form.vehicle}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            vehicle: e.target.value,
                          }))
                        }
                        placeholder="Ex.: Honda Civic 2019"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="year" className="text-sm font-semibold">
                          Ano
                        </Label>
                        <Input
                          id="year"
                          value={form.year}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, year: e.target.value }))
                          }
                          placeholder="2019"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plate" className="text-sm font-semibold">
                          Placa
                        </Label>
                        <Input
                          id="plate"
                          value={form.plate}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              plate: e.target.value.toUpperCase(),
                            }))
                          }
                          placeholder="ABC1D23"
                          className="mt-1 uppercase"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-semibold">
                        E-mail (opcional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="voce@email.com"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">
                        Confira seus dados
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Tudo certo? Clique em enviar para finalizar.
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-2.5 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Nome:</span>
                        <span className="font-semibold text-right">{form.name}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Telefone:</span>
                        <span className="font-semibold text-right">{form.phone}</span>
                      </div>
                      {form.email && (
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">E-mail:</span>
                          <span className="font-semibold text-right truncate">
                            {form.email}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Veículo:</span>
                        <span className="font-semibold text-right">
                          {form.vehicle}
                          {form.year && ` · ${form.year}`}
                        </span>
                      </div>
                      {form.plate && (
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">Placa:</span>
                          <span className="font-semibold">{form.plate}</span>
                        </div>
                      )}
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Dano:</span>
                        <span className="font-semibold text-right">
                          {DAMAGE_TYPES.find((d) => d.id === form.damageType)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Peça(s):</span>
                        <span className="font-semibold text-right max-w-[60%]">
                          {form.parts
                            .map(
                              (id) =>
                                PARTS_OPTIONS.find((p) => p.id === id)?.label || id
                            )
                            .join(", ")}
                        </span>
                      </div>
                      {form.description && (
                        <div className="pt-2 border-t border-zinc-200">
                          <span className="text-muted-foreground text-xs">
                            Descrição:
                          </span>
                          <p className="mt-1 text-foreground">
                            {form.description}
                          </p>
                        </div>
                      )}
                      {photos.length > 0 && (
                        <div className="pt-2 border-t border-zinc-200">
                          <span className="text-muted-foreground text-xs">
                            Fotos anexadas ({photos.length}):
                          </span>
                          <div className="mt-2 flex gap-2 flex-wrap">
                            {photos.map((p, i) => (
                              <a
                                key={p.path}
                                href={p.path}
                                target="_blank"
                                rel="noreferrer"
                                className="block size-14 rounded-md overflow-hidden border border-zinc-200 hover:opacity-80 transition-opacity"
                              >
                                <img
                                  src={p.path}
                                  alt={`Foto ${i + 1}`}
                                  className="size-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / navigation */}
        {!success && (
          <div className="p-4 border-t border-zinc-200 bg-white flex items-center justify-between gap-3 shrink-0">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || submitting}
            >
              <ArrowLeft className="size-4 mr-2" />
              Voltar
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Continuar
                <ArrowRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="size-4 mr-2" />
                    Enviar orçamento
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
