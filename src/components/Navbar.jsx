import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

function Navbar() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          {/* LOGO */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-sm">
            <Brain size={28} />
          </div>

          {/* NOME */}
          <h1 className="text-3xl font-bold text-slate-900">
            Check<span className="text-emerald-400">Mente</span>
          </h1>

        </div>

        {/* BOTÕES */}
        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-5 py-3 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Login
          </Link>

          <Link
            to="/cadastro"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold shadow-sm hover:opacity-90 transition"
          >
            Cadastro
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Navbar;