import { construirPrompt } from "./promptBase";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-4.1-mini";
console.log("API KEY:", OPENAI_API_KEY);

const respostaPadrao = {
  resposta: "Estou aqui com você. Pode me contar um pouco mais?",
  emocaoDetectada: "nao identificada",
  emocaoSecundaria: "nao identificada",
  nivelIntensidade: 0,
  nivelAtencao: "baixo",
  riscoEmocional: "baixo",
  recomendacao: "Continuar conversa de forma acolhedora.",
  continuarConversa: true,
};

const respostaSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resposta: { type: "string" },
    emocaoDetectada: { type: "string" },
    emocaoSecundaria: { type: "string" },
    nivelIntensidade: { type: "number", minimum: 0, maximum: 10 },
    nivelAtencao: { type: "string", enum: ["baixo", "medio", "alto"] },
    riscoEmocional: { type: "string", enum: ["baixo", "medio", "alto"] },
    recomendacao: { type: "string" },
    continuarConversa: { type: "boolean" },
  },
  required: [
    "resposta",
    "emocaoDetectada",
    "emocaoSecundaria",
    "nivelIntensidade",
    "nivelAtencao",
    "riscoEmocional",
    "recomendacao",
    "continuarConversa",
  ],
};

function extrairJSON(texto = "") {
  const limpo = texto
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(limpo);
  } catch {
    return {
      ...respostaPadrao,
      resposta: limpo || respostaPadrao.resposta,
    };
  }
}

function normalizarCampo(valor, fallback) {
  return typeof valor === "string" && valor.trim() ? valor.trim() : fallback;
}

function normalizarNivel(valor, fallback) {
  const texto = normalizarCampo(valor, fallback).toLowerCase();
  return ["baixo", "medio", "alto"].includes(texto) ? texto : fallback;
}

function normalizarResposta(resultado = {}) {
  return {
    resposta: normalizarCampo(resultado.resposta, respostaPadrao.resposta),
    emocaoDetectada: normalizarCampo(
      resultado.emocaoDetectada,
      respostaPadrao.emocaoDetectada
    ),
    emocaoSecundaria: normalizarCampo(
      resultado.emocaoSecundaria,
      respostaPadrao.emocaoSecundaria
    ),
    nivelIntensidade: Math.min(
      10,
      Math.max(0, Number(resultado.nivelIntensidade ?? 0))
    ),
    nivelAtencao: normalizarNivel(
      resultado.nivelAtencao,
      respostaPadrao.nivelAtencao
    ),
    riscoEmocional: normalizarNivel(
      resultado.riscoEmocional,
      respostaPadrao.riscoEmocional
    ),
    recomendacao: normalizarCampo(
      resultado.recomendacao,
      respostaPadrao.recomendacao
    ),
    continuarConversa: Boolean(resultado.continuarConversa ?? true),
  };
}

function montarMensagensOpenAI(historico = []) {
  return historico
    .slice(-16)
    .filter((msg) => msg?.texto)
    .map((msg) => ({
      role: msg.autor === "usuario" ? "user" : "assistant",
      content: msg.texto,
    }));
}

function pegarTextoOpenAI(dados) {
  if (typeof dados.output_text === "string" && dados.output_text.trim()) {
    return dados.output_text;
  }

  const textos = [];

  dados.output?.forEach((item) => {
    item.content?.forEach((content) => {
      if (typeof content.text === "string") textos.push(content.text);
      if (typeof content.output_text === "string") textos.push(content.output_text);
    });
  });

  return textos.join("\n").trim();
}

async function lerErroOpenAI(resposta) {
  try {
    const erro = await resposta.json();
    return erro.error?.message || JSON.stringify(erro);
  } catch {
    return "Erro desconhecido ao chamar a OpenAI.";
  }
}

export async function gerarRespostaIA(
  historico,
  nomeAluno = "Aluno",
  ultimoCheckin = null
) {
  if (!OPENAI_API_KEY) {
    throw new Error("VITE_OPENAI_API_KEY não foi configurada no arquivo .env.");
  }

  const resposta = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: construirPrompt(nomeAluno, ultimoCheckin),
      input: montarMensagensOpenAI(historico),
      text: {
        format: {
          type: "json_schema",
          name: "mentinha_response",
          strict: true,
          schema: respostaSchema,
        },
      },
      max_output_tokens: 700,
    }),
  });

  if (!resposta.ok) {
    const detalhe = await lerErroOpenAI(resposta);
    throw new Error(`OpenAI API ${resposta.status}: ${detalhe}`);
  }

  const dados = await resposta.json();
  const texto = pegarTextoOpenAI(dados);

  if (!texto) {
    return respostaPadrao;
  }

  return normalizarResposta(extrairJSON(texto));
}