import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../../layouts/AppLayout";
import { auth, db } from "../../../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Play,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

const trilhaAnsiedade = {
  id: "ansiedade-escolar",
  titulo: "Ansiedade escolar",
  descricao:
    "Aprenda estratégias simples para lidar com ansiedade antes de provas, apresentações e momentos de pressão.",
  tempo: "1h 30min",
  modulos: [
    {
      numero: 1,
      titulo: "Entendendo a ansiedade",
      tempo: "8 min",
      conteudo:
        "A ansiedade é uma reação do corpo diante de situações que parecem difíceis ou importantes. Na escola, ela pode aparecer antes de provas, apresentações ou cobranças. O primeiro passo é perceber o que você sente sem se julgar.",
      tarefa:
        "Escreva no seu diário uma situação escolar que costuma te deixar ansioso.",
    },
    {
      numero: 2,
      titulo: "Respiração para momentos de pressão",
      tempo: "6 min",
      conteudo:
        "Respirar com calma ajuda o corpo a sair do estado de alerta. Inspire lentamente, segure por alguns segundos e solte o ar devagar.",
      tarefa:
        "Pratique uma respiração lenta por 1 minuto antes de continuar.",
    },
    {
      numero: 3,
      titulo: "Organizando pensamentos",
      tempo: "10 min",
      conteudo:
        "Quando estamos ansiosos, os pensamentos podem ficar acelerados. Separar o que é fato do que é medo ajuda a diminuir a confusão mental.",
      tarefa:
        "Liste um pensamento que te preocupa e escreva uma resposta mais realista para ele.",
    },
    {
      numero: 4,
      titulo: "Preparação antes de provas",
      tempo: "12 min",
      conteudo:
        "Uma rotina simples antes das provas pode reduzir a ansiedade. Dormir bem, revisar com antecedência e evitar estudar tudo de última hora ajuda seu corpo a se sentir mais seguro.",
      tarefa:
        "Crie uma pequena rotina de preparação para sua próxima prova.",
    },
    {
      numero: 5,
      titulo: "Pedindo ajuda",
      tempo: "8 min",
      conteudo:
        "Pedir ajuda não é fraqueza. Conversar com uma pessoa de confiança pode ajudar você a não carregar tudo sozinho.",
      tarefa:
        "Pense em uma pessoa de confiança com quem você poderia conversar.",
    },
    {
      numero: 6,
      titulo: "Pequenos passos",
      tempo: "7 min",
      conteudo:
        "Dividir tarefas grandes em pequenos passos torna tudo mais possível. Você não precisa resolver tudo de uma vez.",
      tarefa:
        "Escolha uma tarefa escolar e divida em três passos pequenos.",
    },
    {
      numero: 7,
      titulo: "Plano pessoal de calma",
      tempo: "15 min",
      conteudo:
        "Um plano pessoal de calma é uma lista de ações que ajudam você quando a ansiedade aparece.",
      tarefa:
        "Monte seu plano pessoal com três atitudes que ajudam você a se acalmar.",
    },
  ],
};

function TrilhaAnsiedadeEscolar() {
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  const [modulosConcluidos, setModulosConcluidos] = useState([]);
  const [moduloAberto, setModuloAberto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const pararAuth = onAuthStateChanged(auth, async (usuario) => {
      setUsuarioAtual(usuario);

      if (!usuario) {
        setCarregando(false);
        return;
      }

      const idDocumento = `${usuario.uid}_${trilhaAnsiedade.id}`;
      const referencia = doc(db, "trilhasUsuarios", idDocumento);
      const documento = await getDoc(referencia);

      if (documento.exists()) {
        setModulosConcluidos(documento.data().modulosConcluidos || []);
      }

      setCarregando(false);
    });

    return () => pararAuth();
  }, []);

  const progresso = useMemo(() => {
    return Math.round(
      (modulosConcluidos.length / trilhaAnsiedade.modulos.length) * 100
    );
  }, [modulosConcluidos]);

  const proximoModulo =
    trilhaAnsiedade.modulos.find(
      (modulo) => !modulosConcluidos.includes(modulo.numero)
    ) || trilhaAnsiedade.modulos[trilhaAnsiedade.modulos.length - 1];

  async function salvarProgresso(novosModulos) {
    if (!usuarioAtual) {
      alert("Você precisa estar logado.");
      return;
    }

    const idDocumento = `${usuarioAtual.uid}_${trilhaAnsiedade.id}`;

    await setDoc(
      doc(db, "trilhasUsuarios", idDocumento),
      {
        userId: usuarioAtual.uid,
        trilhaId: trilhaAnsiedade.id,
        titulo: trilhaAnsiedade.titulo,
        modulosConcluidos: novosModulos,
        progresso: Math.round(
          (novosModulos.length / trilhaAnsiedade.modulos.length) * 100
        ),
        atualizadoEm: serverTimestamp(),
      },
      { merge: true }
    );

    setModulosConcluidos(novosModulos);
  }

  async function concluirModulo(numero) {
    if (modulosConcluidos.includes(numero)) {
      setModuloAberto(null);
      return;
    }

    const novosModulos = [...modulosConcluidos, numero].sort((a, b) => a - b);

    await salvarProgresso(novosModulos);
    setModuloAberto(null);
  }

  if (carregando) {
    return (
      <AppLayout>
        <main className="min-h-screen bg-[#F8FCFA] flex items-center justify-center">
          <p className="text-slate-500">Carregando trilha...</p>
        </main>
      </AppLayout>
    );
  }

  if (moduloAberto) {
    return (
      <ModuloAberto
        modulo={moduloAberto}
        concluido={modulosConcluidos.includes(moduloAberto.numero)}
        onVoltar={() => setModuloAberto(null)}
        onConcluir={() => concluirModulo(moduloAberto.numero)}
      />
    );
  }

  return (
    <AppLayout>
      <main className="min-h-screen bg-[#F8FCFA] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/trilhas"
            className="inline-flex items-center gap-2 mb-8 px-5 py-3 rounded-2xl bg-white border border-[#E8F3ED] text-slate-600 font-medium"
          >
            <ArrowLeft size={20} />
            Voltar
          </Link>

          <section className="bg-white rounded-[36px] border border-[#E8F3ED] p-8 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <span className="inline-flex items-center gap-2 text-[#27C4BD] bg-[#E5F7EE] px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  <Star size={16} fill="currentColor" />
                  Trilha em andamento
                </span>

                <h1 className="text-4xl font-bold text-slate-900">
                  {trilhaAnsiedade.titulo}
                </h1>

                <p className="text-slate-500 text-lg mt-4 max-w-2xl leading-relaxed">
                  {trilhaAnsiedade.descricao}
                </p>

                <div className="flex flex-wrap gap-5 mt-6 text-slate-500">
                  <span className="flex items-center gap-2">
                    <Brain size={18} />
                    {trilhaAnsiedade.modulos.length} módulos
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    {trilhaAnsiedade.tempo}
                  </span>
                </div>

                <button
                  onClick={() => setModuloAberto(proximoModulo)}
                  className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#27C4BD] to-[#38B487] text-white font-semibold shadow-lg flex items-center gap-2"
                >
                  {progresso === 0 ? "Iniciar trilha" : "Continuar trilha"}
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="bg-[#F8FCFA] rounded-[30px] border border-[#E8F3ED] p-7 w-full lg:w-80">
                <p className="text-slate-600 font-semibold mb-5">
                  Seu progresso
                </p>

                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#27C4BD] rounded-full"
                    style={{ width: `${progresso}%` }}
                  />
                </div>

                <p className="text-slate-500 mt-4">
                  {modulosConcluidos.length} de{" "}
                  {trilhaAnsiedade.modulos.length} módulos concluídos
                </p>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-5">
            {trilhaAnsiedade.modulos.map((modulo) => (
              <ModuloCard
                key={modulo.numero}
                modulo={modulo}
                concluido={modulosConcluidos.includes(modulo.numero)}
                bloqueado={
                  modulo.numero !== 1 &&
                  !modulosConcluidos.includes(modulo.numero - 1)
                }
                onAbrir={() => setModuloAberto(modulo)}
              />
            ))}
          </section>
        </div>
      </main>
    </AppLayout>
  );
}

function ModuloCard({ modulo, concluido, bloqueado, onAbrir }) {
  return (
    <button
      onClick={onAbrir}
      disabled={bloqueado}
      className={`text-left p-6 rounded-3xl border transition ${
        bloqueado
          ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
          : "bg-white border-[#E8F3ED] shadow-sm hover:shadow-md hover:-translate-y-1"
      }`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#E5F7EE] text-[#27C4BD] flex items-center justify-center mb-5">
        {concluido ? <CheckCircle2 size={28} /> : <Play size={26} />}
      </div>

      <h3 className="text-xl font-semibold text-slate-800">
        Módulo {modulo.numero}: {modulo.titulo}
      </h3>

      <p className="text-slate-500 mt-2">
        {concluido ? "Concluído" : bloqueado ? "Bloqueado" : modulo.tempo}
      </p>
    </button>
  );
}

function ModuloAberto({ modulo, concluido, onVoltar, onConcluir }) {
  return (
    <AppLayout>
      <main className="min-h-screen bg-[#F8FCFA] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onVoltar}
            className="mb-8 w-12 h-12 rounded-full bg-white border border-[#E8F3ED] shadow-sm flex items-center justify-center text-slate-700"
          >
            <ArrowLeft size={24} />
          </button>

          <article className="bg-white rounded-[36px] border border-[#E8F3ED] shadow-sm p-8">
            <span className="inline-flex items-center gap-2 text-[#27C4BD] bg-[#E5F7EE] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Módulo {modulo.numero}
            </span>

            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {modulo.titulo}
            </h1>

            <p className="text-slate-500 flex items-center gap-2 mb-8">
              <Clock size={18} />
              Tempo estimado: {modulo.tempo}
            </p>

            <div className="bg-[#F8FCFA] rounded-[28px] border border-[#E8F3ED] p-7 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-3">
                Conteúdo
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed">
                {modulo.conteudo}
              </p>
            </div>

            <div className="bg-[#EAFBF3] rounded-[28px] border border-[#DDEFE7] p-7 mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">
                Atividade prática
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed">
                {modulo.tarefa}
              </p>
            </div>

            <button
              onClick={onConcluir}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#27C4BD] to-[#38B487] text-white font-bold text-lg shadow-lg"
            >
              {concluido ? "Voltar para trilha" : "Concluir módulo"}
            </button>
          </article>
        </div>
      </main>
    </AppLayout>
  );
}

export default TrilhaAnsiedadeEscolar;