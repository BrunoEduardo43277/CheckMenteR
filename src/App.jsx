import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Cadastro from "./pages/auth/Cadastro.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Checkin from "./pages/checkin/Checkin.jsx";
import Diario from "./pages/dashboard/tiposfuncao/diario.jsx";
import Alunos from "./pages/alunos/Alunos.jsx";
import Perfil from "./pages/perfil/Perfil.jsx";
import Configuracoes from "./pages/configuracao/Configuracoes.jsx";
import IA from "./pages/ia/IA.jsx";
import Relatorios from "./pages/relatorios/Relatorios.jsx";
import Mensagens from "./pages/mensage/mensagen.jsx";
import Alertas from "./pages/alerta/Alertas.jsx";
import Respirador from "./pages/dashboard/tiposfuncao/respirador.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/diario" element={<Diario />} />
      <Route path="/alunos" element={<Alunos />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="/ia" element={<IA />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/mensagens" element={<Mensagens />} />
      <Route path="/alertas" element={<Alertas />} />
      <Route path="/respirador" element={<Respirador />} />
    </Routes>
  );
} 