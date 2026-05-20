import { Link } from "react-router-dom";
import { Brain } from "lucide-react";

function Navbar() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white">
            <Brain size={28} />
          </div>

          <h1 className="text-3xl font-bold">
            Check<span className="text-blue-600">Mente</span>
          </h1>
        </div>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-5 py-3 rounded-xl border border-slate-200 font-semibold hover:bg-slate-100 transition"
          >
            Login
          </Link>

          <Link
            to="/cadastro"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold"
          >
            Cadastro
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Navbar;