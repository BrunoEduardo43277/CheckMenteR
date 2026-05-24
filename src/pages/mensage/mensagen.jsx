import { useMemo, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import {
  MessageCircle,
  Check,
  Bell,
  AlertTriangle,
  Calendar,
  BookOpen,
  Info,
} from "lucide-react";

function Mensagens() {
  const [filtro, setFiltro] = useState("Todas");

  const [mensagens, setMensagens] = useState([
  {
    id: 1,
    titulo: "Atenção: Semana da Saúde Mental",
    descricao:
      "Participe das atividades especiais sobre saúde mental que acontecerão entre os dias 20 e 24 de maio.",
    data: "22/05/2026 • 10:30",
    categoria: "Comunicado",
    tipo: "comunicado",
    lida: false,
  },
]);

  const mensagensFiltradas = useMemo(() => {
    if (filtro === "Todas") return mensagens;
    if (filtro === "Não lidas") return mensagens.filter((m) => !m.lida);
    return mensagens.filter((m) => m.lida);
  }, [mensagens, filtro]);

  const naoLidas = mensagens.filter((m) => !m.lida).length;
  const lidas = mensagens.filter((m) => m.lida).length;

  function marcarComoLida(id) {
    setMensagens((lista) =>
      lista.map((msg) =>
        msg.id === id ? { ...msg, lida: true } : msg
      )
    );
  }

  function marcarTodasComoLidas() {
    setMensagens((lista) =>
      lista.map((msg) => ({
        ...msg,
        lida: true,
      }))
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
              Mensagens
            </h1>

            <p className="text-slate-500 text-base mt-3">
              Avisos e comunicados importantes para você.
            </p>
          </div>

          <button
            onClick={marcarTodasComoLidas}
            className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium flex items-center gap-2 shadow-sm hover:bg-slate-50 transition"
          >
            <Check size={18} />
            Marcar todas como lidas
          </button>
        </div>

        <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 pt-6">
            <div className="flex flex-wrap gap-3">
              <FiltroButton
                ativo={filtro === "Todas"}
                onClick={() => setFiltro("Todas")}
                texto="Todas"
                count={mensagens.length}
              />

              <FiltroButton
                ativo={filtro === "Não lidas"}
                onClick={() => setFiltro("Não lidas")}
                texto="Não lidas"
                count={naoLidas}
              />

              <FiltroButton
                ativo={filtro === "Lidas"}
                onClick={() => setFiltro("Lidas")}
                texto="Lidas"
                count={lidas}
              />
            </div>
          </div>

          <div className="p-6 space-y-4">
            {mensagensFiltradas.map((msg) => (
              <MensagemCard
                key={msg.id}
                mensagem={msg}
                onLer={() => marcarComoLida(msg.id)}
              />
            ))}

            {mensagensFiltradas.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={28} />
                </div>

                <h2 className="text-xl font-semibold text-slate-800">
                  Nenhuma mensagem encontrada
                </h2>

                <p className="text-slate-500 text-base mt-2">
                  Não há mensagens neste filtro no momento.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6 flex items-center justify-center gap-2">
          <Info size={16} />
          Mensagens lidas ficam armazenadas por 30 dias.
        </p>
      </div>
    </AppLayout>
  );
}

function FiltroButton({ ativo, onClick, texto, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-4 border-b-2 font-medium text-sm transition ${
        ativo
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {texto}

      <span
        className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          ativo
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function MensagemCard({ mensagem, onLer }) {
  const config = {
    comunicado: {
      icon: <Bell size={28} />,
      bg: "bg-orange-50",
      text: "text-orange-500",
      badge: "bg-orange-50 text-orange-500 border-orange-100",
    },
    aviso: {
      icon: <AlertTriangle size={28} />,
      bg: "bg-red-50",
      text: "text-red-500",
      badge: "bg-red-50 text-red-500 border-red-100",
    },
    academico: {
      icon: <Calendar size={28} />,
      bg: "bg-green-50",
      text: "text-green-600",
      badge: "bg-green-50 text-green-600 border-green-100",
    },
    atividade: {
      icon: <BookOpen size={28} />,
      bg: "bg-violet-50",
      text: "text-violet-600",
      badge: "bg-violet-50 text-violet-600 border-violet-100",
    },
  };

  const style = config[mensagem.tipo];

  return (
    <div
      className={`rounded-[24px] border p-6 transition ${
        mensagem.lida
          ? "border-slate-100 bg-white"
          : "border-blue-100 bg-blue-50/40"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex gap-5">
          <div
            className={`w-16 h-16 rounded-3xl ${style.bg} ${style.text} flex items-center justify-center shrink-0`}
          >
            {style.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-800">
                {mensagem.titulo}
              </h2>

              {!mensagem.lida && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              )}
            </div>

            <p className="text-slate-500 text-base mt-2 max-w-4xl">
              {mensagem.descricao}
            </p>

            <span
              className={`inline-flex mt-4 px-3 py-1 rounded-full border text-sm font-medium ${style.badge}`}
            >
              {mensagem.categoria}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:items-end gap-4">
          <p className="text-slate-500 text-sm whitespace-nowrap">
            {mensagem.data}
          </p>

          {mensagem.lida ? (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <Check size={18} />
              Lida
            </div>
          ) : (
            <button
              onClick={onLer}
              className="px-5 py-3 rounded-2xl border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition flex items-center gap-2"
            >
              <Check size={18} />
              Marcar como lida
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mensagens;