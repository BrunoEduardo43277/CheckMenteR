import { useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import {
  School,
  Search,
  Eye,
  MoreVertical,
} from "lucide-react";

function Alunos() {
  const [busca, setBusca] = useState("");
  const [turma, setTurma] = useState("Todas");
  const [status, setStatus] = useState("Todos");

  const escola = {
    nome: "Colégio CheckMente — Unidade Centro",
    endereco: "Av. Central, 123 — Centro",
  };

  const alunos = [
    { nome: "Ana Clara Souza", turma: "8º Ano A", checkin: "Hoje, 09:15", status: "Bem" },
    { nome: "Pedro Henrique", turma: "9º Ano B", checkin: "Hoje, 08:47", status: "Atenção" },
    { nome: "Mariana Lima", turma: "7º Ano A", checkin: "Ontem, 16:32", status: "Bem" },
    { nome: "Lucas Gabriel", turma: "8º Ano B", checkin: "Ontem, 14:20", status: "Em risco" },
    { nome: "Juliana Mendes", turma: "9º Ano A", checkin: "23/05/2026", status: "Atenção" },
    { nome: "Rafael Oliveira", turma: "6º Ano B", checkin: "22/05/2026", status: "Bem" },
  ];

  const filtrados = useMemo(() => {
    return alunos.filter((aluno) => {
      const matchBusca = aluno.nome.toLowerCase().includes(busca.toLowerCase());
      const matchTurma = turma === "Todas" || aluno.turma === turma;
      const matchStatus = status === "Todos" || aluno.status === status;

      return matchBusca && matchTurma && matchStatus;
    });
  }, [busca, turma, status]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Alunos
          </h1>

          <p className="text-slate-500 text-base mt-3">
            Acompanhe o bem-estar emocional dos alunos da sua escola.
          </p>
        </div>

        <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <School size={32} />
            </div>

            <div>
              <p className="text-slate-500 text-sm font-medium">
                Escola vinculada
              </p>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
                {escola.nome}
              </h2>

              <p className="text-slate-500 text-base">
                {escola.endereco}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 grid md:grid-cols-3 gap-4">
            <div className="flex items-center border border-slate-200 rounded-2xl px-4 py-3">
              <Search size={20} className="text-slate-400 mr-3" />

              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar aluno pelo nome..."
                className="w-full outline-none text-base"
              />
            </div>

            <select
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className="border border-slate-200 rounded-2xl px-4 py-3 outline-none text-base text-slate-600"
            >
              <option>Todas</option>
              <option>6º Ano B</option>
              <option>7º Ano A</option>
              <option>8º Ano A</option>
              <option>8º Ano B</option>
              <option>9º Ano A</option>
              <option>9º Ano B</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-slate-200 rounded-2xl px-4 py-3 outline-none text-base text-slate-600"
            >
              <option>Todos</option>
              <option>Bem</option>
              <option>Atenção</option>
              <option>Em risco</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="p-5 font-medium">Aluno</th>
                  <th className="p-5 font-medium">Turma</th>
                  <th className="p-5 font-medium">Último check-in</th>
                  <th className="p-5 font-medium">Status emocional</th>
                  <th className="p-5 font-medium text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtrados.map((aluno) => (
                  <tr
                    key={aluno.nome}
                    className="border-t border-slate-100 hover:bg-slate-50/60 transition"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center font-semibold">
                          {aluno.nome.slice(0, 2).toUpperCase()}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {aluno.nome}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 text-slate-600">
                      {aluno.turma}
                    </td>

                    <td className="p-5 text-slate-600">
                      {aluno.checkin}
                    </td>

                    <td className="p-5">
                      <StatusBadge status={aluno.status} />
                    </td>

                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition">
                          <Eye size={18} />
                        </button>

                        <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-white transition">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-slate-100 text-slate-500 text-sm">
            Mostrando {filtrados.length} de {alunos.length} alunos da sua escola
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Bem: "bg-green-50 text-green-600",
    Atenção: "bg-orange-50 text-orange-500",
    "Em risco": "bg-red-50 text-red-500",
  };

  return (
    <span className={`px-4 py-2 rounded-full font-medium text-sm ${styles[status]}`}>
      {status}
    </span>
  );
}

export default Alunos;