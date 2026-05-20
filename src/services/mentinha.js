import { promptBase } from "./promptBase";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

function extrairJSON(texto) {
  try {
    const limpo = texto
      .replace("```json", "")
      .replace("```", "")
      .trim();

    return JSON.parse(limpo);
  } catch {
    return {
      resposta: texto,
      emocaoDetectada: "Em análise",
      nivelAtencao: "Em avaliação",
      recomendacao: "Continuar acompanhamento emocional.",
    };
  }
}

export async function gerarRespostaIA(historico) {
  const mensagensFormatadas = historico.map((msg) => ({
    role: msg.autor === "usuario" ? "user" : "assistant",
    content: msg.texto,
  }));

  const resposta = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
${promptBase}

Responda SEMPRE em JSON válido, sem markdown, exatamente assim:
{
  "resposta": "mensagem acolhedora para o usuário",
  "emocaoDetectada": "emoção principal",
  "nivelAtencao": "baixo, moderado ou alto",
  "recomendacao": "recomendação interna curta"
}

Apenas o campo "resposta" será exibido ao usuário.
`,
        },
        ...mensagensFormatadas,
      ],
    }),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao conectar com a IA.");
  }

  const dados = await resposta.json();

  const textoIA =
    dados.choices?.[0]?.message?.content ||
    "{}";

  const resultado = extrairJSON(textoIA);

  return {
    resposta: resultado.resposta,
    emocaoDetectada: resultado.emocaoDetectada,
    nivelAtencao: resultado.nivelAtencao,
    recomendacao: resultado.recomendacao,
  };
}