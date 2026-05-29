# CheckMente

Plataforma web desenvolvida para acompanhamento emocional, acolhimento digital e apoio preventivo no ambiente escolar.

## Sobre o projeto

O CheckMente é uma aplicação React voltada para o registro, acompanhamento e visualização de dados emocionais de estudantes. O projeto combina telas para alunos e escola, autenticação com Firebase, check-ins emocionais, diário emocional, trilhas de apoio, exercícios de respiração, mensagens, alertas e uma IA de acolhimento chamada Mentinha.

A aplicação atualmente funciona como uma SPA construída com Vite e React Router.

## Funcionalidades implementadas

- Página inicial institucional do CheckMente
- Cadastro de usuários com Firebase Authentication
- Login de usuários com Firebase Authentication
- Criação de perfil de usuário no Firestore
- Diferenciação básica entre conta de aluno e conta de escola
- Layout interno com menu lateral responsivo
- Dashboard do aluno
- Check-in emocional com escolha de emoção, intensidade, contexto e mensagem
- Salvamento de check-ins no Firestore
- IA de acolhimento integrada ao Gemini via variável de ambiente
- Histórico de conversas da IA salvo no Firestore
- Geração de alertas quando a IA identifica risco emocional alto
- Diário emocional com persistência no Firestore
- Mapa emocional baseado nos check-ins
- Trilhas emocionais
- Trilha de ansiedade escolar
- Exercícios de respiração
- Tela de perfil do usuário
- Tela de configurações
- Tela de mensagens
- Área da escola com alunos, alertas e relatórios
- Uso de imagens e vídeos locais em páginas específicas

## Tecnologias utilizadas

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- TailwindCSS
- Lucide React
- Recharts
- Fontsource Inter

### Backend e dados

- Firebase Authentication
- Firebase Firestore
- Gemini API

### Ferramentas de desenvolvimento

- ESLint
- Git
- npm
- Vite Preview

## Estrutura atual do projeto

```txt
CheckMenteR/
  public/
    favicon.svg
    icons.svg
    diario-bg.png
    videos/

  src/
    assets/
      imagens/
      imagens/thumbs/

    components/
      FeatureCard.jsx
      Navbar.jsx

    layouts/
      AppLayout.jsx

    pages/
      Home.jsx

      auth/
        Login.jsx
        Cadastro.jsx

      checkin/
        Checkin.jsx

      configuracao/
        Configuracoes.jsx

      dashboard/
        Dashboard.jsx
        tiposfuncao/
          diario/
            Diario.jsx
          lidarEmocao/
            LidarEmocao.jsx
          MapaEmocional/
            MapEmocional.jsx
          respi/
            respirador.jsx
            tipos/
              Respiracao444.jsx
              RespiracaoRelaxante.jsx
              RelaxamentoProgressivo.jsx
          trilhas/
            Trilhas.jsx
            TrilhaAnsiedadeEscolar.jsx

      perfil/
        Perfil.jsx

      mensage/
        mensagen.jsx

      Aluno/
        ia/
          IA.jsx
        tema2.jsx

      Escola/
        tema.jsx
        alunos/
          Alunos.jsx
        alerta/
          Alertas.jsx
        relatorios/
          Relatorios.jsx

    services/
      firebase.js
      mentinha.js
      promptBase.js

    App.jsx
    main.jsx
    index.css

  eslint.config.js
  index.html
  package.json
  package-lock.json
  vite.config.js