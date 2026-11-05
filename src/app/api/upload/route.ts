import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("photos");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma foto enviada." },
        { status: 400 }
      );
    }

    // Ensure directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const savedPaths: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Validate MIME
      if (!ALLOWED_MIME.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Tipo de arquivo não suportado: ${file.name}. Use JPG, PNG ou WEBP.`,
          },
          { status: 400 }
        );
      }

      // Validate size
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          {
            error: `Arquivo ${file.name} excede 5MB.`,
          },
          { status: 400 }
        );
      }

      // Generate unique name
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const hash = crypto.randomBytes(12).toString("hex");
      const fileName = `celcar-${Date.now()}-${hash}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // Write to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      savedPaths.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      paths: savedPaths,
      message: `${savedPaths.length} foto(s) salva(s) com sucesso.`,
    });
  } catch (error) {
    console.error("[UPLOAD API ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao salvar fotos. Tente novamente." },
      { status: 500 }
    );
  }
}
