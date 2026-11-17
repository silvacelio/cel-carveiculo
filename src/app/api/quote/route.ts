import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface QuotePayload {
  name: string;
  phone: string;
  email?: string;
  vehicle?: string;
  plate?: string;
  year?: string;
  damageType?: string;
  parts?: string;
  description?: string;
  // JSON-stringified array of photo data URLs (base64).
  // Aumentado de 2.000 para 5.000.000 caracteres para suportar
  // até ~5 fotos comprimidas em base64 (~750 KB cada).
  photos?: string;
}

// Limite do campo `photos` no banco. 5_000_000 chars ≈ 3.7 MB de base64,
// suficiente para 5 fotos comprimidas a ~150 KB cada.
const MAX_PHOTOS_FIELD_LENGTH = 5_000_000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuotePayload;

    // Basic validation
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios." },
        { status: 400 }
      );
    }

    // Sanitize phone — keep only digits
    const phone = String(body.phone).replace(/\D/g, "");

    if (phone.length < 10) {
      return NextResponse.json(
        { error: "Telefone inválido." },
        { status: 400 }
      );
    }

    // Valida o campo `photos` antes de gravar.
    // Aceita apenas um array JSON válido de strings (cada uma um data URL).
    let photosField: string | null = null;
    if (body.photos) {
      const raw = String(body.photos);
      if (raw.length > MAX_PHOTOS_FIELD_LENGTH) {
        return NextResponse.json(
          {
            error:
              "Total de fotos excede o tamanho máximo permitido. Envie menos fotos ou imagens menores.",
          },
          { status: 400 }
        );
      }
      // Tenta fazer parse para garantir que é um array válido de strings.
      try {
        const parsed = JSON.parse(raw);
        if (
          !Array.isArray(parsed) ||
          parsed.some((p) => typeof p !== "string")
        ) {
          throw new Error("formato inválido");
        }
        photosField = raw;
      } catch {
        return NextResponse.json(
          { error: "Formato de fotos inválido." },
          { status: 400 }
        );
      }
    }

    const lead = await db.quoteLead.create({
      data: {
        name: String(body.name).slice(0, 200),
        phone,
        email: body.email ? String(body.email).slice(0, 200) : null,
        vehicle: body.vehicle ? String(body.vehicle).slice(0, 200) : null,
        plate: body.plate ? String(body.plate).slice(0, 20) : null,
        year: body.year ? String(body.year).slice(0, 10) : null,
        damageType: body.damageType
          ? String(body.damageType).slice(0, 100)
          : null,
        parts: body.parts ? String(body.parts).slice(0, 1000) : null,
        description: body.description
          ? String(body.description).slice(0, 2000)
          : null,
        photos: photosField,
      },
    });

    return NextResponse.json({
      success: true,
      id: lead.id,
      message: "Orçamento recebido com sucesso!",
    });
  } catch (error) {
    console.error("[QUOTE API ERROR]", error);
    return NextResponse.json(
      {
        error: "Não foi possível salvar o orçamento agora. Tente novamente.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await db.quoteLead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("[QUOTE GET ERROR]", error);
    return NextResponse.json({ leads: [] });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const body = (await req.json()) as { status?: string };

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório." },
        { status: 400 }
      );
    }

    const validStatuses = ["novo", "contatado", "aprovado", "recusado", "concluido"];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Status inválido." },
        { status: 400 }
      );
    }

    await db.quoteLead.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[QUOTE PATCH ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar orçamento." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório." },
        { status: 400 }
      );
    }

    await db.quoteLead.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[QUOTE DELETE ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao excluir orçamento." },
      { status: 500 }
    );
  }
}
