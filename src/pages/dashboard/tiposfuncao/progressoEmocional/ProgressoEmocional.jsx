import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { CalendarDays, Heart, ListChecks, Sparkles } from "lucide-react";
import { auth, db } from "../../../../services/firebase";
import BackButton from "../../../../components/ui/BackButton";

function dataDoCheckin(valor) {
  if (!valor) return null;
  if (typeof valor.toDate === "function") return valor.toDate();

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function chaveDoDia(data) {
  return data.toISOString().slice(0, 10);
}

function calcularDiasSeguidos(checkins) {
  const dias = new Set(
    checkins
      .map((item) => dataDoCheckin(item.criadoEm))
      .filter(Boolean)
      .map(chaveDoDia)
  );

  let sequencia = 0;
  const hoje = new Date();

  for (let i = 0; i < 365; i += 1) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - i);

    if (!dias.has(chaveDoDia(data))) break;
    sequencia += 1;
  }

  return sequencia;
}

function emocaoMaisFrequente(checkins) {
  if (checkins.length === 0) return "Sem dados";

  const contagem = checkins.reduce((acc, item) => {
    const emocao = item.emocao || "Neutro";
    acc[emocao] = (acc[emocao] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0];
}

function gerarRecomendacao(emocao) {
  const texto = String(emocao || "").toLowerCase();

  if (texto.includes("ansioso")) return "Faça um exercício de respiração e registre como se sente depois.";
  if (texto.includes("triste")) return "Escreva no diário e, se puder, converse com a supervisão.";
  if (texto.includes("cansado")) return "Faça uma pausa curta e tente cuidar do seu descanso hoje.";
  if (texto.includes("irritado")) return "Respire por alguns minutos antes de tomar qualquer decisão.";
  if (texto.includes("feliz")) return "Aproveite o momento e registre o que ajudou você a se sentir assim.";

  return "Continue fazendo check-ins para acompanhar sua evolução emocional.";
}

function ProgressoEmocional({ onVoltar }) {
  const [checkins, setCheckins] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const pararAuth = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) {
        setCheckins([]);
        setErro("Você precisa estar logado para ver seu progresso.");
        setCarregando(false);
        return;
      }

      const consulta = query(
        collection(db, "checkins"),
        where("userId", "==", usuario.uid)
      );

      const pararCheckins = onSnapshot(
        consulta,
        (snapshot) => {
          const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          lista.sort((a, b) => {
            const dataA = dataDoCheckin(a.criadoEm)?.getTime() || 0;
            const dataB = dataDoCheckin(b.criadoEm)?.getTime() || 0;
            return dataB - dataA;
          });

          setCheckins(lista);
          setCarregando(false);
        },
        () => {
          setErro("Não foi possível carregar seus check-ins.");
          setCarregando(false);
        }
      );

      return () => pararCheckins();
    });

    return () => pararAuth();
  }, []);

  const resumo = useMemo(() => {
    const ultimaEmocao = checkins[0]?.emocao || "Sem dados";

    return {
      total: checkins.length,
      frequente: emocaoMaisFrequente(checkins),
      diasSeguidos: calcularDiasSeguidos(checkins),
      ultimaEmocao,
      recomendacao: gerarRecomendacao(ultimaEmocao),
    };
  }, [checkins]);

  return (
    <main className="w-full max-w-[1200px] mx-auto px-6">
      <BackButton onClick={onVoltar} className="mb-6">
        Voltar ao painel
      </BackButton>

      <section className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
          Meu Progresso Emocional
        </h1>
        <p className="mt-3 text-base text-slate-500">
          Acompanhe sua evolução com base nos seus check-ins emocionais.
        </p>
      </section>

      {erro && (
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          Carregando progresso emocional...
        </div>
      ) : (
        <>
          <section className="grid gap-5 md:grid-cols-4 mb-8">
            <ResumoCard icon={<ListChecks />} titulo="Check-ins feitos" valor={resumo.total} cor="green" />
            <ResumoCard icon={<Heart />} titulo="Emoção frequente" valor={resumo.frequente} cor="violet" />
            <ResumoCard icon={<CalendarDays />} titulo="Dias seguidos" valor={resumo.diasSeguidos} cor="blue" />
            <ResumoCard icon={<Sparkles />} titulo="Última emoção" valor={resumo.ultimaEmocao} cor="orange" />
          </section>

          <section className="rounded-[32px] border border-[#E8F3ED] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-800">Recomendação simples</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {resumo.recomendacao}
            </p>
          </section>
        </>
      )}
    </main>
  );
}

function ResumoCard({ icon, titulo, valor, cor }) {
  const cores = {
    green: "bg-[#E5F7EE] text-[#2FA36B]",
    violet: "bg-[#EEF2FF] text-[#6D5DF6]",
    blue: "bg-[#EAF6FF] text-[#3693FF]",
    orange: "bg-[#FFF5EB] text-[#FF9B3F]",
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${cores[cor]}`}>
        {icon}
      </div>
      <p className="text-sm text-slate-500">{titulo}</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-800">{valor}</h2>
    </div>
  );
}

export default ProgressoEmocional;


