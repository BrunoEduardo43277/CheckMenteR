import { Link } from "react-router-dom";
import {
  Brain,
  Heart,
  BarChart3,
  Bell,
  Shield,
  Sparkles,
  ArrowRight,
  Smile,
  Users,
  Trophy,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-[#F8FCFA] text-slate-950">
      <Navbar />

      <section className="relative overflow-hidden px-6 pt-24 pb-20 bg-[linear-gradient(to_right,#E6F3EC_1px,transparent_1px),linear-gradient(to_bottom,#E6F3EC_1px,transparent_1px)] bg-[size:48px_48px]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BFE7D1] bg-[#EAFBF3] px-5 py-2 text-[#38B487] font-semibold mb-8">
              <Sparkles size={18} />
              Plataforma de Saúde Emocional Escolar
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Tecnologia que cuida das emoções de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5ED6A7] to-[#38B487]">
                cada aluno
              </span>
            </h1>

            <p className="mt-8 text-xl text-slate-500 leading-relaxed max-w-2xl">
              Monitore o bem-estar emocional dos estudantes, registre check-ins,
              identifique padrões e ofereça acolhimento com apoio de IA.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
              >
                Começar Agora <ArrowRight size={22} />
              </Link>

              <a
                href="#recursos"
                className="px-8 py-4 rounded-2xl bg-white border border-[#DDEFE7] text-slate-800 font-bold text-lg text-center"
              >
                Saiba Mais
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 text-slate-500">
              <span className="flex items-center gap-2">
                <Shield className="text-[#38B487]" size={20} />
                Dados protegidos
              </span>

              <span className="flex items-center gap-2">
                <Heart className="text-[#5ED6A7]" size={20} />
                Ambiente acolhedor
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-[#E6F3EC]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5ED6A7] to-[#38B487] flex items-center justify-center text-white">
                  <Heart size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-bold">Check-in Emocional</h3>
                  <p className="text-slate-500">Como você está hoje?</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3 text-center text-4xl mb-8">
                <img src="src/assets/imagens/1.png" className="bg-[#EAFBF3] p-4 rounded-2xl" alt="Feliz" />
                <img src="src/assets/imagens/2.png" className="bg-[#EAFBF3] p-4 rounded-2xl" alt="Neutro" />
                <img src="src/assets/imagens/3.png" className="bg-[#EAFBF3] p-4 rounded-2xl" alt="Triste" />
                <img src="src/assets/imagens/4.png" className="bg-[#EAFBF3] p-4 rounded-2xl" alt="Preocupado" />
                <img src="src/assets/imagens/5.png" className="bg-[#EAFBF3] p-4 rounded-2xl" alt="Ansioso" />
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-gradient-to-r from-[#5ED6A7] to-[#38B487] rounded-full" />
              </div>

              <p className="mt-4 text-slate-500">
                75% dos alunos se sentem bem hoje
              </p>
            </div>

            <div className="hidden md:block absolute -bottom-7 -left-7 bg-white rounded-2xl shadow-xl border border-[#E6F3EC] px-6 py-4">
              <p className="font-bold">+12% bem-estar</p>
              <p className="text-slate-500 text-sm">Esta semana</p>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="px-6 py-24">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#38B487] font-bold tracking-widest mb-4">
            RECURSOS
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Tudo que sua escola precisa para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5ED6A7] to-[#38B487]">
              cuidar das emoções
            </span>
          </h2>

          <p className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto">
            Uma plataforma completa que une tecnologia, empatia e dados para
            transformar o bem-estar emocional no ambiente escolar.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 text-left">
            <Card icon={<Heart />} title="Check-in Emocional" text="Registro diário do estado emocional dos alunos." />
            <Card icon={<Brain />} title="IA de Acolhimento" text="Suporte inicial com respostas acolhedoras e inteligentes." />
            <Card icon={<BarChart3 />} title="Dashboard Analítico" text="Indicadores para acompanhar tendências emocionais." />
            <Card icon={<Bell />} title="Alertas Preventivos" text="Identificação de sinais que precisam de atenção." />
            <Card icon={<Users />} title="Inclusão Escolar" text="Interface clara para diferentes perfis de estudantes." />
            <Card icon={<Trophy />} title="Gamificação" text="Recompensas para incentivar participação e autocuidado." />
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#F3FFFA] text-center">
        <p className="text-[#38B487] font-bold tracking-widest mb-4">
          COMO FUNCIONA
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold">
          Simples, inteligente e{" "}
          <span className="text-[#38B487]">acolhedor</span>
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mt-16">
          <Step number="01" icon={<Smile />} title="Check-in Diário" />
          <Step number="02" icon={<BarChart3 />} title="Análise de Dados" />
          <Step number="03" icon={<Bell />} title="Alertas Inteligentes" />
          <Step number="04" icon={<Heart />} title="Acolhimento" />
        </div>
      </section>

      <section className="px-6 py-24 bg-gradient-to-br from-[#F3FFFA] to-[#E8F8F0] text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Sua escola merece uma{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5ED6A7] to-[#38B487]">
            tecnologia que cuida
          </span>
        </h2>

        <p className="mt-6 text-xl text-slate-500 max-w-3xl mx-auto">
          Comece com login, check-in, dashboard e perfil conectado ao Firebase.
        </p>

        <Link
          to="/cadastro"
          className="mt-10 inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white font-bold text-lg shadow-lg"
        >
          Começar Gratuitamente <ArrowRight size={22} />
        </Link>
      </section>

      <footer className="px-6 py-10 bg-white text-center text-slate-500">
        Feito com <span className="text-[#38B487]">❤</span> por CheckMente © 2026
      </footer>
    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-[#E6F3EC] shadow-sm hover:shadow-xl transition">
      <div className="w-16 h-16 rounded-2xl bg-[#EAFBF3] text-[#38B487] flex items-center justify-center mb-7">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{text}</p>
    </div>
  );
}

function Step({ number, icon, title }) {
  return (
    <div className="text-center">
      <div className="relative mx-auto w-28 h-28 rounded-3xl bg-gradient-to-br from-[#EAFBF3] to-[#BFE7D1] flex items-center justify-center text-[#38B487] mb-8">
        <div className="absolute -top-4 -right-4 w-11 h-11 rounded-full bg-[#5ED6A7] text-white flex items-center justify-center font-bold">
          {number}
        </div>

        <div className="scale-150">{icon}</div>
      </div>

      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
  );
}

export default Home;