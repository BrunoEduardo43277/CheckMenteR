import { useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { Loader2, MessageCircle, Send, UserRound } from "lucide-react";
import { db } from "../../services/firebase";
import IconButton from "../../components/ui/IconButton";
import { formatarHora, iniciais } from "./mensagensUtils";

function ChatBox({ usuarioAtual, perfil, conversa, isSupervisor, carregando }) {
  const [mensagens, setMensagens] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const fimRef = useRef(null);

  useEffect(() => {
    if (!conversa?.id) return undefined;

    const consulta = query(
      collection(db, "conversas", conversa.id, "mensagens"),
      orderBy("criadoEm", "asc")
    );

    const parar = onSnapshot(
      consulta,
      (snapshot) => {
        setMensagens(snapshot.docs.map((documento) => ({ id: documento.id, ...documento.data() })));
      },
      (error) => {
        console.error(error);
        setErro("Nao foi possivel carregar as mensagens.");
      }
    );

    return () => parar();
  }, [conversa]);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function enviarMensagem(texto) {
    if (!texto.trim() || !usuarioAtual || !conversa?.id || enviando) return;

    try {
      setEnviando(true);
      setErro("");

      await addDoc(collection(db, "conversas", conversa.id, "mensagens"), {
        autorId: usuarioAtual.uid,
        texto: texto.trim(),
        criadoEm: serverTimestamp(),
        visualizada: false,
      });

      await updateDoc(doc(db, "conversas", conversa.id), {
        ultimaMensagem: texto.trim(),
        ultimoAutorId: usuarioAtual.uid,
        atualizadoEm: serverTimestamp(),
      });
    } catch (error) {
      console.error(error);
      setErro("Nao foi possivel enviar a mensagem.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex h-full min-h-[72vh] items-center justify-center text-slate-500">
        <Loader2 size={22} className="mr-2 animate-spin" />
        Carregando mensagens...
      </div>
    );
  }

  if (!usuarioAtual) {
    return (
      <EstadoCentral
        titulo="Acesso necessario"
        texto="Entre na sua conta para visualizar suas mensagens privadas."
      />
    );
  }

  if (!conversa) {
    return (
      <EstadoCentral
        titulo={isSupervisor ? "Selecione ou crie uma conversa" : "Nenhuma supervisao encontrada"}
        texto={
          isSupervisor
            ? "Use a lista lateral ou o botao + para conversar com um aluno."
            : "Quando uma supervisao estiver vinculada a voce, o chat aparecera aqui."
        }
      />
    );
  }

  const outroNome = isSupervisor
    ? conversa.alunoNome || "Aluno"
    : conversa.supervisorNome || "Supervisao";

  return (
    <section className="flex h-full min-h-[72vh] flex-col bg-[#F8FCFA]">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4">
        <Avatar nome={outroNome} />
        <div>
          <h2 className="font-semibold text-slate-800">{outroNome}</h2>
          <p className="text-sm text-slate-500">
            {isSupervisor ? "Aluno vinculado" : "Supervisao escolar"}
          </p>
        </div>
      </header>

      {erro && (
        <div className="mx-5 mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {erro}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        {mensagens.length === 0 ? (
          <EstadoVazio
            icon={<MessageCircle size={30} />}
            titulo="Conversa iniciada"
            texto="Envie a primeira mensagem para comecar o atendimento."
          />
        ) : (
          <div className="space-y-3">
            {mensagens.map((mensagem) => (
              <MensagemBubble
                key={mensagem.id}
                mensagem={mensagem}
                minha={mensagem.autorId === usuarioAtual.uid}
              />
            ))}
          </div>
        )}
        <div ref={fimRef} />
      </div>

      <InputMensagem onEnviar={enviarMensagem} enviando={enviando} perfil={perfil} />
    </section>
  );
}

function MensagemBubble({ mensagem, minha }) {
  return (
    <div className={`flex ${minha ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-3xl px-5 py-3 shadow-sm md:max-w-[68%] ${
          minha
            ? "rounded-br-md bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
          {mensagem.texto}
        </p>
        <p className={`mt-2 text-right text-[11px] ${minha ? "text-white/75" : "text-slate-400"}`}>
          {formatarHora(mensagem.criadoEm)}
        </p>
      </div>
    </div>
  );
}

function InputMensagem({ onEnviar, enviando }) {
  const [texto, setTexto] = useState("");

  function enviar(event) {
    event.preventDefault();
    const conteudo = texto.trim();
    if (!conteudo || enviando) return;

    onEnviar(conteudo);
    setTexto("");
  }

  return (
    <form onSubmit={enviar} className="border-t border-slate-200 bg-white p-4">
      <div className="flex items-end gap-3 rounded-[26px] border border-slate-200 bg-slate-50 p-2 focus-within:border-[#38B487] focus-within:bg-white">
        <textarea
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              enviar(event);
            }
          }}
          placeholder="Digite sua mensagem..."
          rows={1}
          className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-4 py-3 text-sm text-slate-700 outline-none"
        />
        <IconButton
          type="submit"
          label="Enviar mensagem"
          disabled={!texto.trim() || enviando}
        >
          {enviando ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </IconButton>
      </div>
    </form>
  );
}

function Avatar({ nome }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5ED6A7] to-[#6D5DF6] font-bold text-white shadow-sm">
      {iniciais(nome)}
    </div>
  );
}

function EstadoVazio({ icon, titulo, texto }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAFBF3] text-[#38B487]">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800">{titulo}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{texto}</p>
    </div>
  );
}

function EstadoCentral({ titulo, texto }) {
  return (
    <div className="flex h-full min-h-[72vh] items-center justify-center bg-[#F8FCFA] p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#EAFBF3] text-[#38B487]">
          <UserRound size={34} />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">{titulo}</h2>
        <p className="mt-3 text-slate-500">{texto}</p>
      </div>
    </div>
  );
}

export default ChatBox;


