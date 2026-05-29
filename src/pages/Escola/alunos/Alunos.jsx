import { useEffect, useState } from "react"
import AppLayout from "../../../layouts/AppLayout";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { Users, Search } from "lucide-react";

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const consulta = query(
      collection(db, "usuarios"),
      orderBy("criadoEm", "asc")
    );

    const parar = onSnapshot(consulta, (snapshot) => {
      const lista = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        numero: index + 1,
        ...doc.data(),
      }));

      setAlunos(lista);
    });

    return () => parar();
  }, []);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="w-full max-w-[1500px] mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
            Alunos
          </h1>

          <p className="text-slate-500 mt-3 text-base">
            Veja todos os alunos conectados ao CheckMente.
          </p>
        </div>

        <section className="bg-white rounded-[30px] border border-[#DDEFE7] shadow-sm p-8 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-[#E5F7EE] text-[#2FA36B] flex items-center justify-center">
              <Users size={31} />
            </div>

            <div>
              <p className="text-slate-500 text-sm">Total de alunos</p>

              <h2 className="text-3xl font-semibold text-slate-800">
                {alunos.length} alunos conectados
              </h2>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[30px] border border-[#DDEFE7] shadow-sm overflow-hidden">
          <div className="p-7 border-b border-[#DDEFE7]">
            <div className="relative max-w-xl">
              <Search
                size={22}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Buscar aluno pelo nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full h-16 rounded-2xl border border-[#DDEFE7] pl-14 pr-5 outline-none focus:border-[#4CC38A] text-slate-600 text-base"
              />
            </div>
          </div>

          <div className="divide-y divide-[#EEF6F2]">
            {alunosFiltrados.length === 0 ? (
              <p className="p-8 text-slate-500">
                Nenhum aluno encontrado.
              </p>
            ) : (
              alunosFiltrados.map((aluno) => (
                <div
                  key={aluno.id}
                  className="p-7 flex items-center justify-between hover:bg-[#F8FCFA] transition"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5ED6A7] to-[#38B487] text-white flex items-center justify-center font-semibold text-lg shadow-sm">
                      {aluno.numero}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">
                        {aluno.nome || "Aluno sem nome"}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Conectado ao sistema
                      </p>
                    </div>
                  </div>

                  <span className="px-5 py-2 rounded-full bg-[#E5F7EE] text-[#2FA36B] text-sm font-medium">
                    Ativo
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Alunos;