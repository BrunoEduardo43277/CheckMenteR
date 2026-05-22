import { Link } from "react-router-dom";
import { ArrowLeft, Wind } from "lucide-react";

function ExplicacaoRespiracao444() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        
        <Link
          to="/respiracao444"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8"
        >
          <ArrowLeft size={20} />
          Voltar
        </Link>

        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-6">
          <Wind size={32} />
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          O que é a Respiração 4-4-4-4?
        </h1>

        <p className="text-slate-500 leading-relaxed mb-6">
          A respiração 4-4-4-4, também chamada de respiração quadrada, é uma
          técnica simples que ajuda a acalmar o corpo, melhorar o foco e reduzir
          a tensão em momentos de ansiedade ou estresse.
        </p>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Etapa numero="1" titulo="Inspire" texto="Puxe o ar pelo nariz por 4 segundos." />
          <Etapa numero="2" titulo="Segure" texto="Segure o ar nos pulmões por 4 segundos." />
          <Etapa numero="3" titulo="Expire" texto="Solte o ar pela boca por 4 segundos." />
          <Etapa numero="4" titulo="Pause" texto="Fique sem puxar ar por 4 segundos." />
        </div>

        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Quando usar?
          </h2>

          <p className="text-slate-500 leading-relaxed">
            Você pode usar essa técnica antes de uma prova, apresentação,
            reunião, momento de nervosismo ou sempre que precisar recuperar a
            calma e a clareza mental.
          </p>
        </div>

        <Link
          to="/respiracao444"
          className="inline-flex items-center justify-center w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
        >
          Começar exercício
        </Link>
      </div>
    </div>
  );
}

function Etapa({ numero, titulo, texto }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold mb-4">
        {numero}
      </div>

      <h3 className="font-bold text-slate-800 mb-2">{titulo}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{texto}</p>
    </div>
  );
}

export default ExplicacaoRespiracao444;