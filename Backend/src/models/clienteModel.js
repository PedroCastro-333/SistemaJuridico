const mongoose = require("mongoose");

// Define o esquema do modelo de cliente
const ClienteSchema = new mongoose.Schema({
	dataCadastro: String,
	nome: String,
	rg: String,
	cpf: {
		type: String,
		unique: true, // Isso define o campo 'cpf' como único
	},
	dataNascimento: String,
	estadoCivil: String,
	profissao: String,
	email: String,
	telefone: String,
	endereco: String,
	complemento: String,
	bairro: String,
	cidade: String,
	uf: String,
	cep: String,
	status: Boolean,
});

// Exporta o modelo com o nome "clientes" associado ao esquema
module.exports = mongoose.model("clientes", ClienteSchema);
