import AppLayout from "../../../../layouts/AppLayout";
import {
  ArrowLeft,
  Brain,
  Wind,
  BookOpen,
} from "lucide-react";

function LidarEmocoes() {
  return (
    <AppLayout>
      <main className="min-h-screen bg-[#F8FCFA] px-6 py-8">

        <div className="max-w-7xl mx-auto">

          {/* VOLTAR */}
          <button className="
            w-14 h-14
            rounded-2xl
            bg-white
            border border-[#E8F3ED]
            flex items-center justify-center
            shadow-sm
            mb-8
          ">
            <ArrowLeft size={24} className="text-slate-700" />
          </button>

          {/* TOPO */}
          <section className="mb-10">

            <h1 className="
              text-5xl
              font-bold
              tracking-tight
              text-slate-900
            ">
              Lidar com emoções
            </h1>

            <p className="
              text-slate-500
              text-xl
              leading-relaxed
              mt-4
              max-w-3xl
            ">
              Aprenda a entender melhor o que sente e
              desenvolva equilíbrio emocional.
            </p>

          </section>

          {/* CARD PRINCIPAL */}
          <section className="
            bg-white
            border border-[#E8F3ED]
            rounded-[36px]
            shadow-sm
            overflow-hidden
            mb-8
          ">

            <div className="
              grid
              lg:grid-cols-2
              gap-10
              items-center
              p-10
            ">

              {/* TEXTO */}
              <div>

                <h2 className="
                  text-4xl
                  font-bold
                  text-slate-900
                  mb-6
                ">
                  Entenda suas emoções
                </h2>

                <p className="
                  text-slate-500
                  text-xl
                  leading-relaxed
                ">
                  Nem sempre dá para controlar o que sentimos,
                  mas podemos aprender a reconhecer, respirar
                  e escolher melhor como reagir.
                </p>

              </div>

              {/* IMAGEM */}
              <div className="flex justify-center">

                <img
                  src="src/assets/imagens/emocaoprincipal.png"
                  alt="Emoções"
                  className="
                    w-full
                    max-w-md
                    object-contain
                  "
                />

              </div>

            </div>

          </section>

          {/* CARDS */}
          <section className="
            grid
            md:grid-cols-3
            gap-6
          ">

            {/* CARD 1 */}
            <div className="
              bg-white
              border border-[#E8F3ED]
              rounded-[32px]
              overflow-hidden
              shadow-sm
            ">

              <div className="p-6">

                <img
                  src="src/assets/imagens/pensando.png"
                  alt="Reconhecer"
                  className="
                    w-full
                    h-56
                    object-contain
                  "
                />

              </div>

              <div className="px-7 pb-7">

                <div className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#E5F7EE]
                  text-[#27C4BD]
                  flex items-center justify-center
                  mb-5
                ">
                  <Brain size={28} />
                </div>

                <h3 className="
                  text-3xl
                  font-bold
                  text-slate-900
                  mb-3
                ">
                  Reconhecer
                </h3>

                <p className="
                  text-slate-500
                  text-lg
                  leading-relaxed
                ">
                  Identifique o que você está sentindo.
                </p>

              </div>

            </div>

            {/* CARD 2 */}
            <div className="
              bg-white
              border border-[#E8F3ED]
              rounded-[32px]
              overflow-hidden
              shadow-sm
            ">

              <div className="p-6">

                <img
                  src="src/assets/imagens/respirando.png"
                  alt="Respirar"
                  className="
                    w-full
                    h-56
                    object-contain
                  "
                />

              </div>

              <div className="px-7 pb-7">

                <div className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#E5F7EE]
                  text-[#27C4BD]
                  flex items-center justify-center
                  mb-5
                ">
                  <Wind size={28} />
                </div>

                <h3 className="
                  text-3xl
                  font-bold
                  text-slate-900
                  mb-3
                ">
                  Respirar
                </h3>

                <p className="
                  text-slate-500
                  text-lg
                  leading-relaxed
                ">
                  Faça uma pausa e respire com calma.
                </p>

              </div>

            </div>

            {/* CARD 3 */}
            <div className="
              bg-white
              border border-[#E8F3ED]
              rounded-[32px]
              overflow-hidden
              shadow-sm
            ">

              <div className="p-6">

                <img
                  src="src/assets/imagens/escrevendo.png"
                  alt="Escrever"
                  className="
                    w-full
                    h-56
                    object-contain
                  "
                />

              </div>

              <div className="px-7 pb-7">

                <div className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#E5F7EE]
                  text-[#27C4BD]
                  flex items-center justify-center
                  mb-5
                ">
                  <BookOpen size={28} />
                </div>

                <h3 className="
                  text-3xl
                  font-bold
                  text-slate-900
                  mb-3
                ">
                  Escrever
                </h3>

                <p className="
                  text-slate-500
                  text-lg
                  leading-relaxed
                ">
                  Registre seus pensamentos no diário.
                </p>

              </div>

            </div>

          </section>          

        </div>

      </main>
    </AppLayout>
  );
}

export default LidarEmocoes;