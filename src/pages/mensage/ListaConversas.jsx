import { MessageCircle, Loader2 } from "lucide-react";
import { formatarDataCurta, iniciais } from "./mensagensUtils";

function ListaConversas({
  conversas,
  conversaAtiva,
  usuarioAtual,
  carregando,
  onSelecionarConversa,
}) {
  return (
    <aside className="relative border-b border-slate-200 bg-slate-50/70 lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-800">Conversas</h2>
        <p className="mt-1 text-sm text-slate-500">Alunos acompanhados</p>
      </div>

      <div className="max-h-[62vh] overflow-y-auto p-3">
        {carregando && (
          <div className="flex items-center gap-2 rounded-2xl bg-white p-4 text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin" />
            Carregando conversas...
          </div>
        )}

        {!carregando && conversas.length === 0 && (
          <EstadoVazio
            icon={<MessageCircle size={28} />}
            titulo="Nenhuma conversa"
            texto="Clique no botao + para iniciar uma conversa com um aluno."
          />
        )}

        {conversas.map((conversa) => {
          const nome = conversa.alunoNome || "Aluno";
          const ativa = conversaAtiva?.id === conversa.id;
          const minhaUltima = conversa.ultimoAutorId === usuarioAtual?.uid;

          return (
            <button
              key={conversa.id}
              onClick={() => onSelecionarConversa(conversa)}
              className={`mb-2 w-full rounded-3xl border p-4 text-left transition ${
                ativa
                  ? "border-[#BFEFD5] bg-[#EAFBF3] shadow-sm"
                  : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar nome={nome} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate font-semibold text-slate-800">{nome}</h3>
                    <span className="shrink-0 text-xs text-slate-400">
                      {formatarDataCurta(conversa.atualizadoEm)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {conversa.ultimaMensagem
                      ? `${minhaUltima ? "Voce: " : ""}${conversa.ultimaMensagem}`
                      : "Conversa iniciada"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
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

export default ListaConversas;
