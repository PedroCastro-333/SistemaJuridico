# Documentação do Sistema de Gerenciamento Jurídico

## Introdução

Esta é a documentação do Sistema de Gerenciamento Jurídico, uma aplicação web que permite o gerenciamento de advogados, clientes, processos e transações financeiras relacionadas a escritórios de advocacia.

## Tabela de Conteúdo

1. Requisitos do Sistema
2. Configuração do Ambiente
3. Executando a Aplicação
4. Estrutura de Diretórios
5. API Endpoints
   5.1 Advogados
   5.2 Clientes
   5.3 Processos
   5.4 Transações Financeiras

## 1. Requisitos do Sistema

Para executar o Sistema de Gerenciamento Jurídico, você precisará ter os seguintes requisitos em seu ambiente:

- Node.js (v14 ou superior)
- MongoDB (ou outra base de dados compatível)

## 2. Configuração do Ambiente

Clone este repositório para o seu ambiente local:

```bash
git clone https://github.com/seu-usuario/sistema-gerenciamento-juridico.git
```

Navegue até o diretório do projeto:

```bash
cd sistema-gerenciamento-juridico
```

Instale as dependências do projeto:

```bash
npm install
```

Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

```env
# Configurações do MongoDB
MONGODB_URI=URL_DO_MONGODB

# Configurações do servidor
PORT=3333
```

Certifique-se de substituir `URL_DO_MONGODB` pela URL do seu servidor MongoDB.

## 3. Executando a Aplicação

Para iniciar a aplicação, execute o seguinte comando:

```bash
npm start
```

A aplicação estará disponível em http://localhost:3333 por padrão.

## 4. Estrutura de Diretórios

A estrutura de diretórios do projeto é organizada da seguinte forma:

```
sistema-gerenciamento-juridico/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── config/
  ├── app.js
  ├── server.js
  └── ...
```

- `controllers/`: Contém os controladores para gerenciar dados.
- `models/`: Contém os modelos de dados do MongoDB.
- `routes/`: Contém as rotas da API.
- `config/`: Contém a configuração do banco de dados e outras configurações.
- `app.js`: Arquivo principal da aplicação.
- `server.js`: Arquivo de inicialização do servidor.

## 5. API Endpoints

A API do Sistema de Gerenciamento Jurídico fornece endpoints para gerenciar advogados, clientes, processos e transações financeiras. Abaixo estão os principais endpoints e suas operações:

### 5.1 Advogados

- `POST /advogados`: Obtém uma lista de advogados com base em filtros.
- `POST /advogados/novo`: Cria um novo advogado.
- `DELETE /advogados/:id`: Exclui um advogado com base no ID.
- `POST /advogados/:id`: Atualiza um advogado com base no ID.

### 5.2 Clientes

- `POST /clientes`: Obtém uma lista de clientes com base em filtros.
- `GET /clientes/:id`: Obtém um cliente específico por ID.
- `POST /clientes/novo`: Cria um novo cliente.
- `DELETE /clientes/:id`: Exclui um cliente com base no ID.
- `PUT /clientes/:id`: Atualiza um cliente com base no ID.

### 5.3 Processos

- `POST /processos`: Obtém uma lista de processos com base em filtros.
- `GET /processos/:id`: Obtém um processo específico por ID.
- `POST /processos/novo`: Cria um novo processo.
- `PUT /processos/:id`: Atualiza um processo com base no ID.
- `DELETE /processos/:id`: Exclui um processo com base no ID.

### 5.4 Transações Financeiras

- `POST /financeiro`: Obtém uma lista de transações financeiras com base em filtros.
- `GET /financeiro/:id`: Obtém uma transação financeira específica por ID.
- `POST /financeiro/novo`: Cria uma nova transação financeira.
- `PUT /financeiro/:id`: Atualiza uma transação financeira com base no ID.

Esta documentação básica fornece uma visão geral do sistema e dos principais endpoints da API. Você pode explorar mais detalhes das operações e endpoints nos arquivos de controle e rotas fornecidos no projeto.

Lembre-se de personalizar e expandir esta documentação conforme necessário para atender às especificações do seu projeto.
