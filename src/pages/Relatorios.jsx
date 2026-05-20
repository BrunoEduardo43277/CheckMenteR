import AppLayout from "../layouts/AppLayout";
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

const registros = [
  { data: "01/05", feliz: 7, neutro: 6, ansioso: 4, triste: 2 },
  { data: "05/05", feliz: 6, neutro: 5, ansioso: 3, triste: 2 },
  { data: "09/05", feliz: 5, neutro: 6, ansioso: 7, triste: 3 },
  { data: "13/05", feliz: 7, neutro: 6, ansioso: 4, triste: 2 },
  { data: "17/05", feliz: 8, neutro: 5, ansioso: 3, triste: 2 },
  { data: "21/05", feliz: 6, neutro: 7, ansioso: 4, triste: 2 },
];

const metricas = [
  ["Check-ins realizados", "24", "+18% no período", <Smile />, "blue"],
  ["Média de bem-estar", "7,1/10", "Estável", <Activity />, "green"],
  ["Emoção frequente", "Ansiedade", "35% dos registros", <Brain />, "orange"],
  ["Dias de atenção", "6", "Acompanhamento indicado", <Heart />, "pink"],
];

function Relatorios() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-2">
        <Header />

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
          <Card title="Evolução das emoções">
            <Legend />
            <LineChart />
          </Card>

          <Card title="Mapa emocional">
            <MindMap />
          </Card>
        </div>

        <div className="grid xl:grid-cols-2 gap-6 mb-6">
          <Card title="Resumo emocional">
            <div className="grid md:grid-cols-[170px_1fr] gap-6 items-center">
              <DonutChart />
              <div className="space-y-3">
                <Resumo color="bg-green-400" label="Feliz" value="33%" />
                <Resumo color="bg-blue-500" label="Neutro" value="25%" />
                <Resumo color="bg-orange-400" label="Ansioso" value="25%" />
                <Resumo color="bg-violet-400" label="Triste" value="12%" />
              </div>
            </div>
          </Card>

          <Card title="Insights da IA">
            <div className="space-y-4">
              <Insight text="A ansiedade aumenta em dias de maior carga acadêmica." />
              <Insight text="Momentos de descanso reduzem picos de estresse." />
              <Insight text="O bem-estar melhora em dias com sono adequado." />
            </div>
          </Card>
        </div>

        <Card title="Atividades e bem-estar">
          <div className="grid md:grid-cols-3 gap-4">
            <Atividade icon={<Leaf />} title="Respiração" text="12 sessões" />
            <Atividade icon={<Moon />} title="Meditação" text="6 sessões" />
            <Atividade icon={<BookOpen />} title="Sono" text="Média: 7h" />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function Header() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
          Relatórios Emocionais
        </h1>

        <p className="text-slate-500 text-base mt-3">
          Visualize padrões emocionais, evolução e recomendações inteligentes.
        </p>
      </div>

      <button className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium flex items-center gap-2 shadow-sm">
        <Calendar size={18} />
        01/05/2026 - 22/05/2026
      </button>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        {title}
      </h2>

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
  const items = [
    ["bg-green-400", "Feliz"],
    ["bg-blue-500", "Neutro"],
    ["bg-orange-400", "Ansioso"],
    ["bg-violet-400", "Triste"],
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-2 text-sm text-slate-500">
          <span className={`w-4 h-2 rounded-full ${color}`} />
          {label}
        </span>
      ))}
    </div>
  );
}

function LineChart() {
  const colors = {
    feliz: "#34d399",
    neutro: "#3b82f6",
    ansioso: "#f59e0b",
    triste: "#a855f7",
  };

  function path(campo) {
    return registros
      .map((item, index) => {
        const x = 40 + index * 95;
        const y = 210 - item[campo] * 18;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
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

        {Object.keys(colors).map((campo) => (
          <path
            key={campo}
            d={path(campo)}
            fill="none"
            stroke={colors[campo]}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}

        {registros.map((item, index) => (
          <text
            key={item.data}
            x={40 + index * 95}
            y="232"
            textAnchor="middle"
            fontSize="13"
            fill="#64748b"
          >
            {item.data}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MindMap() {
  const nodes = [
    ["Emoções", "Ansiedade • Feliz", "top-4 left-1/2 -translate-x-1/2", "green"],
    ["Fatores", "Provas e sono", "top-28 left-4", "violet"],
    ["Pensamentos", "Notas e futuro", "top-28 right-4", "orange"],
    ["Necessidades", "Descanso e apoio", "bottom-6 left-4", "pink"],
    ["Estratégias", "Respiração e rotina", "bottom-6 right-4", "blue"],
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
        Você
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

function DonutChart() {
  return (
    <div className="relative w-40 h-40 mx-auto rounded-full bg-[conic-gradient(#34d399_0_33%,#3b82f6_33%_58%,#f59e0b_58%_83%,#a855f7_83%_100%)]">
      <div className="absolute inset-6 rounded-full bg-white flex flex-col items-center justify-center">
        <strong className="text-2xl text-slate-800">24</strong>
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

export default Relatorios;