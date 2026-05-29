import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Brain,
  Mail,
  Lock,
  ShieldCheck,
  Heart,
  BarChart3,
} from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../../services/firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha email e senha.");
      return;
    }

    try {
      setCarregando(true);

      const { user } = await signInWithEmailAndPassword(auth, email, senha);

      const usuarioRef = doc(db, "usuarios", user.uid);
      const usuarioSnap = await getDoc(usuarioRef);

      let dadosUsuario;

      if (usuarioSnap.exists()) {
        dadosUsuario = usuarioSnap.data();
      } else {
        dadosUsuario = {
          nome: user.displayName || "Usuário",
          email: user.email,
          role: "aluno",
          funcao: "Aluno",
          telefone: "",
          instituicao: "",
          bio: "",
          status: "Ativo",
          criadoEm: new Date(),
        };

        await setDoc(usuarioRef, dadosUsuario);
      }

      if (dadosUsuario.role === "escola") {
        navigate("/relatorios");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Erro ao entrar: " + error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-[#F3FFFA] via-white to-[#E8F8F0]">
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#5ED6A7] via-[#4CC38A] to-[#38B487] text-white px-16">
        <div className="max-w-xl">
          <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center mb-8">
            <Brain size={42} />
          </div>

          <h1 className="text-6xl font-extrabold leading-tight">
            Bem-vindo ao CheckMente
          </h1>

          <p className="text-xl text-[#E8FFF4] mt-6 leading-relaxed">
            Plataforma inteligente para acompanhar emoções, gerar acolhimento e
            apoiar decisões preventivas no ambiente escolar.
          </p>

          <div className="grid gap-4 mt-10">
            <Info icon={<Heart />} text="Check-in emocional humanizado" />
            <Info icon={<BarChart3 />} text="Painéis e indicadores de bem-estar" />
            <Info icon={<ShieldCheck />} text="Dados protegidos e acesso seguro" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E6F3EC] p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5ED6A7] to-[#38B487] flex items-center justify-center text-white mb-4">
              <Brain size={32} />
            </div>

            <h1 className="text-4xl font-bold">
              Check<span className="text-[#38B487]">Mente</span>
            </h1>

            <p className="text-slate-500 mt-2">Entre na sua conta</p>
          </div>

          <form onSubmit={entrar} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                E-mail
              </label>

              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-4 bg-white focus-within:border-[#38B487]">
                <Mail size={20} className="text-slate-400 mr-3" />

                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Senha
              </label>

              <div className="flex items-center border border-slate-200 rounded-xl px-4 py-4 bg-white focus-within:border-[#38B487]">
                <Lock size={20} className="text-slate-400 mr-3" />

                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className="w-full outline-none"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={carregando}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white font-bold shadow-lg disabled:opacity-60"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-8">
            Não tem conta?{" "}
            <Link to="/cadastro" className="text-[#38B487] font-bold">
              Cadastre-se
            </Link>
          </p>

          <p className="text-center mt-4">
            <Link to="/" className="text-slate-500 text-sm">
              Voltar para início
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-4">
      <div className="text-white">{icon}</div>
      <span className="font-semibold">{text}</span>
    </div>
  );
}

export default Login;