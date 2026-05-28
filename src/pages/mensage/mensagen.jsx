import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Plus } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { PrimaryButton } from "../../components/ui/Button";
import { auth, db } from "../../services/firebase";
import ChatBox from "./ChatBox";
import ListaAlunosModal from "./ListaAlunosModal";
import ListaConversas from "./ListaConversas";
import {
  buscarPerfil,
  buscarUsuariosDaEscola,
  criarOuAbrirConversa,
  nomeUsuario,
  normalizarTipo,
} from "./mensagensUtils";

function Mensagens() {
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [conversas, setConversas] = useState([]);
  const [conversaAtiva, setConversaAtiva] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const tipoUsuario = normalizarTipo(perfil);
  const isSupervisor = tipoUsuario === "supervisor";

  useEffect(() => {
    const pararAuth = onAuthStateChanged(auth, async (user) => {
      setCarregando(true);
      setErro("");
      setUsuarioAtual(user);
      setConversaAtiva(null);

      if (!user) {
        setPerfil(null);
        setConversas([]);
        setAlunos([]);
        setCarregando(false);
        return;
      }

      try {
        const dadosPerfil = await buscarPerfil(user.uid, user);
        setPerfil(dadosPerfil);
      } catch (error) {
        console.error(error);
        setErro("Nao foi possivel carregar seu perfil.");
      } finally {
        setCarregando(false);
      }
    });

    return () => pararAuth();
  }, []);

  useEffect(() => {
    if (!usuarioAtual || !perfil) return undefined;

    const consulta = query(
      collection(db, "conversas"),
      where("participantes", "array-contains", usuarioAtual.uid)
    );

    const parar = onSnapshot(
      consulta,
      async (snapshot) => {
        const lista = snapshot.docs
          .map((documento) => ({ id: documento.id, ...documento.data() }))
          .sort((a, b) => {
            const dataA = a.atualizadoEm?.toMillis?.() || 0;
            const dataB = b.atualizadoEm?.toMillis?.() || 0;
            return dataB - dataA;
          });

        setConversas(lista);

        if (normalizarTipo(perfil) === "aluno") {
          if (lista.length > 0) {
            setConversaAtiva((atual) => atual || lista[0]);
            return;
          }

          const usuarios = await buscarUsuariosDaEscola(perfil.escolaId);
          const supervisor = usuarios.find((item) => normalizarTipo(item) === "supervisor");

          if (supervisor) {
            const conversa = await criarOuAbrirConversa({
              aluno: perfil,
              supervisor,
              escolaId: perfil.escolaId,
            });
            setConversaAtiva(conversa);
          } else {
            setErro("Nenhum supervisor vinculado a sua escola foi encontrado.");
          }
        } else if (!conversaAtiva && lista.length > 0) {
          setConversaAtiva(lista[0]);
        }
      },
      (error) => {
        console.error(error);
        setErro("Nao foi possivel carregar as conversas.");
      }
    );

    return () => parar();
  }, [usuarioAtual, perfil, conversaAtiva]);

  useEffect(() => {
    if (!perfil || !isSupervisor || !modalAberto) return undefined;

    let cancelado = false;

    async function carregarAlunos() {
      try {
        const usuarios = await buscarUsuariosDaEscola(perfil.escolaId);
        const somenteAlunos = usuarios
          .filter((usuario) => normalizarTipo(usuario) === "aluno")
          .sort((a, b) => nomeUsuario(a).localeCompare(nomeUsuario(b)));

        if (!cancelado) setAlunos(somenteAlunos);
      } catch (error) {
        console.error(error);
        if (!cancelado) setErro("Nao foi possivel carregar a lista de alunos.");
      }
    }

    carregarAlunos();

    return () => {
      cancelado = true;
    };
  }, [perfil, isSupervisor, modalAberto]);

  async function selecionarAluno(aluno) {
    if (!perfil) return;

    try {
      const conversa = await criarOuAbrirConversa({
        aluno,
        supervisor: perfil,
        escolaId: perfil.escolaId || aluno.escolaId,
      });

      setConversaAtiva(conversa);
      setModalAberto(false);
    } catch (error) {
      console.error(error);
      setErro("Nao foi possivel abrir a conversa com este aluno.");
    }
  }

  return (
    <AppLayout>
      <MensagensPage
        usuarioAtual={usuarioAtual}
        perfil={perfil}
        conversas={conversas}
        conversaAtiva={conversaAtiva}
        alunos={alunos}
        isSupervisor={isSupervisor}
        modalAberto={modalAberto}
        carregando={carregando}
        erro={erro}
        onSelecionarConversa={setConversaAtiva}
        onAbrirModal={() => setModalAberto(true)}
        onFecharModal={() => setModalAberto(false)}
        onSelecionarAluno={selecionarAluno}
      />
    </AppLayout>
  );
}

function MensagensPage({
  usuarioAtual,
  perfil,
  conversas,
  conversaAtiva,
  alunos,
  isSupervisor,
  modalAberto,
  carregando,
  erro,
  onSelecionarConversa,
  onAbrirModal,
  onFecharModal,
  onSelecionarAluno,
}) {
  return (
    <div className="mx-auto max-w-7xl px-2">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Mensagens
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Conversas privadas entre aluno e supervisao escolar.
          </p>
        </div>

        {isSupervisor && <BotaoNovaConversa onClick={onAbrirModal} />}
      </div>

      {erro && (
        <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
          {erro}
        </div>
      )}

      <div className="grid min-h-[72vh] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[360px_1fr]">
        {isSupervisor && (
          <ListaConversas
            conversas={conversas}
            conversaAtiva={conversaAtiva}
            usuarioAtual={usuarioAtual}
            carregando={carregando}
            onSelecionarConversa={onSelecionarConversa}
          />
        )}

        <div className={isSupervisor ? "min-w-0" : "lg:col-span-2"}>
          <ChatBox
            usuarioAtual={usuarioAtual}
            perfil={perfil}
            conversa={conversaAtiva}
            isSupervisor={isSupervisor}
            carregando={carregando}
          />
        </div>
      </div>

      {modalAberto && (
        <ListaAlunosModal
          alunos={alunos}
          conversas={conversas}
          onFechar={onFecharModal}
          onSelecionarAluno={onSelecionarAluno}
        />
      )}
    </div>
  );
}

function BotaoNovaConversa({ onClick }) {
  return (
    <PrimaryButton onClick={onClick}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
        <Plus size={20} />
      </span>
      Nova conversa
    </PrimaryButton>
  );
}

export default Mensagens;


