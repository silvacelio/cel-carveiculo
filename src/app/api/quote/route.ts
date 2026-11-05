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
  photos?: string;
}

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
        photos: body.photos ? String(body.photos).slice(0, 2000) : null,
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
