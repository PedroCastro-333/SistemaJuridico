const Financeiro = require("../models/financeiroModel");

// Controlador Financeiro
const financeiroController = {
	// READ: Obtém uma lista de transações financeiras com base em filtros
	async read(req, res) {
		const filtros = req.body;
		try {
			const transacoesFinanceiras = await Financeiro.find(filtros);
			res.status(200).json(transacoesFinanceiras);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar transações financeiras." });
		}
	},

	// READ POR ID: Obtém uma transação financeira específica por ID
	async readPorId(req, res) {
		const { id } = req.params;
		try {
			const transacaoFinanceira = await Financeiro.findById(id);
			if (transacaoFinanceira) {
				res.status(200).json(transacaoFinanceira);
			} else {
				res.status(404).json({ message: "Transação não encontrada." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar transação por ID." });
		}
	},

	// CREATE: Cria uma nova transação financeira
	async create(req, res) {
		const newTransacaoData = req.body;
		try {
			const newTransacao = await Financeiro.create(newTransacaoData);
			res.status(201).json(newTransacao);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao criar transação financeira." });
		}
	},

	// UPDATE: Atualiza uma transação financeira com base no ID
	async update(req, res) {
		const { id } = req.params;
		const updateFinanceiroData = req.body;
		try {
			const updateFinanceiro = await Financeiro.findByIdAndUpdate(
				id,
				updateFinanceiroData,
				{
					new: true,
					runValidators: true,
				}
			);
			if (updateFinanceiro) {
				res.status(200).json(updateFinanceiro);
			} else {
				res.status(404).json({ message: "Transação não encontrada." });
			}
		} catch (error) {
			console.error(error);
			res
				.status(500)
				.json({ error: "Erro ao atualizar transação financeira." });
		}
	},
};

module.exports = financeiroController;
