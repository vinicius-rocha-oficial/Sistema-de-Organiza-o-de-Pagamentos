# Sistema de Organização de Pagamentos

Sistema front-end desenvolvido com React, Vite e TypeScript para gerenciamento de pagamentos.

## 🚀 Tecnologias

- React 18
- Vite
- TypeScript
- React Router DOM
- Axios

## 📦 Instalação

```bash
npm install
```

## 🔧 Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure a URL da API no arquivo `.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 🏃 Executando o projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── ProtectedRoute.tsx
├── contexts/           # Contextos React
│   └── AuthContext.tsx
├── pages/              # Páginas da aplicação
│   ├── Login.tsx
│   └── Dashboard.tsx
├── services/           # Serviços de API
│   ├── api.ts          # Configuração base do Axios
│   ├── storage.ts      # Gerenciamento do localStorage
│   └── api/            # Endpoints específicos
│       ├── auth.ts
│       └── organization-payment.ts
├── types/              # Definições de tipos TypeScript
│   ├── api.d.ts
│   └── index.d.ts
├── utils/              # Utilitários
│   └── error-handler.ts
├── App.tsx             # Componente principal
├── main.tsx            # Entry point
└── index.css           # Estilos globais
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:
- Token de acesso (`access`)
- Token de refresh (`refresh`)

Os tokens são armazenados no `localStorage` e adicionados automaticamente nas requisições através de interceptors do Axios.

## 📝 Funcionalidades

- ✅ Login e autenticação
- ✅ Listagem de pagamentos
- ✅ Tratamento de erros
- ✅ Rotas protegidas
- ✅ Refresh automático de token
- ✅ Logout

## 🛠️ Build

```bash
npm run build
```

## 📄 Licença

Este projeto é privado.
