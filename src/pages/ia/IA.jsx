import { useEffect, useRef, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { Sparkles, Send } from "lucide-react";
import { gerarRespostaIA } from "../../services/mentinha";
import { calcularNivelAlerta } from "../../services/calcularNivelAlerta";
import { auth, db } from "../../services/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  limit,
  getDocs,
} from "firebase/firestore";

const mensagemInicialPadrao = {
  autor: "ia",
  texto: "Oi! Sou a Mentinha. Me conta com calma: como voce esta se sentindo hoje?",
};

function IA() {
  const [mensagem, setMensagem] = useState("");
  const [historicoConversas, setHistoricoConversas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [nomeAluno, setNomeAluno] = useState("Aluno");
  const [ultimoCheckin, setUltimoCheckin] = useState(null);
  const [checkinsRecentes, setCheckinsRecentes] = useState([]);
  const [contextoOculto, setContextoOculto] = useState([]);
  const [mensagens, setMensagens] = useState([mensagemInicialPadrao]);
  const [erro, setErro] = useState("");
  const fimDaConversaRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      setUsuarioAtual(user);
      setCarregandoInicial(true);
      setErro("");

      if (!user) {
        setMensagens([mensagemInicialPadrao]);
        setContextoOculto([]);
        setHistoricoConversas([]);
        setCarregandoInicial(false);
        return;
      }

      try {
        const nome = await carregarNomeAluno(user.uid);
        setNomeAluno(nome);

        const [checkinRecente, sessao] = await Promise.all([
          carregarCheckinsRecentes(user.uid),
          carregarSessaoIA(user.uid),
        ]);

        setUltimoCheckin(checkinRecente[0] || null);
        setCheckinsRecentes(checkinRecente);

        if (sessao.length > 0) {
          setContextoOculto(sessao);
          setMensagens(sessao.slice(-12));
        } else {
          const saudacao = {
            autor: "ia",
            texto: `Oi, ${nome}! Sou a Mentinha. Me conta com calma: como voce esta se sentindo hoje?`,
          };
          setContextoOculto([saudacao]);
          setMensagens([saudacao]);
        }
      } catch (error) {
        console.error(error);
        setErro("Nao consegui carregar seu historico agora, mas voce pode continuar conversando.");
        setMensagens([mensagemInicialPadrao]);
      } finally {
        setCarregandoInicial(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!usuarioAtual) return undefined;

    const pararDeOuvir = onSnapshot(
      query(
        collection(db, "conversasIA"),
        where("userId", "==", usuarioAtual.uid),
        orderBy("criadoEm", "desc")
      ),
      (snapshot) => {
        setHistoricoConversas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        console.error(error);
        setErro("Nao consegui carregar o historico de conversas salvas.");
      }
    );

    return () => pararDeOuvir();
  }, [usuarioAtual]);

  useEffect(() => {
    fimDaConversaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  async function enviarMensagem(e) {
    e.preventDefault();

    const texto = mensagem.trim();
    if (!texto || carregando) return;

    if (!usuarioAtual) {
      setErro("Voce precisa estar logado para conversar com a Mentinha.");
      return;
    }

    const novaMensagem = { autor: "usuario", texto };
    const mensagensTela = [...mensagens, novaMensagem];

    setMensagens(mensagensTela);
    setMensagem("");
    setCarregando(true);
    setErro("");

    try {
      const historicoCompleto = [...contextoOculto, novaMensagem].slice(-20);
      const respostaIA = await gerarRespostaIA(historicoCompleto, nomeAluno, ultimoCheckin);
      const respostaDaIA = {
        autor: "ia",
        texto: respostaIA.resposta || "Estou aqui com voce. Pode me contar um pouco mais?",
      };
      const novoHistorico = [...historicoCompleto, respostaDaIA].slice(-24);

      setMensagens((old) => [...old, respostaDaIA]);
      setContextoOculto(novoHistorico);

      await salvarConversa(usuarioAtual, novaMensagem, respostaIA, novoHistorico, nomeAluno, checkinsRecentes);
    } catch (error) {
      console.error(error);
      setErro(error.message || "A OpenAI API nao retornou uma resposta.");
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
            <p className="text-slate-500 text-base">Converse com a Mentinha</p>
          </div>
        </div>

        {erro && (
          <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
            {erro}
          </div>
        )}

        <div className="grid xl:grid-cols-[1fr_320px] gap-6 flex-1">
          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden min-h-[620px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
              {carregandoInicial ? (
                <div className="bg-white border border-slate-200 px-6 py-4 rounded-3xl text-slate-500 text-base w-fit">
                  Preparando a conversa...
                </div>
              ) : (
                mensagens.map((msg, index) => (
                  <div
                    key={`${msg.autor}-${index}`}
                    className={"flex " + (msg.autor === "usuario" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={
                        "max-w-3xl px-6 py-4 rounded-3xl shadow-sm text-base leading-relaxed whitespace-pre-wrap " +
                        (msg.autor === "usuario"
                          ? "bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white rounded-br-md"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-md")
                      }
                    >
                      {msg.texto}
                    </div>
                  </div>
                ))
              )}

              {carregando && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-6 py-4 rounded-3xl text-slate-500 text-base">
                    Mentinha esta digitando...
                  </div>
                </div>
              )}
              <div ref={fimDaConversaRef} />
            </div>

            <form onSubmit={enviarMensagem} className="p-5 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Escreva como voce se sente..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  disabled={carregandoInicial || carregando}
                  className="flex-1 h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={carregandoInicial || carregando || !mensagem.trim()}
                  className="h-14 w-14 rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white flex items-center justify-center shadow-lg disabled:opacity-60"
                >
                  <Send size={22} />
                </button>
              </div>
            </form>
          </section>

          <aside className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">Historico</h2>
              <p className="text-sm text-slate-500 mt-1">Conversas recentes</p>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[540px] pr-1">
              {historicoConversas.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma conversa salva ainda.</p>
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

async function carregarNomeAluno(uid) {
  const userSnap = await getDoc(doc(db, "usuarios", uid));
  const nomeCompleto = userSnap.exists() ? userSnap.data().nome : "";
  return nomeCompleto ? nomeCompleto.split(" ")[0] : "Aluno";
}

async function carregarCheckinsRecentes(uid) {
  const checkinsSnap = await getDocs(
    query(
      collection(db, "checkins"),
      where("userId", "==", uid),
      orderBy("criadoEm", "desc"),
      limit(3)
    )
  );

  return checkinsSnap.docs.map((documento) => documento.data());
}

async function carregarSessaoIA(uid) {
  const sessaoSnap = await getDoc(doc(db, "sessoesIA", uid));
  const historico = sessaoSnap.exists() ? sessaoSnap.data().historico : [];

  if (!Array.isArray(historico)) return [];
  return historico.filter((msg) => msg?.autor && msg?.texto);
}

async function salvarConversa(user, novaMensagem, respostaIA, novoHistorico, nomeAluno, checkinsRecentes) {
  await addDoc(collection(db, "conversasIA"), {
    userId: user.uid,
    mensagemUsuario: novaMensagem.texto,
    respostaIA: respostaIA.resposta,
    titulo: gerarTitulo(novaMensagem.texto),
    resumo: (respostaIA.resposta || "").slice(0, 120),
    emocaoDetectada: respostaIA.emocaoDetectada || "Nao identificada",
    nivelAtencao: respostaIA.nivelAtencao || "baixo",
    riscoEmocional: respostaIA.riscoEmocional || "baixo",
    criadoEm: serverTimestamp(),
  });

  await setDoc(doc(db, "sessoesIA", user.uid), {
    historico: novoHistorico,
    ultimaInteracao: serverTimestamp(),
    userId: user.uid,
  });

  const alerta = calcularNivelAlerta({
    intensidade: respostaIA.nivelIntensidade,
    emocao: respostaIA.emocaoDetectada,
    checkinsRecentes,
    interacoesRecentes: novoHistorico.filter((msg) => msg.autor === "usuario").length,
    riscoIA: respostaIA.riscoEmocional,
  });

  if (alerta.nivel !== "baixo") {
    await addDoc(collection(db, "alertas"), {
      aluno: nomeAluno || "Aluno",
      iniciais: nomeAluno ? nomeAluno.substring(0, 2).toUpperCase() : "AL",
      turma: "Nao identificada",
      descricao:
        "Alerta emocional " +
        alerta.nivel.toUpperCase() +
        ". Motivos: " +
        alerta.motivos.join(", "),
      nivel: alerta.nivel === "alto" ? "Alto" : "Medio",
      pontos: alerta.pontos,
      motivos: alerta.motivos,
      status: "Pendente",
      criadoEm: serverTimestamp(),
    });
  }
}

function ConversaItem({ titulo, resumo, horario, ativo }) {
  return (
    <button
      type="button"
      className={
        "w-full text-left p-4 rounded-2xl border transition-all duration-300 " +
        (ativo
          ? "bg-violet-50 border-violet-200"
          : "bg-white border-slate-100 hover:bg-slate-50")
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{titulo}</h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{resumo}</p>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">{horario}</span>
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
  const data = typeof dataFirebase.toDate === "function" ? dataFirebase.toDate() : new Date(dataFirebase);
  return Number.isNaN(data.getTime()) ? "Agora" : data.toLocaleDateString("pt-BR");
}

export default IA;


