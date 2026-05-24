import { useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Brain,
  Eye,
  MessageCircle,
  ShieldAlert,
} from "lucide-react";

function Alertas() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const alertas = [
    {
      aluno: "Maria Santos",
      turma: "8º Ano B",
      iniciais: "MS",
      descricao: "Padrão de ausência detectado: 4 faltas nas últimas 2 semanas.",
      emocao: "Desânimo",
      risco: 68,
      nivel: "Médio",
      status: "Resolvido",
      recomendacao:
        "Acompanhar frequência e verificar se há dificuldade familiar, escolar ou emocional.",
    },
    {
      aluno: "Ana Beatriz",
      turma: "9º Ano A",
      iniciais: "AB",
      descricao:
        "Sinais de isolamento social nos intervalos. Monitoramento preventivo recomendado.",
      emocao: "Isolamento",
      risco: 42,
      nivel: "Baixo",
      status: "Pendente",
      recomendacao:
        "Observar interações sociais e oferecer uma conversa acolhedora sem pressão.",
    },
    {
      aluno: "Pedro Costa",
      turma: "7º Ano A",
      iniciais: "PC",
      descricao:
        "Relatos recentes indicam ansiedade elevada durante atividades avaliativas.",
      emocao: "Ansiedade",
      risco: 81,
      nivel: "Alto",
      status: "Pendente",
      recomendacao:
        "Encaminhar para escuta individual e acompanhar evolução nas próximas semanas.",
    },
  ];

  const filtrados = alertas.filter((item) => {
    const combinaFiltro = filtro === "Todos" || item.nivel === filtro;
    const combinaBusca = item.aluno
      .toLowerCase()
      .includes(busca.toLowerCase());

    return combinaFiltro && combinaBusca;
  });

  const total = alertas.length;
  const alto = alertas.filter((a) => a.nivel === "Alto").length;
  const pendentes = alertas.filter((a) => a.status === "Pendente").length;
  const resolvidos = alertas.filter((a) => a.status === "Resolvido").length;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-2">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Alertas Preventivos
          </h1>

          <p className="text-slate-500 text-base mt-3">
            Monitoramento inteligente de padrões emocionais.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <ResumoCard
            icon={<Bell size={22} />}
            titulo="Alertas ativos"
            valor={total}
            cor="blue"
          />

          <ResumoCard
            icon={<ShieldAlert size={22} />}
            titulo="Alto risco"
            valor={alto}
            cor="red"
          />

          <ResumoCard
            icon={<Clock size={22} />}
            titulo="Pendentes"
            valor={pendentes}
            cor="orange"
          />

          <ResumoCard
            icon={<CheckCircle2 size={22} />}
            titulo="Resolvidos"
            valor={resolvidos}
            cor="green"
          />
        </div>

        <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 grid lg:grid-cols-[1fr_auto] gap-4">
            <div className="flex items-center border border-slate-200 rounded-2xl px-4 py-3">
              <Search size={20} className="text-slate-400 mr-3" />

              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar aluno..."
                className="w-full outline-none text-base"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto">
              {["Todos", "Alto", "Médio", "Baixo"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFiltro(item)}
                  className={`px-5 py-3 rounded-2xl text-sm font-medium transition ${
                    filtro === item
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-5">
            {filtrados.map((alerta) => (
              <AlertaCard key={alerta.aluno} alerta={alerta} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function ResumoCard({ icon, titulo, valor, cor }) {
  const cores = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-500",
    orange: "bg-orange-50 text-orange-500",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${cores[cor]}`}
      >
        {icon}
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
        {valor}
      </h2>

      <p className="text-slate-500 text-sm mt-1">{titulo}</p>
    </div>
  );
}

function AlertaCard({ alerta }) {
  return (
    <div className="rounded-[26px] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center font-semibold">
            {alerta.iniciais}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-800">
                {alerta.aluno}
              </h2>

              <span className="text-sm text-slate-500">{alerta.turma}</span>
            </div>

            <p className="text-slate-500 text-base mt-2 max-w-3xl">
              {alerta.descricao}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <BadgeNivel nivel={alerta.nivel} />
              <BadgeStatus status={alerta.status} />

              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                {alerta.emocao}
              </span>
            </div>
          </div>
        </div>

        <div className="xl:w-64">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-500">Risco emocional</span>
            <span className="font-semibold text-slate-800">
              {alerta.risco}%
            </span>
          </div>

          <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                alerta.risco >= 75
                  ? "bg-red-500"
                  : alerta.risco >= 50
                  ? "bg-orange-400"
                  : "bg-blue-500"
              }`}
              style={{ width: `${alerta.risco}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-[1fr_auto] gap-5 items-center">
        <div className="bg-slate-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={18} className="text-blue-600" />
            <p className="font-medium text-slate-800">Análise da IA</p>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed">
            {alerta.recomendacao}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2">
            <Eye size={18} />
            Ver análise
          </button>

          <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium shadow-md flex items-center gap-2">
            <MessageCircle size={18} />
            Abrir caso
          </button>
        </div>
      </div>
    </div>
  );
}

function BadgeNivel({ nivel }) {
  const estilos = {
    Alto: "bg-red-50 text-red-500 border-red-100",
    Médio: "bg-orange-50 text-orange-500 border-orange-100",
    Baixo: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full border text-sm font-medium ${estilos[nivel]}`}
    >
      {nivel}
    </span>
  );
}

function BadgeStatus({ status }) {
  const estilos = {
    Resolvido: "bg-green-50 text-green-600",
    Pendente: "bg-amber-50 text-amber-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${estilos[status]}`}>
      {status}
    </span>
  );
}

export default Alertas;