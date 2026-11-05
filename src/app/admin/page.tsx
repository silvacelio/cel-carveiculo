"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Lock,
  LogOut,
  Search,
  Phone,
  Mail,
  Car,
  Calendar,
  Trash2,
  MessageCircle,
  Eye,
  X,
  Filter,
  Inbox,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/site-data";

interface Quote {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  vehicle: string | null;
  plate: string | null;
  year: string | null;
  damageType: string | null;
  parts: string | null;
  description: string | null;
  photos: string | null;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo", color: "bg-blue-100 text-blue-800" },
  { value: "contatado", label: "Contatado", color: "bg-amber-100 text-amber-800" },
  { value: "aprovado", label: "Aprovado", color: "bg-green-100 text-green-800" },
  { value: "recusado", label: "Recusado", color: "bg-red-100 text-red-800" },
  { value: "concluido", label: "Concluído", color: "bg-zinc-200 text-zinc-800" },
];

// In production, use a proper auth system. This is a simple demo password.
// Configure via ADMIN_PASSWORD env var on Vercel, fallback to dev default.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "celcar2026";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Check sessionStorage for auth
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ok = sessionStorage.getItem("celcar_admin_authed") === "true";
      if (ok) setAuthed(true);
    }
  }, []);

  // Load quotes when authed
  useEffect(() => {
    if (authed) {
      loadQuotes();
    }
  }, [authed]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/quote");
      const data = await response.json();
      setQuotes(data.leads || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar orçamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("celcar_admin_authed", "true");
      setLoginError(false);
      toast.success("Bem-vindo, Célio!");
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem("celcar_admin_authed");
    setPassword("");
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/quote?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error();
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status } : q))
      );
      if (selectedQuote?.id === id) {
        setSelectedQuote({ ...selectedQuote, status });
      }
      toast.success("Status atualizado.");
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;
    try {
      const response = await fetch(`/api/quote?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) setSelectedQuote(null);
      toast.success("Orçamento excluído.");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPhotoPaths = (photosStr: string | null): string[] => {
    if (!photosStr) return [];
    try {
      return JSON.parse(photosStr);
    } catch {
      return [];
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      !search ||
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.phone.includes(search) ||
      (q.vehicle || "").toLowerCase().includes(search.toLowerCase()) ||
      (q.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-950 p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/80 backdrop-blur">
          <CardHeader className="text-center space-y-3">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-900/30 mx-auto">
              <ShieldCheck className="size-7 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-white">
                Painel Administrativo
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Cel-Car · Funilaria e Pintura
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label
                  htmlFor="password"
                  className="text-zinc-300 text-sm font-semibold"
                >
                  Senha
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError(false);
                    }}
                    placeholder="Digite a senha"
                    className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    autoFocus
                  />
                </div>
                {loginError && (
                  <p className="text-xs text-red-400 mt-2">
                    Senha incorreta. Tente novamente.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                Entrar
              </Button>
              <div className="text-center text-xs text-zinc-500 pt-2">
                <p>
                  Acesso restrito. Em caso de dúvida, contate o responsável
                  técnico.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
              <span className="font-black text-amber-400 text-sm">C</span>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm">Painel Cel-Car</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {quotes.length} orçamento(s) recebido(s)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadQuotes}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : null}
              Atualizar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              <LogOut className="size-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Stats summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <Card className="p-4 border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Inbox className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 leading-none">
                  {quotes.filter((q) => q.status === "novo").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Novos</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 leading-none">
                  {quotes.filter((q) => q.status === "contatado").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Em contato</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 leading-none">
                  {quotes.filter((q) => q.status === "aprovado").length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Aprovados</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-zinc-100 flex items-center justify-center">
                <Inbox className="size-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 leading-none">
                  {quotes.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone, veículo..."
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="size-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quotes list */}
        {loading && quotes.length === 0 ? (
          <div className="text-center py-16">
            <Loader2 className="size-8 text-red-600 mx-auto animate-spin" />
            <p className="text-sm text-muted-foreground mt-3">
              Carregando orçamentos...
            </p>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <Card className="p-12 border-dashed border-zinc-300 text-center">
            <Inbox className="size-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {quotes.length === 0
                ? "Nenhum orçamento recebido ainda."
                : "Nenhum orçamento corresponde aos filtros."}
            </p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredQuotes.map((quote) => {
              const statusOpt =
                STATUS_OPTIONS.find((s) => s.value === quote.status) ||
                STATUS_OPTIONS[0];
              const photos = getPhotoPaths(quote.photos);
              return (
                <Card
                  key={quote.id}
                  className="p-4 lg:p-5 border-zinc-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-base text-foreground">
                          {quote.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusOpt.color}`}
                        >
                          {statusOpt.label}
                        </span>
                        {photos.length > 0 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1"
                          >
                            <ImageIcon className="size-3" />
                            {photos.length} foto(s)
                          </Badge>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Phone className="size-3" />
                          {quote.phone}
                        </span>
                        {quote.vehicle && (
                          <span className="flex items-center gap-1.5">
                            <Car className="size-3" />
                            {quote.vehicle}
                            {quote.year && ` · ${quote.year}`}
                            {quote.plate && ` · ${quote.plate}`}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3" />
                          {formatDate(quote.createdAt)}
                        </span>
                        {quote.damageType && (
                          <span>Dano: {quote.damageType}</span>
                        )}
                      </div>
                      {quote.parts && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <strong>Peças:</strong> {quote.parts}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Select
                        value={quote.status}
                        onValueChange={(v) => updateStatus(quote.id, v)}
                      >
                        <SelectTrigger className="w-32 h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedQuote(quote)}
                        className="h-9"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-9 bg-green-50 hover:bg-green-100 border-green-200"
                      >
                        <a
                          href={`https://wa.me/55${quote.phone.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="size-4 text-green-600" />
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteQuote(quote.id)}
                        className="h-9 text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail dialog */}
      <Dialog
        open={!!selectedQuote}
        onOpenChange={(open) => !open && setSelectedQuote(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogTitle className="sr-only">Detalhes do orçamento</DialogTitle>
          <DialogDescription className="sr-only">
            Detalhes completos do orçamento recebido.
          </DialogDescription>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{selectedQuote.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Recebido em {formatDate(selectedQuote.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedQuote(null)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Telefone
                  </p>
                  <p className="font-semibold">{selectedQuote.phone}</p>
                </div>
                {selectedQuote.email && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      E-mail
                    </p>
                    <p className="font-semibold truncate">
                      {selectedQuote.email}
                    </p>
                  </div>
                )}
                {selectedQuote.vehicle && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Veículo
                    </p>
                    <p className="font-semibold">
                      {selectedQuote.vehicle}
                      {selectedQuote.year && ` · ${selectedQuote.year}`}
                    </p>
                  </div>
                )}
                {selectedQuote.plate && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Placa
                    </p>
                    <p className="font-semibold uppercase">
                      {selectedQuote.plate}
                    </p>
                  </div>
                )}
                {selectedQuote.damageType && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Tipo de dano
                    </p>
                    <p className="font-semibold">{selectedQuote.damageType}</p>
                  </div>
                )}
                {selectedQuote.parts && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Peças afetadas
                    </p>
                    <p className="font-semibold">{selectedQuote.parts}</p>
                  </div>
                )}
              </div>

              {selectedQuote.description && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800 mb-1 font-semibold">
                    Descrição do cliente
                  </p>
                  <p className="text-sm text-amber-900">
                    {selectedQuote.description}
                  </p>
                </div>
              )}

              {getPhotoPaths(selectedQuote.photos).length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">
                    Fotos anexadas ({getPhotoPaths(selectedQuote.photos).length})
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {getPhotoPaths(selectedQuote.photos).map(
                      (photo: string, i: number) => (
                        <a
                          key={i}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="aspect-square rounded-lg overflow-hidden border border-zinc-200 hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={photo}
                            alt={`Foto ${i + 1}`}
                            className="size-full object-cover"
                          />
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-zinc-200">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <a
                    href={`https://wa.me/55${selectedQuote.phone.replace(
                      /\D/g,
                      ""
                    )}?text=${encodeURIComponent(
                      `Olá, ${selectedQuote.name}! Aqui é a Cel-Car. Recebi seu pedido de orçamento${
                        selectedQuote.vehicle ? ` para o ${selectedQuote.vehicle}` : ""
                      }. Vamos conversar sobre o serviço.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-4 mr-2" />
                    Responder no WhatsApp
                  </a>
                </Button>
                {selectedQuote.email && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={`mailto:${selectedQuote.email}`}>
                      <Mail className="size-4 mr-2" />
                      E-mail
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
