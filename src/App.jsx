import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Checkin from "./pages/Checkin.jsx";
import Perfil from "./pages/Perfil.jsx";
import IA from "./pages/IA.jsx";
import Relatorios from "./pages/Relatorios.jsx";
import Alertas from "./pages/Alertas.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Configuracoes from "./pages/Configuracoes.jsx";
import Alunos from "./pages/Alunos.jsx";
import Mensagens from "./pages/mensagen.jsx";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/ia" element={<IA />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/mensagens" element={<Mensagens />} />
      </Routes>
    </div>
  );
}

export default App;