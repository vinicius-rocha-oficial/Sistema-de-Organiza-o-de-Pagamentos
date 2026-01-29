# 💰 Sistema de Organização de Pagamentos

Aplicação fullstack para controle financeiro pessoal, permitindo que cada usuário gerencie seus próprios pagamentos de forma segura, com autenticação e visualização por dashboard.

O sistema conta com isolamento de dados por usuário, autenticação via JWT e gráficos para acompanhamento financeiro.

## 🚀 Tecnologias

### Front-end

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server rápido
- **TypeScript** - Superset do JavaScript com tipagem estática
- **React Router DOM** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para requisições à API
- **Lucide React** - Biblioteca de ícones moderna e leve
- **Recharts** - Biblioteca de gráficos para React

### Back-end

- **Django** - Framework web Python
- **Django REST Framework** - Framework para construção de APIs REST
- **JWT Authentication** - Autenticação baseada em tokens JWT

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Python 3.8+ (para o back-end)
- Django e Django REST Framework (para o back-end)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd organização_de_pagamento_react
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Executar

### Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

### Build para Produção

Para gerar o build de produção:

```bash
npm run build
```

Para visualizar o build de produção:

```bash
npm run preview
```

### Linting

Para verificar o código com ESLint:

```bash
npm run lint
```

## 🔐 Autenticação e Segurança

- ✅ Autenticação via JWT (Access Token + Refresh Token)
- ✅ Rotas protegidas no front-end
- ✅ Tokens armazenados no localStorage
- ✅ Interceptors do Axios para:
  - Inclusão automática do token nas requisições
  - Refresh automático do token quando expirado
- ✅ Isolamento de dados por usuário (cada usuário acessa apenas seus próprios dados)

## 📝 Funcionalidades

### Autenticação
- ✅ Login e autenticação de usuários
- ✅ Logout seguro
- ✅ Refresh automático de tokens

### Gerenciamento de Pagamentos
- ✅ Cadastro de novos pagamentos
- ✅ Edição de pagamentos existentes
- ✅ Exclusão de pagamentos
- ✅ Listagem de todos os pagamentos do usuário

### Tipos de Pagamento
- ✅ **PIX** - Transferência instantânea
- ✅ **Crédito** - Cartão de crédito
- ✅ **Débito** - Cartão de débito
- ✅ **Dinheiro** - Pagamento em espécie

### Status de Pagamento
- ✅ **Pago** - Pagamento realizado
- ✅ **Pendente** - Pagamento aguardando

### Recursos Avançados
- ✅ Pagamentos parcelados com controle de parcelas
- ✅ Dashboard com gráficos e estatísticas:
  - Gráfico de pizza (Status dos pagamentos)
  - Gráfico de barras (Quantidade de pagamentos)
  - Cards de resumo (Total pago, pendente, crédito e geral)
- ✅ Tema claro/escuro
- ✅ Design responsivo e moderno
- ✅ Tratamento de erros e feedback ao usuário

## 📊 Dashboard

O dashboard possui duas abas principais:

1. **Painel/Gráficos** - Visualização de estatísticas e gráficos dos pagamentos
2. **Controle de Despesas** - Listagem completa de todos os pagamentos

## 🎨 Interface

- Design moderno e intuitivo
- Suporte a tema claro e escuro
- Cards de pagamento com informações detalhadas
- Ícones visuais para cada tipo de pagamento
- Animações e transições suaves

## 🔌 API

A aplicação consome uma API REST com os seguintes endpoints principais:

- `POST /api/auth/login/` - Autenticação de usuário
- `POST /api/auth/refresh/` - Refresh do token
- `GET /api/organization-payment/` - Listar pagamentos
- `POST /api/organization-payment/` - Criar pagamento
- `GET /api/organization-payment/{id}/` - Obter pagamento específico
- `PUT /api/organization-payment/{id}/` - Atualizar pagamento
- `DELETE /api/organization-payment/{id}/` - Excluir pagamento
- `GET /api/organization-payment/stats/` - Obter estatísticas

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── PaymentModal.tsx
├── contexts/           # Contextos React (Theme, Auth)
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
│   ├── Dashboard.tsx
│   └── Login.tsx
├── services/          # Serviços de API
│   └── api/
├── types/             # Definições de tipos TypeScript
└── utils/             # Utilitários
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter ESLint

## 📄 Licença

Este projeto é privado e de uso pessoal.

## 👤 Autor

Desenvolvido para organização e controle de pagamentos pessoais.
