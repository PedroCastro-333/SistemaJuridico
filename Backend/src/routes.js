const express = require("express");
const routes = express.Router();
const usuariosController = require("./controllers/usuariosController");
const clienteController = require("./controllers/clienteController");
const processoController = require("./controllers/processoController");
const financeiroController = require("./controllers/financieroController");
const authController = require("./controllers/authController");
const eventsController = require("./controllers/eventsController");

// Rotas para Auth
routes.post("/auth", authController.auth); // Rota para listar todos os usuarios

// Rotas para Eventos
routes.post("/eventos", eventsController.read); // Rota para listar todos os usuarios
routes.post("/eventos/novo", eventsController.create); // Rota para criar um novo advogado
routes.delete("/eventos/:id", eventsController.delete); // Rota para obter um usuario por ID
routes.put("/eventos/:id", eventsController.update); // Rota para obter um usuario por ID

// Rotas para Usuarios
routes.post("/usuarios", usuariosController.read); // Rota para listar todos os usuarios
routes.get("/usuarios/:id", usuariosController.readPorId); // Rota para obter um usuario por ID
routes.post("/usuarios/novo", usuariosController.create); // Rota para criar um novo advogado
routes.delete(`/usuarios/:id`, usuariosController.delete); // Rota para excluir um advogado por ID
routes.put("/usuarios/:id", usuariosController.update); // Rota para atualizar um advogado por ID

// Rotas para Clientes
routes.post("/clientes", clienteController.read); // Rota para listar todos os clientes
routes.get("/clientes/:id", clienteController.readPorId); // Rota para obter um cliente por ID
routes.post("/clientes/novo", clienteController.create); // Rota para criar um novo cliente
routes.delete(`/clientes/:id`, clienteController.delete); // Rota para excluir um cliente por ID
routes.put("/clientes/:id", clienteController.update); // Rota para atualizar um cliente por ID

// Rotas para Processos
routes.post("/processos", processoController.read); // Rota para listar todos os processos
routes.get("/processos/:id", processoController.readPorId); // Rota para obter um processo por ID
routes.post("/processos/novo", processoController.create); // Rota para criar um novo processo
routes.put("/processos/:id", processoController.update); // Rota para atualizar um processo por ID
routes.delete("/processos/:id", processoController.delete); // Rota para excluir um processo por ID

// Rotas para Financeiro
routes.post("/financeiro", financeiroController.read); // Rota para listar todos os registros financeiros
routes.get("/financeiro/:id", financeiroController.readPorId); // Rota para obter um registro financeiro por ID
routes.post("/financeiro/novo", financeiroController.create); // Rota para criar um novo registro financeiro
routes.put("/financeiro/:id", financeiroController.update); // Rota para atualizar um registro financeiro por ID

module.exports = routes;
