const emocoesNegativas = ["triste", "ansioso", "desmotivado"];

function textoNormalizado(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ehEmocaoNegativa(emocao) {
  const texto = textoNormalizado(emocao);
  return emocoesNegativas.some((item) => texto.includes(item));
}

export function calcularNivelAlerta(dados = {}) {
  let pontos = 0;
  const motivos = [];

  if (Number(dados.intensidade || 0) >= 8) {
    pontos += 3;
    motivos.push("Intensidade emocional alta");
  }

  if (ehEmocaoNegativa(dados.emocao)) {
    pontos += 2;
    motivos.push("Emocao negativa registrada");
  }

  const negativosSeguidos = (dados.checkinsRecentes || [])
    .slice(0, 3)
    .filter((checkin) => ehEmocaoNegativa(checkin.emocao)).length;

  if (negativosSeguidos >= 3) {
    pontos += 4;
    motivos.push("Tres check-ins negativos seguidos");
  }

  if (Number(dados.interacoesRecentes || 0) <= 1) {
    pontos += 2;
    motivos.push("Pouca interacao recente");
  }

  if (textoNormalizado(dados.riscoIA) === "alto") {
    pontos += 5;
    motivos.push("Risco alto indicado pela IA");
  }

  const nivel = pontos >= 10 ? "alto" : pontos >= 5 ? "medio" : "baixo";

  return { nivel, pontos, motivos };
}
