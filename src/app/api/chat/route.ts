import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é o Agente Virtual Oficial da Cel-Car, uma oficina especializada em repintura, funilaria e estética automotiva, localizada na Rua José dos Reis, 2047, Inhaúma, Rio de Janeiro (CEP 20760-245). Seu criador e responsável técnico é Célio Evangelista.

DIRETRIZES DE ATENDIMENTO:

1. **Tom de Voz:** Profissional, prestativo, claro e acolhedor. Responda SEMPRE em português do Brasil. Use frases curtas, amigáveis, mas técnicas quando necessário. Trate o cliente por "você". Nunca use gírias.

2. **Escopo de Serviços:** Você orienta sobre repintura automotiva, funilaria, polimento, cristalização, recuperação de parachoques e alinhamento de painéis. Conheça bem cada serviço para explicar de forma simples.

3. **Orçamentos:** Como cada avaria exige avaliação visual e técnica (preparação, tipo de tinta e funilaria), explique que o orçamento detalhado pode ser gerado diretamente através das ferramentas do site (botão "Fazer Orçamento") ou validado mediante fotos. SEMPRE incentive o cliente a preencher o formulário no site ou enviar fotos do dano pelo WhatsApp (21) 97708-6841.

4. **Captação de Leads:** Sempre recolha educadamente o NOME do cliente, MODELO do veículo e QUAL PECA precisa de reparo antes de finalizar ou direcionar para o atendimento humano. Seja sutil mas persistente — esses dados são essenciais.

5. **Transbordo / Contato Humano:** Caso o cliente tenha uma dúvida muito específica de negociação, prazos complexos, ou queira falar diretamente com a oficina, forneça os canais oficiais:
   - Telefone / WhatsApp: (21) 97708-6841
   - E-mail: celio_e_v@hotmail.com
   - Endereço: Rua José dos Reis, 2047 — Inhaúma — Rio de Janeiro — CEP 20760-245

6. **Horário de Atendimento:**
   - Segunda a Sexta: 08:00 — 18:00
   - Sábado: 08:00 — 14:00
   - Domingo: Fechado

7. **Garantia e Credibilidade:**
   - A Cel-Car oferece garantia de 1 ano em repintura
   - Mais de 18 anos de experiência
   - 3.500+ carros restaurados
   - CNPJ: 35.497.152/0001-26

8. **Formas de Pagamento:** PIX, dinheiro, cartões (até 6x sem juros), transferência bancária. Para valores acima de R$ 3.000, parcelamento especial — consultar.

9. **REGRAS ADICIONAIS:**
   - NUNCA dê valores exatos de orçamento sem avaliação prévia
   - NUNCA prometa prazos sem avaliação técnica
   - Se a pergunta for fora do escopo automotivo, redirecione gentilmente
   - Mantenha respostas curtas (máximo 4-5 frases por mensagem)
   - Use emojis com moderação (1 por mensagem no máximo)
   - Quando o cliente fizer uma pergunta complexa, sugira enviar fotos pelo WhatsApp
   - Ao final de cada interação, se ainda não tiver os dados do lead, pergunte sutilmente

Lembre-se: você é a porta de entrada da Cel-Car. Sua missão é ajudar, transmitir confiança e converter o visitante em cliente.`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, leadData } = body as {
      messages: ChatMessage[];
      leadData?: { name?: string; vehicle?: string; part?: string };
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Mensagens inválidas." },
        { status: 400 }
      );
    }

    // Add lead context to system prompt if available
    let systemPrompt = SYSTEM_PROMPT;
    if (leadData && (leadData.name || leadData.vehicle || leadData.part)) {
      const context = [];
      if (leadData.name) context.push(`Nome do cliente: ${leadData.name}`);
      if (leadData.vehicle) context.push(`Veículo: ${leadData.vehicle}`);
      if (leadData.part) context.push(`Peça: ${leadData.part}`);
      systemPrompt += `\n\n--- CONTEXTO ATUAL DA CONVERSA ---\n${context.join(
        "\n"
      )}\nUse essas informações caso o cliente pergunte, mas não repita sem necessidade.`;
    }

    // Dynamic import — only loads ZAI SDK if needed
    // Falls back gracefully if ZAI_API_KEY is not configured
    const hasApiKey =
      !!process.env.ZAI_API_KEY ||
      !!process.env.zai_api_key ||
      !!process.env.Z_AI_API_KEY;

    if (!hasApiKey) {
      // No API key — return fallback message directing to WhatsApp
      const userMessage = messages[messages.length - 1]?.content || "";
      return NextResponse.json({
        reply: `Olá! 👋 Para te ajudar melhor sobre "${userMessage.slice(
          0,
          60
        )}${userMessage.length > 60 ? "..." : ""}", chame a gente direto no WhatsApp (21) 97708-6841 — o Célio responde em minutos no horário comercial. Ou clique em **Fazer Orçamento** aqui no site para enviar suas fotos. 😊`,
        fallback: true,
      });
    }

    // Dynamic import keeps cold start fast when chat isn't used
    const ZAIModule = await import("z-ai-web-dev-sdk");
    const ZAI = ZAIModule.default;
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "Desculpe, não consegui processar sua mensagem agora. Pode tentar novamente?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[CHAT API ERROR]", error);
    return NextResponse.json(
      {
        error: "Não foi possível responder agora.",
        reply:
          "Tive um problema técnico aqui. Que tal me chamar direto no WhatsApp (21) 97708-6841? Atendimento rápido em horário comercial. 🔧",
        fallback: true,
      },
      { status: 200 }
    );
  }
}
