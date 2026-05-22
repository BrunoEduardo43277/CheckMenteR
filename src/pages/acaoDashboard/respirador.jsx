import AppLayout from "../../layouts/AppLayout";
import { useState } from "react";

import {
    Wind,
    CloudRain,
    Trees,
    Waves,
    Sparkles,
    MessageCircle,
    ArrowLeft,
    ChevronRight,
} from "lucide-react";

function Respirar() {
    const [faseRespiracao, setFaseRespiracao] = useState("inspire");
    const [ativo, setAtivo] = useState(false);

    const navegarPara = (rota) => {
        window.location.href = rota;
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto py-16 px-6 flex flex-col">
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                            Exercícios para relaxar
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <ExercicioCard
                                onClick={() => navegarPara("/respiracao-t1")}
                                icon={<Wind size={24} />}
                                titulo="Respiração 4-4-4"
                                descricao="Inspire por 4s, segure por 4s, expire por 4s"
                                cor="emerald"
                            />

                            <ExercicioCard
                                onClick={() => navegarPara("/sons-relaxantes")}
                                icon={<CloudRain size={24} />}
                                titulo="Sons Relaxantes"
                                descricao="Chuva, floresta, mar ou vento"
                                cor="blue"
                            />

                            <ExercicioCard
                                onClick={() => navegarPara("/pausar-pensamentos")}
                                icon={<Sparkles size={24} />}
                                titulo="Pausar Pensamentos"
                                descricao="Exercício rápido de atenção plena"
                                cor="violet"
                            />

                            <ExercicioCard
                                onClick={() => navegarPara("/mensagem-positiva")}
                                icon={<MessageCircle size={24} />}
                                titulo="Mensagem Positiva"
                                descricao="Frases acolhedoras automáticas"
                                cor="pink"
                            />

                            <ExercicioCard
                                onClick={() => navegarPara("/alongamento-rapido")}
                                icon={<Trees size={24} />}
                                titulo="Alongamento Rápido"
                                descricao="Pequenos movimentos guiados"
                                cor="teal"
                            />

                            <ExercicioCard
                                onClick={() => navegarPara("/meditacao-guiada")}
                                icon={<Waves size={24} />}
                                titulo="Meditação Guiada"
                                descricao="Sessão de 5 minutos para calma"
                                cor="indigo"
                            />
                        </div>
                    </section>

                    <footer className="border-t border-slate-100 pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => navegarPara("/dashboard")}
                                    className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 rounded-full font-medium hover:bg-slate-200 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    Voltar ao Painel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navegarPara("/ia")}
                                    className="flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 transition-colors"
                                >
                                    <MessageCircle size={20} />
                                    Preciso conversar
                                </button>
                            </div>

                            <p className="text-slate-400 text-sm text-center md:text-right">
                                Você não precisa passar por isso sozinho.
                                <br />
                                <span className="text-blue-500 cursor-pointer hover:underline">
                                    Fale com um orientador
                                </span>
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </AppLayout>
    );
}

function ExercicioCard({ icon, titulo, descricao, cor, onClick }) {
    const cores = {
        emerald: "bg-emerald-50 text-emerald-500",
        blue: "bg-blue-50 text-blue-500",
        violet: "bg-violet-50 text-violet-500",
        pink: "bg-pink-50 text-pink-500",
        teal: "bg-teal-50 text-teal-500",
        indigo: "bg-indigo-50 text-indigo-500",
    };

    const bordas = {
        emerald: "hover:border-emerald-200 hover:bg-emerald-50",
        blue: "hover:border-blue-200 hover:bg-blue-50",
        violet: "hover:border-violet-200 hover:bg-violet-50",
        pink: "hover:border-pink-200 hover:bg-pink-50",
        teal: "hover:border-teal-200 hover:bg-teal-50",
        indigo: "hover:border-indigo-200 hover:bg-indigo-50",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group text-left bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer ${bordas[cor]}`}
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${cores[cor]}`}>
                {icon}
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {titulo}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed">
                {descricao}
            </p>

            <div className="mt-4 flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Iniciar</span>
                <ChevronRight size={16} />
            </div>
        </button>
    );
}

export default Respirar;