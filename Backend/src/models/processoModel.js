const mongoose = require("mongoose");

// Defina o esquema para os processos
const ProcessoSchema = new mongoose.Schema({
	dataCadastro: {
		type: String,
		required: true,
	},
	numero: {
		type: String,
		required: true,
	},
	tribunal: {
		type: String,
		required: true,
	},
	comarca: {
		type: String,
		required: true,
	},
	vara: {
		type: String,
		required: true,
	},
	clientesId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "clientes", // Referência à coleção "clientes"
		},
	],
	autores: [String],
	reus: [String],
	estado: {
		type: String,
		required: true,
	},
	valorDaCausa: {
		type: String,
		required: true,
	},
	tipoDeAcao: {
		type: String,
		required: true,
	},
	materia: {
		type: String,
		required: true,
	},
	juiz: {
		type: String,
		required: true,
	},
	dataDist: {
		type: String,
		required: true,
	},
	advogado: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "advogados", // Referência à coleção "advogados"
	},
	clienteAutor: {
		type: Boolean,
	},
	clienteReu: {
		type: Boolean,
	},
	status: {
		type: Boolean,
		required: true,
	},
});

// Exporta o modelo com o nome "processos" associado ao esquema
module.exports = mongoose.model("processos", ProcessoSchema);
