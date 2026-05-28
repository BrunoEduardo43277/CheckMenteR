import { useEffect, useState } from "react";
import AppLayout from "../../../../layouts/AppLayout";
import { auth, db } from "../../../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Brain, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

function Trilhas() {
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const pararAuth = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) return;

      const idDocumento = `${usuario.uid}_ansiedade-escolar`;
      const referencia = doc(db, "trilhasUsuarios", idDocumento);
      const documento = await getDoc(referencia);

      if (documento.exists()) {
        setProgresso(documento.data().progresso || 0);
      }
    });

    return () => pararAuth();
  }, []);

  const trilha = {
    titulo: "Ansiedade escolar",
    descricao: "Estratégias para lidar com ansiedade e preocupações na escola.",
    modulos: 7,
    progresso,
  };

  return (
    <AppLayout>
      <main className="min-h-screen bg-[#F8FCFA] px-6 py-8">
        <div className="max-w-[1500px] mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                Trilhas emocionais
              </h1>

              <p className="text-slate-500 mt-2 text-base">
                Escolha uma jornada para desenvolver sua inteligência emocional.
              </p>
            </div>

            <div className="relative max-w-md w-full">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                placeholder="Buscar trilhas..."
                className="w-full h-14 rounded-2xl border border-[#DDEFE7] bg-white pl-14 pr-5 outline-none focus:border-[#38B487] text-slate-600"
              />
            </div>
          </header>

          <h2 className="text-2xl font-bold text-slate-900 mb-5">
            Todas as trilhas
          </h2>

          <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Link
              to="/TrilhaAnsiedadeEscolar"
              className="bg-white rounded-[28px] overflow-hidden border border-[#E8F3ED] shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="h-36 bg-[#E5F7EE] text-[#2FA36B] flex items-center justify-center">
                <Brain size={38} />
              </div>

              <div className="p-5">
                <div className="inline-flex items-center gap-2 bg-[#F3FFF9] text-[#2FA36B] px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  <Star size={14} fill="currentColor" />
                  Trilha recomendada
                </div>

                <h3 className="font-bold text-slate-800 text-lg">
                  {trilha.titulo}
                </h3>

                <p className="text-slate-500 text-sm mt-2 leading-relaxed min-h-[62px]">
                  {trilha.descricao}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500 mt-5">
                  <span>{trilha.modulos} módulos</span>
                  <span>{trilha.progresso}%</span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-[#27C4BD] rounded-full transition-all"
                    style={{ width: `${trilha.progresso}%` }}
                  />
                </div>
              </div>
            </Link>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}

export default Trilhas;