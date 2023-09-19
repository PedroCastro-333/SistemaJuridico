const mongoose = require("mongoose");

// Defina o esquema para as transações financeiras
const FinanceiroSchema = new mongoose.Schema({
	clienteId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "clientes", // Referência à coleção "clientes"
		required: true,
	},
	valor: {
		type: Number,
		required: true,
	},
	dataVencimento: {
		type: String,
		required: true,
	},
	pago: {
		type: Boolean,
		default: false,
	},
	parcela: { type: String },
	descricao: {
		type: String,
		required: true,
	},
	metodoPagamento: {
		type: String,
		required: true,
	},
});

// Exporta o modelo com o nome "financeiro" associado ao esquema
module.exports = mongoose.model("financeiro", FinanceiroSchema);
