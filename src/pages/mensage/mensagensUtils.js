import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";

export function normalizarTipo(usuario) {
  const valor = String(usuario?.tipo || usuario?.role || "aluno").toLowerCase();

  if (["supervisor", "professor", "gestor", "escola", "admin"].includes(valor)) {
    return "supervisor";
  }

  return "aluno";
}

export function nomeUsuario(usuario, fallback = "Usuario") {
  return usuario?.nome || usuario?.displayName || usuario?.email || fallback;
}

export function iniciais(nome) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("") || "CM";
}

export function formatarHora(valor) {
  if (!valor) return "";

  const data = typeof valor.toDate === "function" ? valor.toDate() : new Date(valor);
  if (Number.isNaN(data.getTime())) return "";

  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatarDataCurta(valor) {
  if (!valor) return "";

  const data = typeof valor.toDate === "function" ? valor.toDate() : new Date(valor);
  if (Number.isNaN(data.getTime())) return "";

  const hoje = new Date();
  const mesmoDia = data.toDateString() === hoje.toDateString();

  if (mesmoDia) return formatarHora(data);

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function conversaId(alunoId, supervisorId) {
  return `${alunoId}_${supervisorId}`;
}

export async function buscarPerfil(uid, userAuth) {
  const snap = await getDoc(doc(db, "usuarios", uid));

  if (snap.exists()) {
    return { id: uid, ...snap.data() };
  }

  return {
    id: uid,
    nome: userAuth?.displayName || userAuth?.email || "Usuario",
    email: userAuth?.email || "",
    tipo: "aluno",
    escolaId: "geral",
  };
}

export async function buscarUsuariosDaEscola(escolaId) {
  const ref = collection(db, "usuarios");
  const consulta = escolaId ? query(ref, where("escolaId", "==", escolaId)) : query(ref);
  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));
}

export async function criarOuAbrirConversa({ aluno, supervisor, escolaId }) {
  const id = conversaId(aluno.id, supervisor.id);
  const ref = doc(db, "conversas", id);
  const existente = await getDoc(ref);

  if (!existente.exists()) {
    await setDoc(ref, {
      participantes: [aluno.id, supervisor.id],
      alunoId: aluno.id,
      supervisorId: supervisor.id,
      alunoNome: nomeUsuario(aluno, "Aluno"),
      supervisorNome: nomeUsuario(supervisor, "Supervisao"),
      escolaId: escolaId || aluno.escolaId || supervisor.escolaId || "geral",
      ultimaMensagem: "",
      atualizadoEm: serverTimestamp(),
      criadoEm: serverTimestamp(),
    });
  }

  const conversaSnap = await getDoc(ref);
  return { id, ...conversaSnap.data() };
}
