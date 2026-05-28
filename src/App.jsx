import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Cadastro from "./pages/auth/Cadastro.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Checkin from "./pages/checkin/Checkin.jsx";
import Alunos from "./pages/Escola/alunos/Alunos.jsx";
import Perfil from "./pages/perfil/Perfil.jsx";
import Configuracoes from "./pages/configuracao/Configuracoes.jsx";
import IA from "./pages/ia/IA.jsx";
import Relatorios from "./pages/Escola/relatorios/Relatorios.jsx";
import Mensagens from "./pages/mensage/mensagen.jsx";
import Alertas from "./pages/Escola/alerta/Alertas.jsx";
import Respirador from "./pages/dashboard/tiposfuncao/respi/respirador.jsx";
import Diario from "./pages/dashboard/tiposfuncao/diario/Diario.jsx";
import Trilhas from "./pages/dashboard/tiposfuncao/trilhas/Trilhas.jsx";
import LidarEmocoes from "./pages/dashboard/tiposfuncao/lidarEmocao/LidarEmocao.jsx";
import Respiracao444 from "./pages/dashboard/tiposfuncao/respi/tipos/Respiracao444.jsx";  
import RespiracaoRelaxante from "./pages/dashboard/tiposfuncao/respi/tipos/RespiracaoRelaxante.jsx";
import RelaxamentoProgressivo from "./pages/dashboard/tiposfuncao/respi/tipos/RelaxamentoProgressivo.jsx";
import TrilhaAnsiedadeEscolar from "./pages/dashboard/tiposfuncao/trilhas/TrilhaAnsiedadeEscolar.jsx";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/alunos" element={<Alunos />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="/ia" element={<IA />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/mensagens" element={<Mensagens />} />
      <Route path="/alertas" element={<Alertas />} />
      <Route path="/respirador" element={<Respirador />} />
      <Route path="/diario" element={<Diario />} />
      <Route path="/trilhas" element={<Trilhas />} />
      <Route path="/LidarEmocoes" element={<LidarEmocoes />} />
      <Route path="/Respiracao444" element={<Respiracao444 />} />
      <Route path="/RespiracaoRelaxante" element={<RespiracaoRelaxante />} />
      <Route path="/RelaxamentoProgressivo" element={<RelaxamentoProgressivo />} />
      <Route path="/TrilhaAnsiedadeEscolar" element={<TrilhaAnsiedadeEscolar />} />
    </Routes>
  );
} 
