const mongoose = require("mongoose");

// Define o esquema do modelo de advogado
const usuarioSchema = new mongoose.Schema({
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
	usuario: String,
	senha: String,
	cargo: String,
});

// Exporta o modelo com o nome "advogados" associado ao esquema
module.exports = mongoose.model("usuarios", usuarioSchema);
