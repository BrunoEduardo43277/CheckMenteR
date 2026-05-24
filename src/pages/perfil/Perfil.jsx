import { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import {
  User,
  Mail,
  Shield,
  Camera,
  Pencil,
  Save,
  X,
  Phone,
  Building2,
  CheckCircle2,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

const initialData = {
  nome: "",
  email: "",
  funcao: "",
  telefone: "",
  instituicao: "",
  bio: "",
};

function Perfil() {
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [userId, setUserId] = useState("");
  const [dados, setDados] = useState(initialData);

  function atualizarCampo(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCarregando(false);
        return;
      }

      setUserId(user.uid);

      const docSnap = await getDoc(doc(db, "usuarios", user.uid));

      if (docSnap.exists()) {
        const data = docSnap.data();

        setDados({
          nome: data.nome || "",
          email: data.email || user.email || "",
          funcao: data.funcao || "Usuário",
          telefone: data.telefone || "",
          instituicao: data.instituicao || "",
          bio: data.bio || "",
        });
      }

      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  async function salvarPerfil(e) {
    e.preventDefault();

    if (!userId) {
      alert("Usuário não encontrado.");
      return;
    }

    await updateDoc(doc(db, "usuarios", userId), dados);

    alert("Perfil atualizado com sucesso!");
    setEditando(false);
  }

  if (carregando) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto px-2">
          <p className="text-slate-500">Carregando perfil...</p>
        </div>
      </AppLayout>
    );
  }

  const infos = [
    {
      icon: <User size={22} />,
      title: "Nome completo",
      value: dados.nome || "Não informado",
    },
    {
      icon: <Building2 size={22} />,
      title: "Instituição",
      value: dados.instituicao || "Não informada",
    },
    {
      icon: <Phone size={22} />,
      title: "Telefone",
      value: dados.telefone || "Não informado",
    },
    {
      icon: <Shield size={22} />,
      title: "Status",
      value: "Ativo",
      green: true,
    },
  ];

  const campos = [
    ["nome", "Nome completo"],
    ["email", "E-mail"],
    ["funcao", "Função"],
    ["telefone", "Telefone"],
    ["instituicao", "Instituição"],
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
              Meu perfil
            </h1>

            <p className="text-slate-500 text-base mt-3">
              Gerencie suas informações pessoais com segurança.
            </p>
          </div>

          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-blue-600 font-medium flex items-center gap-2 shadow-sm hover:bg-blue-50 transition"
            >
              <Pencil size={18} />
              Editar perfil
            </button>
          )}
        </div>

        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="relative h-40 overflow-hidden bg-gradient-to-r from-blue-50 via-violet-50 to-blue-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.18),transparent_30%)]" />
          </div>

          <div className="relative z-10 px-7 md:px-9 pb-8">
            <div className="relative z-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 -mt-16">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="relative w-fit">
                  <div className="w-32 h-32 rounded-[34px] bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center text-4xl font-semibold shadow-xl border-4 border-white">
                    {dados.nome ? dados.nome.slice(0, 2).toUpperCase() : "CM"}
                  </div>

                  <button
                    type="button"
                    className="absolute -right-2 bottom-3 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                <div className="pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-800">
                      {dados.nome || "Usuário CheckMente"}
                    </h2>

                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium flex items-center gap-1">
                      <CheckCircle2 size={15} />
                      Ativo
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 text-slate-500 text-sm">
                    <span className="flex items-center gap-2">
                      <Mail size={17} />
                      {dados.email || "e-mail não informado"}
                    </span>

                    <span className="flex items-center gap-2">
                      <Shield size={17} />
                      {dados.funcao || "Usuário"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-5 mt-8 pt-7 border-t border-slate-100">
              {infos.map((item) => (
                <Info key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <div className="grid xl:grid-cols-[1fr_360px] gap-6">
          <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-7">
            <h2 className="text-xl font-semibold text-slate-800 mb-5">
              Sobre você
            </h2>

            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-slate-500 text-sm mb-2">Bio</p>

              <p className="text-slate-700 text-base leading-relaxed">
                {dados.bio || "Nenhuma informação adicionada."}
              </p>
            </div>
          </section>

          <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-7">
            <h2 className="text-xl font-semibold text-slate-800 mb-5">
              Segurança da conta
            </h2>

            <div className="flex items-center gap-4 bg-green-50 rounded-3xl p-5">
              <div className="w-14 h-14 rounded-2xl bg-white text-green-600 flex items-center justify-center shadow-sm">
                <Shield size={26} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Conta protegida
                </h3>

                <p className="text-slate-500 text-sm">
                  Autenticação gerenciada pelo Firebase.
                </p>
              </div>
            </div>
          </section>
        </div>

        {editando && (
          <section className="bg-white rounded-[28px] border border-slate-200 shadow-sm p-7 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Editar informações
                </h2>

                <p className="text-slate-500 text-base mt-1">
                  Atualize seus dados pessoais.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditando(false)}
                className="px-5 py-3 rounded-2xl border border-slate-200 font-medium flex items-center gap-2 hover:bg-slate-50 transition"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>

            <form onSubmit={salvarPerfil} className="grid md:grid-cols-2 gap-6">
              {campos.map(([campo, label]) => (
                <Campo
                  key={campo}
                  label={label}
                  value={dados[campo]}
                  onChange={(valor) => atualizarCampo(campo, valor)}
                />
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Bio
                </label>

                <textarea
                  value={dados.bio}
                  onChange={(e) => atualizarCampo("bio", e.target.value)}
                  placeholder="Escreva uma breve descrição sobre você..."
                  className="w-full min-h-32 rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-blue-500 resize-none text-base"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white font-medium flex items-center gap-2 shadow-lg hover:opacity-95 transition">
                  <Save size={20} />
                  Salvar alterações
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </AppLayout>
  );
}

function Info({ icon, title, value, green }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
          green ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-slate-500 text-sm">{title}</p>

        <p className={`font-medium ${green ? "text-green-600" : "text-slate-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 rounded-2xl border border-slate-200 px-5 outline-none focus:border-blue-500 text-base"
      />
    </div>
  );
}

export default Perfil;