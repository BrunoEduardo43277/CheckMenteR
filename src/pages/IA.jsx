import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { Sparkles, Send, Brain, AlertCircle, Lightbulb } from "lucide-react";
import { gerarRespostaIA } from "../services/mentinha";

import { auth, db } from "../services/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

function IA() {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([
    {
      autor: "ia",
      texto:
        "Olá! 💙 Sou a Mentinha, assistente emocional do CheckMente. Como você está se sentindo hoje?",
    },
  ]);

  const [analise, setAnalise] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function enviarMensagem(e) {
    e.preventDefault();

    if (!mensagem.trim()) return;

    const novaMensagem = {
      autor: "usuario",
      texto: mensagem,
    };

    const historico = [...mensagens, novaMensagem];

    setMensagens(historico);
    setMensagem("");
    setCarregando(true);

    try {
      const respostaIA = await gerarRespostaIA(historico);

      setMensagens((old) => [
        ...old,
        {
          autor: "ia",
          texto: respostaIA.resposta,
        },
      ]);

      const novaAnalise = {
        emocao: respostaIA.emocaoDetectada || "Em análise",
        nivel: respostaIA.nivelAtencao || "Em avaliação",
        recomendacao:
          respostaIA.recomendacao || "Continuar acompanhamento emocional.",
      };

      setAnalise(novaAnalise);

      await addDoc(collection(db, "conversasIA"), {
        userId: auth.currentUser?.uid || null,
        mensagemUsuario: novaMensagem.texto,
        respostaIA: respostaIA.resposta,
        emocaoDetectada: novaAnalise.emocao,
        nivelAtencao: novaAnalise.nivel,
        recomendacao: novaAnalise.recomendacao,
        criadoEm: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);

      setMensagens((old) => [
        ...old,
        {
          autor: "ia",
          texto:
            "Desculpe, não consegui responder agora. Tente novamente em alguns segundos.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto min-h-[85vh] flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">
            <Sparkles size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
              IA de Acolhimento
            </h1>

            <p className="text-slate-500 text-base">
              Converse com a Mentinha 💙
            </p>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_320px] gap-6 flex-1">
          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden min-h-[620px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
              {mensagens.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.autor === "usuario" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl px-6 py-4 rounded-3xl shadow-sm text-base leading-relaxed ${
                      msg.autor === "usuario"
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-br-md"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                    }`}
                  >
                    {msg.texto}
                  </div>
                </div>
              ))}

              {carregando && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-6 py-4 rounded-3xl text-slate-500 text-base">
                    Mentinha está digitando...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={enviarMensagem}
              className="p-5 border-t border-slate-200 bg-white"
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Escreva como você se sente..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="flex-1 h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={carregando}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-lg disabled:opacity-60"
                >
                  <Send size={22} />
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <AnaliseCard
              icon={<Brain size={24} />}
              title="Emoção detectada"
              value={analise?.emocao || "Aguardando conversa"}
              color="text-blue-600"
            />

            <AnaliseCard
              icon={<AlertCircle size={24} />}
              title="Nível de atenção"
              value={analise?.nivel || "Não avaliado"}
              color="text-violet-600"
            />

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Lightbulb size={24} />
                </div>

                <h3 className="font-semibold text-base text-slate-800">
                  Recomendação interna
                </h3>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed">
                {analise?.recomendacao ||
                  "A recomendação será gerada após a resposta do estudante."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

function AnaliseCard({ icon, title, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        {icon}
      </div>

      <p className="text-slate-500 text-sm mb-2">
        {title}
      </p>

      <h2 className={`text-xl font-semibold tracking-tight ${color}`}>
        {value}
      </h2>
    </div>
  );
}

export default IA;