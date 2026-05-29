import { useMemo, useState } from "react";
import { Search, X, UsersRound } from "lucide-react";
import { iniciais, nomeUsuario } from "./mensagensUtils";

function ListaAlunosModal({ alunos, conversas, onFechar, onSelecionarAluno }) {
  const [busca, setBusca] = useState("");
  const alunosFiltrados = useMemo(() => {
    return alunos.filter((aluno) =>
      nomeUsuario(aluno).toLowerCase().includes(busca.toLowerCase())
    );
  }, [alunos, busca]);

  function jaExisteConversa(alunoId) {
    return conversas.some((conversa) => conversa.alunoId === alunoId);
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Nova conversa</h2>
            <p className="mt-1 text-sm text-slate-500">Selecione um aluno da escola</p>
          </div>

          <button
            onClick={onFechar}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <Search size={19} className="text-slate-400" />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar aluno..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1">
            {alunosFiltrados.length === 0 && (
              <EstadoVazio
                icon={<UsersRound size={28} />}
                titulo="Nenhum aluno encontrado"
                texto="Cadastre alunos com o mesmo escolaId para iniciar conversas."
              />
            )}

            {alunosFiltrados.map((aluno) => (
              <button
                key={aluno.id}
                onClick={() => onSelecionarAluno(aluno)}
                className="flex w-full items-center gap-3 rounded-3xl border border-slate-100 p-4 text-left transition hover:border-[#BFEFD5] hover:bg-[#F7FFFB]"
              >
                <Avatar nome={nomeUsuario(aluno)} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-800">
                    {nomeUsuario(aluno)}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {jaExisteConversa(aluno.id) ? "Abrir conversa existente" : "Criar conversa privada"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ nome }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5ED6A7] to-[#6D5DF6] font-bold text-white shadow-sm">
      {iniciais(nome)}
    </div>
  );
}

function EstadoVazio({ icon, titulo, texto }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAFBF3] text-[#38B487]">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800">{titulo}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{texto}</p>
    </div>
  );
}

export default ListaAlunosModal;
