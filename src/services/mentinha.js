import { construirPrompt } from "./promptBase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
      riscoEmocional: "baixo",
      recomendacao: "Continuar acompanhamento emocional.",
    };
  }
}

export async function gerarRespostaIA(historico, nomeAluno = "Aluno", ultimoCheckin = null) {
  const mensagensTexto = historico
    .map((msg) => `${msg.autor === "usuario" ? "Aluno" : "Mentinha"}: ${msg.texto}`)
    .join("\n");

  const resposta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
${construirPrompt(nomeAluno, ultimoCheckin)}

Histórico da conversa:
${mensagensTexto}
                `,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!resposta.ok) {
    throw new Error(`Erro na API: ${resposta.status}`);
  }

  const dados = await resposta.json();

  const textoIA =
    dados.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  const resultado = extrairJSON(textoIA);

  return {
    resposta: resultado.resposta,
    emocaoDetectada: resultado.emocaoDetectada,
    nivelAtencao: resultado.nivelAtencao,
    riscoEmocional: resultado.riscoEmocional,
    recomendacao: resultado.recomendacao,
  };
}