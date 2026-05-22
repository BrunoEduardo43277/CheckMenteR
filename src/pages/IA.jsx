import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { Sparkles, Send } from "lucide-react";
import { gerarRespostaIA } from "../services/mentinha";

import { auth, db } from "../services/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function IA() {
  const [mensagem, setMensagem] = useState("");
  const [historicoConversas, setHistoricoConversas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [mensagens, setMensagens] = useState([
    {
      autor: "ia",
      texto:
        "Olá! Sou a Mentinha, assistente emocional do CheckMente. Como você está se sentindo hoje?",
    },
  ]);

  useEffect(() => {
    const usuario = auth.currentUser;

    if (!usuario) return;

    const consulta = query(
      collection(db, "conversasIA"),
      where("userId", "==", usuario.uid),
      orderBy("criadoEm", "desc")
    );

    const pararDeOuvir = onSnapshot(consulta, (snapshot) => {
      const conversas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistoricoConversas(conversas);
    });

    return () => pararDeOuvir();
  }, []);

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

      const respostaDaIA = {
        autor: "ia",
        texto: respostaIA.resposta,
      };

      setMensagens((old) => [...old, respostaDaIA]);

      await addDoc(collection(db, "conversasIA"), {
        userId: auth.currentUser?.uid || null,
        mensagemUsuario: novaMensagem.texto,
        respostaIA: respostaIA.resposta,
        titulo: gerarTitulo(novaMensagem.texto),
        resumo: respostaIA.resposta.slice(0, 80),
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
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#5ED6A7] to-[#38B487] flex items-center justify-center text-white shadow-md">
            <Sparkles size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
              IA de Acolhimento
            </h1>

            <p className="text-slate-500 text-base">
              Converse com a Mentinha 
            </p>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1fr_320px] gap-6 flex-1">
          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden min-h-[620px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
              {mensagens.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.autor === "usuario" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-3xl px-6 py-4 rounded-3xl shadow-sm text-base leading-relaxed ${msg.autor === "usuario"
                      ? "bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white rounded-br-md" : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
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
                  className="h-14 w-14 rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white flex items-center justify-center shadow-lg disabled:opacity-60"
                >
                  <Send size={22} />
                </button>
              </div>
            </form>
          </section>

          <aside className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  Histórico
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Conversas recentes
                </p>
              </div>


            </div>

            <div className="space-y-3 overflow-y-auto max-h-[540px] pr-1">
              {historicoConversas.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhuma conversa salva ainda.
                </p>
              ) : (
                historicoConversas.map((conversa, index) => (
                  <ConversaItem
                    key={conversa.id}
                    titulo={conversa.titulo || "Conversa com a Mentinha"}
                    resumo={conversa.mensagemUsuario}
                    horario={formatarData(conversa.criadoEm)}
                    ativo={index === 0}
                  />
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

function ConversaItem({ titulo, resumo, horario, ativo }) {
  return (
    <button
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${ativo
        ? "bg-violet-50 border-violet-200"
        : "bg-white border-slate-100 hover:bg-slate-50"
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{titulo}</h3>

          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
            {resumo}
          </p>
        </div>

        <span className="text-xs text-slate-400 whitespace-nowrap">
          {horario}
        </span>
      </div>
    </button>
  );
}

function gerarTitulo(texto) {
  if (texto.length <= 28) return texto;
  return texto.slice(0, 28) + "...";
}

function formatarData(dataFirebase) {
  if (!dataFirebase) return "Agora";

  const data = dataFirebase.toDate();
  return data.toLocaleDateString("pt-BR");
}

export default IA;