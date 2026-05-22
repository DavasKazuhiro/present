# Present

> Sistema de automação de chamada acadêmica com validação automática de presença.

---

## Sobre o Projeto

Este projeto foi desenvolvido com o objetivo de automatizar o processo de chamada em sala de aula, permitindo a validação de presença dos alunos de forma rápida, prática e eficiente.

A proposta busca automatizar o processo de chamadas para reduzir o tempo gasto com tarefas manuais, otimizando a rotina do professor e garantindo mais tempo hábil entre as aulas.

---

## Funcionalidades

- Registro automático de presença
- Validação de alunos e professores
- Controle de frequência
- Relatórios de presença

---

## Tecnologias Utilizadas

- Front-end:
  - HTML
  - CSS
  - JavaScript
  - React.js

- Back-end:
  - Node.js
  - Express
  - TypeScript

- Banco de Dados:
  - MySQL

---

## Estrutura do Projeto

```bash
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/              # Imagens, fontes, ícones
│   │
│   ├── components/          # Componentes reutilizáveis
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Card/
│   │
│   ├── layout/              # Componentes de estrutura
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   │
│   ├── features/            # Funcionalidades específicas
│   │
│   ├── pages/               # Páginas da aplicação
│   │
│   ├── hooks/               # Custom Hooks
│   │
│   ├── services/            # Chamadas para API
│   │
│   ├── store/               # Gerenciamento de estado global
│   │   ├── context/
│   │   └── reducers/
│   │
│   ├── routes/              # Configuração de rotas
│   │
│   ├── utils/               # Funções utilitárias
│   │
│   ├── styles/              # Estilos globais
│   │
│   ├── config/              # Configurações gerais
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── vite.config.js
└── package.json

backend/
│
├── controllers/
├── routes/
├── package.json
└── tsconfig.json
```

---

## Como Executar o Projeto

### Pré-requisitos

Você precisará ter instalado:

- Git
- Node.js
- MySQL
---

### Clone o repositório

```bash
git clone https://github.com/DavasKazuhiro/present
```

---

### Acesse a pasta do projeto

```bash
cd present
```

---

### Instale as dependências

```bash
npm install
```

---

### Execute o projeto

```bash
npm start
```

---

## Demonstração

```md
![Tela Inicial Professor](.frontend/src/assets/tela-inicial-professor.png)
```
---

## Equipe

| Nome | Função |
|------|---------|
| Davi Kazuhiro | CTO |
| Eduardo Teodoro | CSO |
| Lucas Pelanda | PO |
| Pedro Favero | Tech Lead |

---

## Melhorias Futuras

- Integração com sistema acadêmico
- Aplicativo mobile
- Dashboard administrativo

---