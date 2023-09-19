const mongoose = require("mongoose");

// Define o esquema do modelo de cliente
const AgendaSchema = new mongoose.Schema({
	title: String,
	date: String,
	extendedProps: {
		descricao: String,
		tipo: String,
		feito: Boolean,
	},
});

// Exporta o modelo com o nome "clientes" associado ao esquema
module.exports = mongoose.model("agenda", AgendaSchema);
