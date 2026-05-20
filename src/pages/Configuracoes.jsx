import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Building2,
  Save,
  Trash2,
} from "lucide-react";

import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Configuracoes() {
  const [notificacoes, setNotificacoes] = useState(true);
  const [alertas, setAlertas] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [instituicao, setInstituicao] = useState("Colégio CheckMente");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarConfiguracoes() {
      const user = auth.currentUser;

      if (!user) {
        setCarregando(false);
        return;
      }

      const ref = doc(db, "configuracoes", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const dados = snap.data();

        setInstituicao(dados.instituicao || "Colégio CheckMente");
        setNotificacoes(dados.notificacoes ?? true);
        setAlertas(dados.alertas ?? true);
        setTemaEscuro(dados.temaEscuro ?? false);
      }

      setCarregando(false);
    }

    carregarConfiguracoes();
  }, []);

  async function salvarConfiguracoes(e) {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Usuário não encontrado. Faça login novamente.");
      return;
    }

    try {
      setSalvando(true);

      await setDoc(doc(db, "configuracoes", user.uid), {
        userId: user.uid,
        instituicao,
        notificacoes,
        alertas,
        temaEscuro,
        atualizadoEm: new Date(),
      });

      alert("Configurações salvas com sucesso!");
    } catch (error) {
      alert("Erro ao salvar configurações: " + error.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <AppLayout>
        <p className="text-xl text-slate-500">Carregando configurações...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Settings size={34} />
          </div>

          <div>
            <h1 className="text-5xl font-extrabold">Configurações</h1>
            <p className="text-slate-500 text-xl mt-2">
              Gerencie preferências da plataforma
            </p>
          </div>
        </div>

        <form onSubmit={salvarConfiguracoes} className="grid lg:grid-cols-2 gap-6">
          <Card icon={<Building2 />} title="Instituição">
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Nome da instituição
            </label>

            <input
              value={instituicao}
              onChange={(e) => setInstituicao(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-blue-600"
            />
          </Card>

          <Card icon={<Palette />} title="Aparência">
            <Toggle
              title="Tema escuro"
              description="Ativar modo escuro na plataforma"
              ativo={temaEscuro}
              onClick={() => setTemaEscuro(!temaEscuro)}
            />
          </Card>

          <Card icon={<Bell />} title="Notificações">
            <Toggle
              title="Notificações gerais"
              description="Receber avisos importantes do sistema"
              ativo={notificacoes}
              onClick={() => setNotificacoes(!notificacoes)}
            />

            <Toggle
              title="Alertas emocionais"
              description="Receber alertas quando houver atenção emocional"
              ativo={alertas}
              onClick={() => setAlertas(!alertas)}
            />
          </Card>

          <Card icon={<Shield />} title="Segurança">
            <div className="space-y-4">
              <button
                type="button"
                className="w-full py-4 rounded-2xl border border-slate-200 font-bold hover:bg-slate-50"
              >
                
                Excluir conta
              </button>
            </div>
          </Card>

          <div className="lg:col-span-2 flex justify-end">
            <button
              disabled={salvando}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold flex items-center gap-3 shadow-lg disabled:opacity-60"
            >
              <Save size={20} />
              {salvando ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

function Card({ icon, title, children }) {
  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>

        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function Toggle({ title, description, ativo, onClick }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 border-b border-slate-100 last:border-b-0">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`w-14 h-8 rounded-full p-1 transition ${
          ativo ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full bg-white transition ${
            ativo ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default Configuracoes;