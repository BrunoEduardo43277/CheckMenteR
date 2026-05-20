import AppLayout from "../layouts/AppLayout";

import {
  Leaf,
  Moon,
  Target,
  Heart,
  BookOpen,
  Play,
} from "lucide-react";

function Dashboard() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-2">

        {/* TOPO */}
        <section className="mb-10">

          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Olá, Bruno!
          </h1>

          <p className="text-slate-500 mt-3 text-base">
            Que bom te ver por aqui!
          </p>

          <p className="text-slate-500 text-base">
            Como você está se sentindo hoje?
          </p>

        </section>

<section className="relative overflow-hidden rounded-[32px] p-8 md:p-10 mb-12 bg-gradient-to-r from-blue-50 via-violet-50 to-blue-100 border border-white/60 shadow-[0_10px_40px_rgba(99,102,241,0.10)]">

  {/* EFEITOS DE FUNDO */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 blur-3xl rounded-full" />

  <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-300/20 blur-3xl rounded-full" />

  <div className="relative grid md:grid-cols-2 gap-8 items-center">

    <div className="animate-[fadeIn_1s_ease]">

      <div className="text-6xl text-blue-500 mb-4 animate-pulse">
        “
      </div>

      <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-slate-800">
        Pequenos passos todos os dias podem levar a grandes mudanças.
      </h2>

      <p className="flex items-center gap-2 text-slate-500 mt-6 text-base">

        <Heart
          size={18}
          className="text-blue-500"
        />

        Cuide de você, sempre.

      </p>

    </div>

    <div className="hidden md:flex justify-center">

      <div className="relative animate-[float_4s_ease-in-out_infinite]">

        <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full" />

        <div className="relative text-[130px]">
          🪴
        </div>

      </div>

    </div>

  </div>

</section>

        {/* AÇÕES */}
        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold text-slate-800">
            Ações rápidas
          </h2>

          <button className="text-blue-600 font-medium text-sm">
            Ver todas
          </button>

        </div>

        <section className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-14">

          <Acao
            icon={<Leaf size={28} />}
            titulo="Respirar"
            subtitulo="Exercício rápido"
            cor="green"
          />

          <Acao
            icon={<Moon size={28} />}
            titulo="Dormir melhor"
            subtitulo="Sons e meditações"
            cor="violet"
          />

          <Acao
            icon={<Target size={28} />}
            titulo="Focar"
            subtitulo="Concentre-se"
            cor="blue"
          />

          <Acao
            icon={<Heart size={28} />}
            titulo="Me acalmar"
            subtitulo="Alivie a ansiedade"
            cor="pink"
          />

          <Acao
            icon={<BookOpen size={28} />}
            titulo="Diário"
            subtitulo="Escreva o que sente"
            cor="orange"
          />

        </section>

        {/* RECOMENDADOS */}
        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold text-slate-800">
            Recomendado para você
          </h2>

          <button className="text-blue-600 font-medium text-sm">
            Ver todas
          </button>

        </div>

        <section className="grid md:grid-cols-3 gap-6">

          <Recomendado
            titulo="Respiração para acalmar a mente"
            categoria="Exercício"
            tempo="5 min"
            fundo="from-green-200 to-cyan-200"
          />

          <Recomendado
            titulo="Meditação para uma boa noite de sono"
            categoria="Sono"
            tempo="8 min"
            fundo="from-blue-500 to-violet-600"
          />

          <Recomendado
            titulo="Como lidar com a ansiedade na escola"
            categoria="Conteúdo"
            tempo="6 min"
            fundo="from-green-100 to-lime-100"
          />

        </section>

      </div>
    </AppLayout>
  );
}

function Acao({
  icon,
  titulo,
  subtitulo,
  cor,
}) {

  const cores = {
    green: "bg-green-50 text-green-500",
    violet: "bg-violet-50 text-violet-500",
    blue: "bg-blue-50 text-blue-500",
    pink: "bg-pink-50 text-pink-500",
    orange: "bg-orange-50 text-orange-500",
  };

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 p-6 text-center hover:shadow-md transition-all duration-300">

      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${cores[cor]}`}
      >
        {icon}
      </div>

      <h3 className="font-semibold text-slate-800 text-lg">
        {titulo}
      </h3>

      <p className="text-slate-500 text-sm mt-1">
        {subtitulo}
      </p>

    </div>
  );
}

function Recomendado({
  emoji,
  titulo,
  categoria,
  tempo,
  fundo,
}) {

  return (
    <div className="bg-white rounded-[28px] overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-300">

      <div
        className={`h-52 bg-gradient-to-br ${fundo} relative p-6`}
      >

        <div className="text-7xl">
          {emoji}
        </div>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 text-sm font-medium text-slate-700">

          <Play
            size={14}
            fill="currentColor"
          />

          {tempo}

        </div>

      </div>

      <div className="p-5">

        <h3 className="text-xl font-semibold leading-snug text-slate-800">
          {titulo}
        </h3>

        <p className="text-slate-500 mt-4 text-sm">
          {categoria}
        </p>

      </div>

    </div>
  );
}

export default Dashboard;