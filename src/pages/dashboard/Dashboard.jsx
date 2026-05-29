import { useState } from "react";
import {
  Leaf,
  Moon,
  TrendingUp,
  Heart,
  BookOpen,
  Play,
  X,
} from "lucide-react";

import AppLayout from "../../layouts/AppLayout";
import Button from "../../components/ui/Button";
import IconButton from "../../components/ui/IconButton";
import ProgressoEmocional from "./tiposfuncao/progressoEmocional/ProgressoEmocional";
import estampa from "../../assets/imagens/estampa.png";

const acoesRapidas = [
  {
    titulo: "Respirar",
    subtitulo: "Exercício rápido",
    rota: "/respirador",
    cor: "green",
    icon: Leaf,
  },
  {
    titulo: "Trilhas",
    subtitulo: "Trilhas emocionais",
    rota: "/Trilhas",
    cor: "violet",
    icon: Moon,
  },
  {
    titulo: "Lidar com emoções",
    subtitulo: "Alivie a ansiedade",
    rota: "/lidarEmocoes",
    cor: "pink",
    icon: Heart,
  },
  {
    titulo: "Diário",
    subtitulo: "Escreva o que sente",
    rota: "/diario",
    cor: "orange",
    icon: BookOpen,
  },
  {
    titulo: "Progresso emocional",
    subtitulo: "Veja sua evolução",
    tipo: "progresso",
    cor: "blue",
    icon: TrendingUp,
  },
];

const recomendacoes = [
  {
    titulo: "Vamos respirar juntos?",
    categoria: "Exercício",
    tempo: "3 min",
    video: "/videos/respiracao.mp4",
    thumbs: "/thumbs/19.png",
  },
  {
    titulo: "Sinais de sofrimento emocional",
    categoria: "Ansiedade",
    tempo: "3 min",
    video: "/videos/Transtorno.mp4",
    thumbs: "/thumbs/20.png",
  },
  {
    titulo: "Como lidar com ansiedade escolar",
    categoria: "Conteúdo",
    tempo: "6 min",
    video: "/videos/ansiedadeEscola.mp4",
    thumbs: "/thumbs/21.png",
  },
];

const coresAcao = {
  green: "bg-[#E5F7EE] text-[#2FA36B]",
  violet: "bg-[#EEF2FF] text-[#6D5DF6]",
  blue: "bg-[#EAF6FF] text-[#3693FF]",
  pink: "bg-[#FFF0F5] text-[#F45AA0]",
  orange: "bg-[#FFF5EB] text-[#FF9B3F]",
};

function Dashboard() {
  const [videoSelecionado, setVideoSelecionado] = useState(null);
  const [funcaoAberta, setFuncaoAberta] = useState(null);

  if (funcaoAberta === "progresso") {
    return (
      <AppLayout>
        <ProgressoEmocional onVoltar={() => setFuncaoAberta(null)} />
      </AppLayout>
    );
  }

  function abrirAcao(acao) {
    if (acao.tipo === "progresso") {
      setFuncaoAberta("progresso");
      return;
    }

    window.location.href = acao.rota;
  }

  return (
    <AppLayout>
      <main className="w-full max-w-[1600px] mx-auto px-6">
        <Header />

        <FraseMotivacional />

        <TituloSecao titulo="Ações rápidas" />

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {acoesRapidas.map((acao) => (
            <CardAcao
              key={acao.titulo}
              {...acao}
              onClick={() => abrirAcao(acao)}
            />
          ))}
        </section>

        <TituloSecao titulo="Recomendado para você" />

        <section className="grid lg:grid-cols-3 gap-7">
          {recomendacoes.map((item) => (
            <CardRecomendado
              key={item.titulo}
              {...item}
              onAbrir={() => setVideoSelecionado(item)}
            />
          ))}
        </section>
      </main>

      {videoSelecionado && (
        <ModalVideo
          video={videoSelecionado.video}
          titulo={videoSelecionado.titulo}
          onFechar={() => setVideoSelecionado(null)}
        />
      )}
    </AppLayout>
  );
}

function Header() {
  return (
    <section className="mb-10">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
        Olá, usuario!
      </h1>

      <p className="text-slate-500 mt-3 text-base">
        Que bom te ver por aqui.
      </p>

      <p className="text-slate-500 text-base">
        Como você está se sentindo hoje?
      </p>
    </section>
  );
}

function FraseMotivacional() {
  return (
    <section className="relative overflow-hidden rounded-[36px] p-8 md:p-12 mb-14 bg-gradient-to-r from-[#EAFBF3] via-[#F3FFFA] to-[#E4F8EF] border border-[#DDEFE7] shadow-sm">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#5ED6A7]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#38B487]/20 blur-[120px] rounded-full" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-7xl text-[#38B487] leading-none mb-3">“</div>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 tracking-tight">
            Pequenos passos todos os dias podem levar a grandes mudanças.
          </h2>

          <p className="flex items-center gap-3 text-slate-600 mt-8 text-lg">
            <Heart size={22} className="text-[#38B487] fill-[#38B487]" />
            <span>Cuide de você, sempre.</span>
          </p>
        </div>

        <div className="hidden lg:flex justify-center">
          <div className="relative">
            <div className="absolute -inset-5 bg-[#5ED6A7]/20 blur-3xl rounded-full" />

            <div className="relative w-[420px] h-[420px] rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img
                src={estampa}
                alt="Ilustração do CheckMente"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TituloSecao({ titulo }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-semibold text-slate-800">{titulo}</h2>
    </div>
  );
}

function CardAcao({ icon: Icon, titulo, subtitulo, cor, onClick }) {
  return (
    <Button variant="actionCard" onClick={onClick}>
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${coresAcao[cor]}`}
      >
        <Icon size={30} />
      </div>

      <h3 className="font-semibold text-slate-800 text-xl">{titulo}</h3>

      <p className="text-slate-500 text-sm mt-2">{subtitulo}</p>
    </Button>
  );
}

function CardRecomendado({ titulo, categoria, tempo, thumbs, onAbrir }) {
  return (
    <article
      onClick={onAbrir}
      className="bg-white rounded-[30px] overflow-hidden border border-[#E8F3ED] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden group bg-[#0b7db0]">
        <img
          src={thumbs}
          alt={titulo}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
          <Play size={30} fill="currentColor" className="text-[#38B487] ml-1" />
        </div>

        <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-700 shadow-sm">
          <Play size={14} fill="currentColor" />
          {tempo}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-semibold leading-snug text-slate-800">
          {titulo}
        </h3>

        <p className="text-slate-500 mt-4 text-sm">{categoria}</p>
      </div>
    </article>
  );
}

function ModalVideo({ video, titulo, onFechar }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="relative w-full max-w-6xl rounded-[36px] bg-black p-6 shadow-2xl">
        <IconButton
          label="Fechar video"
          onClick={onFechar}
          variant="white"
          className="absolute -top-5 -right-5"
        >
          <X size={24} />
        </IconButton>

        <div className="mb-4">
          <h2 className="text-white text-2xl font-semibold">{titulo}</h2>

          <p className="text-white/60 text-sm mt-1">
            Clique no vídeo para pausar ou continuar.
          </p>
        </div>

        <video
          src={video}
          controls
          autoPlay
          playsInline
          onEnded={onFechar}
          className="w-full max-h-[75vh] rounded-[28px] bg-[#0b7db0] object-contain"
        />
      </div>
    </div>
  );
}

export default Dashboard;