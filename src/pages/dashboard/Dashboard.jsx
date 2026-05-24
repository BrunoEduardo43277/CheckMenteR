import AppLayout from "../../layouts/AppLayout";
import { Link } from "react-router-dom";

import {
  Leaf,
  Moon,
  Target,
  Heart,
  BookOpen,
  Play,
} from "lucide-react";

function Dashboard() {

  const imageUrl = "src/assets/imagens/estampa.png";

  return (
    <AppLayout>

      <div className="w-full max-w-[1600px] mx-auto px-6">

        {/* TOPO */}
        <section className="mb-10">

          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Olá, {"usuario"}!
          </h1>

          <p className="text-slate-500 mt-3 text-base">
            Que bom te ver por aqui.
          </p>

          <p className="text-slate-500 text-base">
            Como você está se sentindo hoje?
          </p>

        </section>

        {/* BANNER */}
        <section className="relative overflow-hidden rounded-[36px] p-8 md:p-12 mb-14 bg-gradient-to-r from-[#EAFBF3] via-[#F3FFFA] to-[#E4F8EF] border border-[#DDEFE7] shadow-sm">

          <div className="absolute top-0 left-0 w-96 h-96 bg-[#5ED6A7]/20 blur-[120px] rounded-full" />

          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#38B487]/20 blur-[120px] rounded-full" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">

            <div>

              <div className="text-7xl text-[#38B487] leading-none mb-3">
                “
              </div>

              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 tracking-tight">
                Pequenos passos todos os dias podem levar a grandes mudanças.
              </h2>

              <p className="flex items-center gap-3 text-slate-600 mt-8 text-lg">

                <Heart
                  size={22}
                  className="text-[#38B487] fill-[#38B487]"
                />

                <span>
                  Cuide de você, sempre.
                </span>

              </p>

            </div>

            <div className="hidden lg:flex justify-center">

              <div className="relative">

                <div className="absolute -inset-5 bg-[#5ED6A7]/20 blur-3xl rounded-full" />

                <div className="relative w-[420px] h-[420px] rounded-full overflow-hidden border-4 border-white shadow-2xl">

                  <img
                    src={imageUrl}
                    alt="estampa.png"
                    className="w-full h-full object-cover"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* AÇÕES */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-3xl font-semibold text-slate-800">
            Ações rápidas
          </h2>


        </div>

        <section className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-16">

          <Link to="/respirador">

            <Acao
              icon={<Leaf size={30} />}
              titulo="Respirar"
              subtitulo="Exercício rápido"
              cor="green"
              
            />

          </Link>

          <Link to="/dormir">

            <Acao
              icon={<Moon size={30} />}
              titulo="Dormir melhor"
              subtitulo="Sons e meditações"
              cor="violet"
            />

          </Link>

          <Link to="/focar">

            <Acao
              icon={<Target size={30} />}
              titulo="Focar"
              subtitulo="Concentre-se"
              cor="blue"
            />

          </Link>

          <Link to="/acalmar">

            <Acao
              icon={<Heart size={30} />}
              titulo="Me acalmar"
              subtitulo="Alivie a ansiedade"
              cor="pink"
            />

          </Link>

          <Link to="/diario">

            <Acao
              icon={<BookOpen size={30} />}
              titulo="Diário"
              subtitulo="Escreva o que sente"
              cor="orange"
            />

          </Link>

        </section>

        {/* RECOMENDADOS */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-3xl font-semibold text-slate-800">
            Recomendado para você
          </h2>

        </div>

        <section className="grid lg:grid-cols-3 gap-7">

          <Recomendado
            titulo="Respiração para acalmar a mente"
            categoria="Exercício"
            tempo="5 min"
            fundo="from-[#DDF8EA] to-[#B8F0D1]"
          />

          <Recomendado
            titulo="Meditação para dormir melhor"
            categoria="Sono"
            tempo="8 min"
            fundo="from-[#5ED6A7] to-[#38B487]"
          />

          <Recomendado
            titulo="Como lidar com ansiedade escolar"
            categoria="Conteúdo"
            tempo="6 min"
            fundo="from-[#ECFFF5] to-[#D9F8E7]"
          />

        </section>

      </div>

    </AppLayout>
  );
}

function Acao({ icon, titulo, subtitulo, cor }) {

  const cores = {
    green: "bg-[#E5F7EE] text-[#2FA36B]",
    violet: "bg-[#EEF2FF] text-[#6D5DF6]",
    blue: "bg-[#EAF6FF] text-[#3693FF]",
    pink: "bg-[#FFF0F5] text-[#F45AA0]",
    orange: "bg-[#FFF5EB] text-[#FF9B3F]",
  };

  return (
    <button className="w-full bg-white rounded-[30px] border border-[#E8F3ED] p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${cores[cor]}`}>
        {icon}
      </div>

      <h3 className="font-semibold text-slate-800 text-xl">
        {titulo}
      </h3>

      <p className="text-slate-500 text-sm mt-2">
        {subtitulo}
      </p>

    </button>
  );
}

function Recomendado({ titulo, categoria, tempo, fundo }) {

  return (
    <div className="bg-white rounded-[30px] overflow-hidden border border-[#E8F3ED] hover:shadow-lg transition-all duration-300">

      <div className={`h-56 bg-gradient-to-br ${fundo} relative p-6`}>

        <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-700 shadow-sm">

          <Play size={14} fill="currentColor" />

          {tempo}

        </div>

      </div>

      <div className="p-6">

        <h3 className="text-2xl font-semibold leading-snug text-slate-800">
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