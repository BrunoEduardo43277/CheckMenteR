import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { Heart, Send } from "lucide-react";

function Checkin() {
  const [emocao, setEmocao] = useState("");
  const [intensidade, setIntensidade] = useState(0);
  const [contexto, setContexto] = useState("");
  const [mensagem, setMensagem] = useState("");

  const emocoes = [
    { nome: "Muito Feliz", emoji: "😁" },
    { nome: "Feliz", emoji: "😊" },
    { nome: "Neutro", emoji: "😐" },
    { nome: "Triste", emoji: "😔" },
    { nome: "Muito Triste", emoji: "😢" },
    { nome: "Ansioso", emoji: "😰" },
    { nome: "Irritado", emoji: "😤" },
    { nome: "Cansado", emoji: "😴" },
  ];

  function registrarCheckin() {
    alert(
      `Check-in registrado!\n\nEmoção: ${emocao}\nIntensidade: ${intensidade}/5\nContexto: ${
        contexto || "Não informado"
      }\nMensagem: ${mensagem || "Não informado"}`
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-2">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Check-in Emocional
          </h1>

          <p className="text-slate-500 text-base mt-3">
            Como você está se sentindo agora?
          </p>
        </div>

        <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Heart size={24} />
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              Indique sua emoção
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {emocoes.map((item) => (
              <button
                key={item.nome}
                onClick={() => {
                  setEmocao(item.nome);
                  setIntensidade(0);
                  setContexto("");
                  setMensagem("");
                }}
                className={`rounded-[24px] p-6 border transition-all duration-300 hover:shadow-md ${
                  emocao === item.nome
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-100 hover:bg-slate-50"
                }`}
              >
                <div className="text-5xl mb-4">{item.emoji}</div>

                <p className="font-medium text-slate-700 text-base">
                  {item.nome}
                </p>
              </button>
            ))}
          </div>
        </section>

        {emocao && (
          <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Intensidade: {intensidade}/5
            </h2>

            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((numero) => (
                <button
                  key={numero}
                  onClick={() => {
                    setIntensidade(numero);
                    setContexto("");
                    setMensagem("");
                  }}
                  className={`py-4 rounded-2xl font-medium text-base transition-all duration-300 ${
                    intensidade >= numero
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {numero}
                </button>
              ))}
            </div>
          </section>
        )}

        {intensidade > 0 && (
          <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Contexto (opcional)
            </h2>

            <select
              value={contexto}
              onChange={(e) => {
                setContexto(e.target.value);
                setMensagem("");
              }}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-base outline-none focus:border-blue-500 bg-white text-slate-600"
            >
              <option value="">Isso aconteceu?</option>
              <option value="Antes da aula">Antes da aula</option>
              <option value="Durante uma aula">Durante uma aula</option>
              <option value="Depois da aula">Depois da aula</option>
              <option value="No intervalo">No intervalo</option>
              <option value="Em casa">Em casa</option>
              <option value="Com amigos">Com amigos</option>
              <option value="Com professores">Com professores</option>
            </select>
          </section>
        )}

        {intensidade > 0 && (
          <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Quer contar mais? (opcional)
            </h2>

            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Escreva aqui como você está se sentindo..."
              className="w-full min-h-36 rounded-2xl border border-slate-200 px-5 py-4 text-base outline-none focus:border-blue-500 resize-none"
            />
          </section>
        )}

        {intensidade > 0 && (
          <button
            onClick={registrarCheckin}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium text-base flex items-center justify-center gap-3 shadow-lg hover:opacity-95 transition"
          >
            Registrar Check-in
            <Send size={20} />
          </button>
        )}
      </div>
    </AppLayout>
  );
}

export default Checkin;