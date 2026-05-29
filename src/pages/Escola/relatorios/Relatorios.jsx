import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../../layouts/AppLayout";
import {
  Calendar,
  Smile,
  Heart,
  Brain,
  Activity,
  Leaf,
  Moon,
  BookOpen,
} from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../services/firebase";

const EMOCOES = [
  { key: "feliz", label: "Feliz", color: "#34d399", badge: "bg-green-400" },
  { key: "neutro", label: "Neutro", color: "#3b82f6", badge: "bg-blue-500" },
  { key: "ansioso", label: "Ansioso", color: "#f59e0b", badge: "bg-orange-400" },
  { key: "triste", label: "Triste", color: "#a855f7", badge: "bg-violet-400" },
];

function normalizarEmocao(valor = "") {
  const texto = valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (texto.includes("ansioso")) return "ansioso";
  if (texto.includes("triste")) return "triste";
  if (texto.includes("neutro")) return "neutro";
  if (texto.includes("feliz")) return "feliz";

  return "neutro";
}

function converterData(valor) {
  if (!valor) return null;
  if (typeof valor.toDate === "function") return valor.toDate();
  if (valor instanceof Date) return valor;

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function formatarDia(data) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(data);
}

function formatarPeriodo(datas) {
  if (datas.length === 0) return "Sem registros";

  const ordenadas = [...datas].sort((a, b) => a - b);
  const formatador = new Intl.DateTimeFormat("pt-BR");

  return `${formatador.format(ordenadas[0])} - ${formatador.format(
    ordenadas[ordenadas.length - 1]
  )}`;
}

function calcularBemEstar(checkins) {
  if (checkins.length === 0) return 0;

  const soma = checkins.reduce((total, item) => {
    const emocao = normalizarEmocao(item.emocao);
    const intensidade = Number(item.intensidade || 0);
    const base =
      emocao === "feliz"
        ? 7
        : emocao === "neutro"
        ? 5
        : emocao === "ansioso"
        ? 4
        : 3;

    return total + Math.min(10, Math.max(1, base + intensidade / 2));
  }, 0);

  return soma / checkins.length;
}

function agregarPorDia(checkins) {
  const mapa = new Map();

  checkins.forEach((item) => {
    const data = converterData(item.criadoEm);
    if (!data) return;

    const chave = data.toISOString().slice(0, 10);
    const atual = mapa.get(chave) || {
      data: formatarDia(data),
      feliz: 0,
      neutro: 0,
      ansioso: 0,
      triste: 0,
    };

    atual[normalizarEmocao(item.emocao)] += 1;
    mapa.set(chave, atual);
  });

  return [...mapa.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, valor]) => valor);
}

function contarEmocoes(checkins) {
  const totais = { feliz: 0, neutro: 0, ansioso: 0, triste: 0 };

  checkins.forEach((item) => {
    totais[normalizarEmocao(item.emocao)] += 1;
  });

  return totais;
}

function calcularPercentual(valor, total) {
  if (!total) return 0;
  return Math.round((valor / total) * 100);
}

function Relatorios() {
  const [checkins, setCheckins] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [conversas, setConversas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const handleErro = () => {
      setErro("Nao foi possivel carregar todos os dados do Firebase.");
      setCarregando(false);
    };

    const pararCheckins = onSnapshot(
      query(collection(db, "checkins"), orderBy("criadoEm", "asc")),
      (snapshot) => {
        setCheckins(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setCarregando(false);
      },
      handleErro
    );

    const pararAlertas = onSnapshot(
      query(collection(db, "alertas"), orderBy("criadoEm", "desc")),
      (snapshot) => {
        setAlertas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      handleErro
    );

    const pararUsuarios = onSnapshot(
      collection(db, "usuarios"),
      (snapshot) => {
        setUsuarios(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      handleErro
    );

    const pararConversas = onSnapshot(
      query(collection(db, "conversasIA"), orderBy("criadoEm", "desc")),
      (snapshot) => {
        setConversas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      handleErro
    );

    return () => {
      pararCheckins();
      pararAlertas();
      pararUsuarios();
      pararConversas();
    };
  }, []);

  const dados = useMemo(() => {
    const registros = agregarPorDia(checkins);
    const totaisEmocoes = contarEmocoes(checkins);
    const totalCheckins = checkins.length;
    const mediaBemEstar = calcularBemEstar(checkins);
    const datas = checkins.map((item) => converterData(item.criadoEm)).filter(Boolean);
    const diasAtencao = new Set(
      checkins
        .filter((item) => {
          const emocao = normalizarEmocao(item.emocao);
          return (
            emocao === "ansioso" ||
            emocao === "triste" ||
            Number(item.intensidade || 0) >= 4
          );
        })
        .map((item) => {
          const data = converterData(item.criadoEm);
          return data ? data.toISOString().slice(0, 10) : null;
        })
        .filter(Boolean)
    ).size;

    const emocaoFrequente = EMOCOES.reduce(
      (maior, item) =>
        totaisEmocoes[item.key] > totaisEmocoes[maior.key] ? item : maior,
      EMOCOES[0]
    );

    const percentualFrequente = calcularPercentual(
      totaisEmocoes[emocaoFrequente.key],
      totalCheckins
    );
    const alunos = usuarios.filter((usuario) => usuario.role !== "escola").length;
    const alertasAltos = alertas.filter((alerta) => alerta.nivel === "Alto").length;

    return {
      registros,
      totaisEmocoes,
      totalCheckins,
      mediaBemEstar,
      diasAtencao,
      emocaoFrequente,
      percentualFrequente,
      periodo: formatarPeriodo(datas),
      alunos,
      alertasAltos,
      conversasIA: conversas.length,
    };
  }, [alertas, checkins, conversas, usuarios]);

  const metricas = [
    ["Check-ins realizados", dados.totalCheckins, `${dados.alunos} alunos acompanhados`, <Smile />, "blue"],
    [
      "Media de bem-estar",
      `${dados.mediaBemEstar.toFixed(1).replace(".", ",")}/10`,
      dados.totalCheckins > 0 ? "Calculada pelos check-ins" : "Sem dados suficientes",
      <Activity />,
      "green",
    ],
    [
      "Emocao frequente",
      dados.totalCheckins > 0 ? dados.emocaoFrequente.label : "Sem registros",
      `${dados.percentualFrequente}% dos registros`,
      <Brain />,
      "orange",
    ],
    ["Dias de atencao", dados.diasAtencao, `${dados.alertasAltos} alertas de alto risco`, <Heart />, "pink"],
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-2">
        <Header periodo={dados.periodo} />

        {erro && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
            {erro}
          </div>
        )}

        {carregando && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-500">
            Carregando dados reais do Firebase...
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-5 mb-6">
          {metricas.map(([title, value, info, icon, color]) => (
            <Metric
              key={title}
              title={title}
              value={value}
              info={info}
              icon={icon}
              color={color}
            />
          ))}
        </div>

        <div className="grid xl:grid-cols-2 gap-6 mb-6">
          <Card title="Evolucao das emocoes">
            <Legend />
            <LineChart registros={dados.registros} />
          </Card>

          <Card title="Mapa emocional">
            <MindMap dados={dados} />
          </Card>
        </div>

        <div className="grid xl:grid-cols-2 gap-6 mb-6">
          <Card title="Resumo emocional">
            <div className="grid md:grid-cols-[170px_1fr] gap-6 items-center">
              <DonutChart total={dados.totalCheckins} totais={dados.totaisEmocoes} />
              <div className="space-y-3">
                {EMOCOES.map((emocao) => (
                  <Resumo
                    key={emocao.key}
                    color={emocao.badge}
                    label={emocao.label}
                    value={`${calcularPercentual(
                      dados.totaisEmocoes[emocao.key],
                      dados.totalCheckins
                    )}%`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card title="Insights da IA">
            <div className="space-y-4">
              <Insight text={`${dados.conversasIA} conversas com a IA registradas no Firebase.`} />
              <Insight text={`${dados.alertasAltos} alertas de alto risco foram gerados pela IA.`} />
              <Insight text={`A emocao mais frequente no periodo foi ${dados.emocaoFrequente.label}.`} />
            </div>
          </Card>
        </div>

        <Card title="Atividades e bem-estar">
          <div className="grid md:grid-cols-3 gap-4">
            <Atividade icon={<Leaf />} title="Respiracao" text="Modulo disponivel" />
            <Atividade icon={<Moon />} title="Trilhas" text={`${dados.diasAtencao} dias de atencao`} />
            <Atividade icon={<BookOpen />} title="Diario e check-ins" text={`${dados.totalCheckins} registros`} />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function Header({ periodo }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
          Relatorios Emocionais
        </h1>

        <p className="text-slate-500 text-base mt-3">
          Visualize padroes emocionais, evolucao e recomendacoes inteligentes.
        </p>
      </div>

      <button className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium flex items-center gap-2 shadow-sm">
        <Calendar size={18} />
        {periodo}
      </button>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ icon, title, value, info, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-500",
    pink: "bg-pink-50 text-pink-500",
  };

  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colors[color]}`}>
        {icon}
      </div>

      <p className="text-slate-500 text-sm">{title}</p>
      <h2 className="text-2xl font-semibold text-slate-800 mt-2">{value}</h2>
      <p className="text-slate-500 text-sm mt-3">{info}</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {EMOCOES.map((item) => (
        <span key={item.key} className="flex items-center gap-2 text-sm text-slate-500">
          <span className={`w-4 h-2 rounded-full ${item.badge}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function LineChart({ registros }) {
  const maiorValor = Math.max(
    1,
    ...registros.flatMap((item) => EMOCOES.map((emocao) => item[emocao.key] || 0))
  );

  function path(campo) {
    return registros
      .map((item, index) => {
        const espacamento = registros.length > 1 ? 500 / (registros.length - 1) : 0;
        const x = 40 + index * espacamento;
        const y = 210 - ((item[campo] || 0) / maiorValor) * 170;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }

  if (registros.length === 0) {
    return <EmptyState text="Nenhum check-in encontrado para montar o grafico." />;
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 560 240" className="min-w-[560px] w-full h-64">
        {[0, 1, 2, 3, 4].map((line) => (
          <line
            key={line}
            x1="35"
            y1={30 + line * 45}
            x2="540"
            y2={30 + line * 45}
            stroke="#e5e7eb"
            strokeDasharray="4 4"
          />
        ))}

        {EMOCOES.map((emocao) => (
          <path
            key={emocao.key}
            d={path(emocao.key)}
            fill="none"
            stroke={emocao.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}

        {registros.map((item, index) => {
          const espacamento = registros.length > 1 ? 500 / (registros.length - 1) : 0;

          return (
            <text
              key={`${item.data}-${index}`}
              x={40 + index * espacamento}
              y="232"
              textAnchor="middle"
              fontSize="13"
              fill="#64748b"
            >
              {item.data}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function MindMap({ dados }) {
  const nodes = [
    ["Emocoes", dados.emocaoFrequente.label, "top-4 left-1/2 -translate-x-1/2", "green"],
    ["Alunos", `${dados.alunos} perfis`, "top-28 left-4", "violet"],
    ["IA", `${dados.conversasIA} conversas`, "top-28 right-4", "orange"],
    ["Atencao", `${dados.diasAtencao} dias`, "bottom-6 left-4", "pink"],
    ["Alertas", `${dados.alertasAltos} alto risco`, "bottom-6 right-4", "blue"],
  ];

  return (
    <div className="relative min-h-[360px] rounded-[24px] bg-slate-50 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-40">
        <line x1="50%" y1="50%" x2="50%" y2="18%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="18%" y2="36%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="82%" y2="36%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="18%" y2="82%" stroke="#94a3b8" strokeWidth="2" />
        <line x1="50%" y1="50%" x2="82%" y2="82%" stroke="#94a3b8" strokeWidth="2" />
      </svg>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-3xl px-8 py-5 shadow-lg font-semibold z-10">
        Escola
      </div>

      {nodes.map(([title, text, pos, color]) => (
        <Node key={title} title={title} text={text} pos={pos} color={color} />
      ))}
    </div>
  );
}

function Node({ title, text, pos, color }) {
  const colors = {
    green: "bg-green-50 border-green-200 text-green-700",
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    pink: "bg-pink-50 border-pink-200 text-pink-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className={`absolute ${pos} z-10 w-40 rounded-3xl border p-4 text-center shadow-sm ${colors[color]}`}>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs mt-1">{text}</p>
    </div>
  );
}

function DonutChart({ total, totais }) {
  const feliz = calcularPercentual(totais.feliz, total);
  const neutro = calcularPercentual(totais.neutro, total);
  const ansioso = calcularPercentual(totais.ansioso, total);
  const triste = calcularPercentual(totais.triste, total);
  const gradiente =
    total > 0
      ? `conic-gradient(#34d399 0 ${feliz}%, #3b82f6 ${feliz}% ${
          feliz + neutro
        }%, #f59e0b ${feliz + neutro}% ${
          feliz + neutro + ansioso
        }%, #a855f7 ${feliz + neutro + ansioso}% ${
          feliz + neutro + ansioso + triste
        }%)`
      : "conic-gradient(#e5e7eb 0 100%)";

  return (
    <div className="relative w-40 h-40 mx-auto rounded-full" style={{ background: gradiente }}>
      <div className="absolute inset-6 rounded-full bg-white flex flex-col items-center justify-center">
        <strong className="text-2xl text-slate-800">{total}</strong>
        <span className="text-xs text-slate-500">Check-ins</span>
      </div>
    </div>
  );
}

function Resumo({ color, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-slate-600">
        <span className={`w-3 h-3 rounded-full ${color}`} />
        {label}
      </span>

      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

function Insight({ text }) {
  return (
    <p className="text-slate-500 text-sm leading-relaxed">
      <span className="text-blue-600 font-semibold">+</span> {text}
    </p>
  );
}

function Atividade({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h3 className="font-medium text-slate-800 text-sm">{title}</h3>
        <p className="text-slate-500 text-xs">{text}</p>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

export default Relatorios;
