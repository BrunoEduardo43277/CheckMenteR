import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

function RespiracaoRelaxante() {
  const etapas = [
    {
      nome: "Inspirar",
      texto: "Respire lentamente pelo nariz",
      duracao: 5,
      escala: "scale-125",
    },
    {
      nome: "Segurar",
      texto: "Mantenha o ar com calma",
      duracao: 3,
      escala: "scale-110",
    },
    {
      nome: "Expirar",
      texto: "Solte o ar devagar",
      duracao: 6,
      escala: "scale-75",
    },
  ];

  const [rodando, setRodando] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [segundos, setSegundos] = useState(etapas[0].duracao);

  useEffect(() => {
    if (!rodando) return;

    const intervalo = setInterval(() => {
      setSegundos((tempo) => {
        if (tempo > 1) return tempo - 1;

        setEtapaAtual((atual) => {
          const proxima = (atual + 1) % etapas.length;
          setSegundos(etapas[proxima].duracao);
          return proxima;
        });

        return etapas[etapaAtual].duracao;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [rodando, etapaAtual]);

  function reiniciar() {
    setRodando(false);
    setEtapaAtual(0);
    setSegundos(etapas[0].duracao);
  }

  const etapa = etapas[etapaAtual];

  return (
    <div className="min-h-screen bg-[#F8FCFA] flex items-center justify-center px-6">
      <div className="bg-white rounded-[36px] border border-[#E8F3ED] shadow-sm p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          Respiração Relaxante
        </h1>

        <p className="text-slate-500 mt-3">
          Respire lentamente e desacelere seus pensamentos.
        </p>

        <div className="h-80 flex items-center justify-center">
          <div
            className={`
              w-48 h-48
              rounded-full
              bg-gradient-to-br from-[#A8E6CF] to-[#7FD8BE]
              flex items-center justify-center
              text-white
              shadow-2xl
              transition-transform duration-[4000ms] ease-in-out
              ${etapa.escala}
            `}
          >
            <div>
              <p className="text-2xl font-bold">{etapa.nome}</p>
              <p className="text-6xl font-bold mt-2">{segundos}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-slate-800">
          {etapa.texto}
        </h2>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setRodando(!rodando)}
            className="px-7 py-4 rounded-2xl bg-[#38B487] text-white font-semibold flex items-center gap-2"
          >
            {rodando ? <Pause size={20} /> : <Play size={20} />}
            {rodando ? "Pausar" : "Iniciar"}
          </button>

          <button
            onClick={reiniciar}
            className="px-7 py-4 rounded-2xl bg-slate-100 text-slate-600 font-semibold flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RespiracaoRelaxante;