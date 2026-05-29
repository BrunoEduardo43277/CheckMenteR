import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

function RelaxamentoProgressivo() {
  const etapas = [
    {
      nome: "Respire",
      texto: "Respire profundamente",
      duracao: 5,
      escala: "scale-110",
      cor: "from-[#A8E6CF] to-[#7FD8BE]",
    },

    {
      nome: "Relaxe",
      texto: "Solte a tensão dos ombros",
      duracao: 6,
      escala: "scale-95",
      cor: "from-[#B7E3FF] to-[#7DCFFF]",
    },

    {
      nome: "Desacelere",
      texto: "Relaxe lentamente o corpo",
      duracao: 7,
      escala: "scale-75",
      cor: "from-[#DCCBFF] to-[#B69DFF]",
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

      <div className="
        bg-white
        rounded-[36px]
        border border-[#E8F3ED]
        shadow-sm
        p-8
        max-w-xl
        w-full
        text-center
      ">

        <h1 className="text-4xl font-bold text-slate-900">
          Relaxamento Progressivo
        </h1>

        <p className="text-slate-500 mt-3">
          Reduza a tensão corporal e desacelere os pensamentos.
        </p>

        {/* CÍRCULO */}
        <div className="h-80 flex items-center justify-center">

          <div
            className={`
              w-52 h-52
              rounded-full
              bg-gradient-to-br
              ${etapa.cor}
              flex items-center justify-center
              text-white
              shadow-2xl
              transition-all duration-[5000ms] ease-in-out
              ${etapa.escala}
            `}
          >

            <div>

              <p className="text-3xl font-bold">
                {etapa.nome}
              </p>

              <p className="text-7xl font-bold mt-2">
                {segundos}
              </p>

            </div>

          </div>

        </div>

        {/* TEXTO */}
        <h2 className="text-2xl font-semibold text-slate-800">
          {etapa.texto}
        </h2>

        {/* BOTÕES */}
        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={() => setRodando(!rodando)}
            className="
              px-7 py-4
              rounded-2xl
              bg-[#38B487]
              text-white
              font-semibold
              flex items-center gap-2
            "
          >
            {rodando ? <Pause size={20} /> : <Play size={20} />}

            {rodando ? "Pausar" : "Iniciar"}
          </button>

          <button
            onClick={reiniciar}
            className="
              px-7 py-4
              rounded-2xl
              bg-slate-100
              text-slate-600
              font-semibold
              flex items-center gap-2
            "
          >
            <RotateCcw size={20} />
            Reiniciar
          </button>

        </div>

      </div>

    </div>
  );
}

export default RelaxamentoProgressivo;