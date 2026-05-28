import { useEffect, useState } from "react";
import AppLayout from "../../../../layouts/AppLayout";
import { PrimaryButton } from "../../../../components/ui/Button";
import IconButton from "../../../../components/ui/IconButton";
import { auth, db } from "../../../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import {
  ArrowLeft,
  Plus,
  BookOpen,
  Star,
  Trash2,
  CalendarDays,
  Save,
} from "lucide-react";

import felizImg from "../../../../assets/imagens/1.png";
import neutroImg from "../../../../assets/imagens/3.png";
import ansiosoImg from "../../../../assets/imagens/6.png";
import tristeImg from "../../../../assets/imagens/4.png";
import cansadoImg from "../../../../assets/imagens/8.png";

const imagemPorEmocao = {
  Feliz: felizImg,
  Neutro: neutroImg,
  Ansioso: ansiosoImg,
  Triste: tristeImg,
  Cansado: cansadoImg,
};

function Diario() {
  const [criando, setCriando] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [emocao, setEmocao] = useState("Neutro");
  const [diarios, setDiarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const hoje = new Date();

  useEffect(() => {
    const pararAuth = onAuthStateChanged(auth, (usuario) => {
      setUsuarioAtual(usuario);

      if (!usuario) {
        setCarregando(false);
        return;
      }

      const consulta = query(
        collection(db, "diarios"),
        where("userId", "==", usuario.uid)
      );

      const pararDiarios = onSnapshot(consulta, (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        setDiarios(lista);
        setCarregando(false);
      });

      return () => pararDiarios();
    });

    return () => pararAuth();
  }, []);

  async function salvarDiario() {
    if (!titulo.trim() || !texto.trim()) {
      alert("Preencha o tÃ­tulo e o texto.");
      return;
    }

    if (!usuarioAtual) {
      alert("VocÃª precisa estar logado.");
      return;
    }

    await addDoc(collection(db, "diarios"), {
      userId: usuarioAtual.uid,
      titulo,
      texto,
      emocao,
      favorito: false,
      criadoEm: serverTimestamp(),
    });

    setTitulo("");
    setTexto("");
    setEmocao("Neutro");
    setCriando(false);
  }

  async function apagarDiario(id) {
    const confirmar = confirm("Deseja apagar este diÃ¡rio?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "diarios", id));
  }

  if (carregando) {
    return (
      <AppLayout>
        <main className="min-h-screen bg-[#F8FCFA] flex items-center justify-center">
          <p className="text-slate-500 text-lg">Carregando diÃ¡rio...</p>
        </main>
      </AppLayout>
    );
  }

  if (criando) {
    return (
      <AppLayout>
        <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#FFFFFF_0%,_#F1FCF8_35%,_#DDF5EE_100%)] px-6 py-8">
          <FundoSuave />

          <div className="relative z-10 max-w-3xl mx-auto">
            <header className="flex items-center justify-between mb-10">
              <IconButton
                label="Voltar"
                onClick={() => setCriando(false)}
                variant="soft"
              >
                <ArrowLeft size={24} />
              </IconButton>

              <PrimaryButton onClick={salvarDiario} variant="pill">
                <Save size={19} />
                Salvar
              </PrimaryButton>
            </header>

            <section className="bg-white/80 backdrop-blur-xl rounded-[30px] p-8 shadow-[0_18px_50px_rgba(16,24,40,0.07)] border border-white/70">
              <DataDiario data={hoje} />

              <div className="flex gap-3 my-8 flex-wrap">
                {["Feliz", "Neutro", "Ansioso", "Triste", "Cansado"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setEmocao(item)}
                      className={`px-5 py-3 rounded-full text-sm font-semibold transition ${
                        emocao === item
                          ? "bg-[#27C4BD] text-white shadow-[0_10px_28px_rgba(39,196,189,0.26)]"
                          : "bg-white/60 text-slate-500 border border-white/70 hover:bg-white hover:text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={imagemPorEmocao[item]}
                          alt={item}
                          className="w-8 h-8 object-contain drop-shadow-sm select-none pointer-events-none"
                        />
                        <span>{item}</span>
                      </div>
                    </button>
                  )
                )}
              </div>

              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Digite o Titulo..."
                className="w-full bg-transparent text-[2.35rem] leading-[1.1] tracking-tight font-bold text-slate-900 placeholder:text-slate-400 outline-none mb-7"
              />

              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escreva mais aqui..."
                className="w-full min-h-[430px] bg-transparent text-2xl font-light tracking-[0.01em] text-slate-700 placeholder:text-slate-400 outline-none resize-none leading-relaxed"
              />
            </section>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#FFFFFF_0%,_#F1FCF8_35%,_#DDF5EE_100%)] px-6 py-10">
        <FundoSuave />

        <div className="relative z-10 max-w-5xl mx-auto">
          <header className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-[#2FA36B] mb-3">
                Espaço pessoal
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Diario Emocional
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Um lugar reservado para registrar pensamentos, sentimentos e
                momentos que merecem ser guardados.
              </p>
            </div>

            <IconButton
              label="Criar diario"
              onClick={() => setCriando(true)}
              variant="circle"
              size="lg"
            >
              <Plus size={34} />
            </IconButton>
          </header>

          {diarios.length === 0 ? (
            <TelaVazia onCriar={() => setCriando(true)} />
          ) : (
            <section className="grid md:grid-cols-2 gap-6">
              {diarios.map((diario) => (
                <DiarioCard
                  key={diario.id}
                  diario={diario}
                  onApagar={() => apagarDiario(diario.id)}
                />
              ))}
            </section>
          )}
        </div>
      </main>
    </AppLayout>
  );
}

function FundoSuave() {
  return (
    <>
      <div className="absolute -top-28 -right-24 w-80 h-80 rounded-full bg-[#BFEFD5]/35 blur-3xl" />
      <div className="absolute top-1/3 -left-28 w-72 h-72 rounded-full bg-[#AEEADF]/30 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/45 blur-3xl" />
    </>
  );
}

function TelaVazia({ onCriar }) {
  return (
    <section className="min-h-[65vh] flex items-center justify-center text-center">
      <div className="max-w-md bg-white/80 backdrop-blur-xl rounded-[30px] p-10 shadow-[0_18px_50px_rgba(16,24,40,0.07)] border border-white/70">
        <div className="w-28 h-28 rounded-[28px] bg-[#E5F7EE] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <BookOpen size={48} className="text-[#27C4BD]" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Seu espaço seguro começa aqui
        </h2>

        <p className="text-slate-500 text-lg leading-relaxed mb-10">
          Escreva sobre seu dia, suas emoções ou algo que deseja guardar com
          carinho.
        </p>

        <PrimaryButton onClick={onCriar} variant="pill">
          Criar primeiro diario
        </PrimaryButton>
      </div>
    </section>
  );
}

function DiarioCard({ diario, onApagar }) {
  const data = diario.criadoEm?.toDate?.() || new Date();
  const imagemEmocao = imagemPorEmocao[diario.emocao] || neutroImg;

  return (
    <article className="bg-white/72 backdrop-blur-xl rounded-[28px] p-6 shadow-[0_12px_38px_rgba(16,24,40,0.065)] border border-white/70 hover:shadow-[0_18px_46px_rgba(16,24,40,0.09)] hover:-translate-y-1 transition">
      <div className="flex justify-between gap-5">
        <DataDiario data={data} pequeno />

        <img
          src={imagemEmocao}
          alt={diario.emocao || "Neutro"}
          className="w-14 h-14 object-contain drop-shadow-sm select-none pointer-events-none"
        />
      </div>

      <div className="mt-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {diario.titulo}
        </h2>

        <p className="text-slate-600 mt-3 leading-relaxed line-clamp-3">
          {diario.texto}
        </p>
      </div>

      <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-100/70">
        <span className="text-slate-400 text-sm flex items-center gap-2">
          <CalendarDays size={16} />
          {data.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        <div className="flex gap-3">
          <Star
            size={22}
            className="text-slate-300 hover:text-yellow-400 transition"
          />

          <IconButton label="Apagar diario" onClick={onApagar} variant="ghost" size="sm">
            <Trash2 size={22} />
          </IconButton>
        </div>
      </div>
    </article>
  );
}

function DataDiario({ data, pequeno = false }) {
  const dia = data.getDate();
  const mes = data.toLocaleDateString("pt-BR", { month: "short" });
  const ano = data.getFullYear();
  const semana = data.toLocaleDateString("pt-BR", { weekday: "long" });

  return (
    <section className="flex items-center gap-5">
      <strong
        className={`text-slate-900 leading-none tracking-tight ${
          pequeno ? "text-4xl" : "text-5xl"
        }`}
      >
        {dia}
      </strong>

      <div>
        <p className="text-lg font-semibold text-slate-700">
          {mes}. {ano}
        </p>

        <p className="text-base text-slate-500 capitalize">{semana}</p>
      </div>
    </section>
  );
}

export default Diario;

