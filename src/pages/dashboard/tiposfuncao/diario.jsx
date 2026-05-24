import { useEffect, useState } from "react";
import AppLayout from "../../../layouts/AppLayout";
import { auth, db } from "../../../services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { BookOpen, Plus, Save, Trash2, Edit3 } from "lucide-react";

function Diario() {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [diarios, setDiarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const usuario = auth.currentUser;

    if (!usuario) return;

    const consulta = query(
      collection(db, "diarios"),
      where("userId", "==", usuario.uid),
      orderBy("criadoEm", "desc")
    );

    const parar = onSnapshot(consulta, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDiarios(lista);
    });

    return () => parar();
  }, []);

  async function salvarDiario(e) {
    e.preventDefault();

    if (!titulo.trim() || !texto.trim()) {
      alert("Preencha o título e o texto do diário.");
      return;
    }

    const usuario = auth.currentUser;

    if (!usuario) {
      alert("Você precisa estar logado.");
      return;
    }

    try {
      setCarregando(true);

      if (editandoId) {
        await updateDoc(doc(db, "diarios", editandoId), {
          titulo,
          texto,
          atualizadoEm: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "diarios"), {
          userId: usuario.uid,
          titulo,
          texto,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
        });
      }

      setTitulo("");
      setTexto("");
      setEditandoId(null);
    } catch (error) {
      alert("Erro ao salvar diário: " + error.message);
    } finally {
      setCarregando(false);
    }
  }

  function editarDiario(diario) {
    setTitulo(diario.titulo);
    setTexto(diario.texto);
    setEditandoId(diario.id);
  }

  async function apagarDiario(id) {
    const confirmar = confirm("Deseja apagar este diário?");

    if (!confirmar) return;

    await deleteDoc(doc(db, "diarios", id));
  }

  function novoDiario() {
    setTitulo("");
    setTexto("");
    setEditandoId(null);
  }

  return (
    <AppLayout>
      <div className="w-full max-w-[1500px] mx-auto px-6">
        <section className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Diário Emocional
          </h1>

          <p className="text-slate-500 mt-3 text-base">
            Escreva sobre seu dia, seus sentimentos e pensamentos.
          </p>
        </section>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          <section className="bg-white rounded-[30px] border border-[#DDEFE7] shadow-sm p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#E5F7EE] text-[#2FA36B] flex items-center justify-center">
                <BookOpen size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                  {editandoId ? "Editar diário" : "Novo diário"}
                </h2>

                <p className="text-slate-500 text-sm">
                  Suas informações ficam salvas com segurança.
                </p>
              </div>
            </div>

            <form onSubmit={salvarDiario} className="space-y-5">
              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Título
                </label>

                <input
                  type="text"
                  placeholder="Ex: Como me senti hoje"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-[#DDEFE7] px-5 outline-none focus:border-[#38B487] text-slate-700"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Escreva seu diário
                </label>

                <textarea
                  placeholder="Conte como foi seu dia..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full min-h-[320px] rounded-2xl border border-[#DDEFE7] px-5 py-4 outline-none focus:border-[#38B487] text-slate-700 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={carregando}
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white font-semibold shadow-md disabled:opacity-60"
                >
                  <Save size={20} />
                  {carregando ? "Salvando..." : editandoId ? "Salvar alteração" : "Salvar diário"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    onClick={novoDiario}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#E5F7EE] text-[#2FA36B] font-semibold"
                  >
                    <Plus size={20} />
                    Novo
                  </button>
                )}
              </div>
            </form>
          </section>

          <aside className="bg-white rounded-[30px] border border-[#DDEFE7] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#DDEFE7]">
              <h2 className="text-2xl font-semibold text-slate-800">
                Meus diários
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Registros salvos no Firebase.
              </p>
            </div>

            <div className="divide-y divide-[#EEF6F2] max-h-[650px] overflow-y-auto">
              {diarios.length === 0 ? (
                <p className="p-6 text-slate-500">
                  Nenhum diário criado ainda.
                </p>
              ) : (
                diarios.map((diario) => (
                  <div key={diario.id} className="p-5 hover:bg-[#F8FCFA] transition">
                    <h3 className="font-semibold text-slate-800">
                      {diario.titulo}
                    </h3>

                    <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                      {diario.texto}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => editarDiario(diario)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E5F7EE] text-[#2FA36B] text-sm font-medium"
                      >
                        <Edit3 size={16} />
                        Editar
                      </button>

                      <button
                        onClick={() => apagarDiario(diario.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Apagar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}

export default Diario;