const Processo = require("../models/processoModel");

// Controlador Processo
const processoController = {
	// READ: Obtém uma lista de processos com base em filtros
	async read(req, res) {
		const filtros = req.body;
		try {
			const processos = await Processo.find(filtros);
			res.status(200).json(processos);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar processos." });
		}
	},

	// READ POR ID: Obtém um processo específico por ID
	async readPorId(req, res) {
		const { id } = req.params;
		try {
			const processo = await Processo.findById(id);
			if (processo) {
				res.status(200).json(processo);
			} else {
				res.status(404).json({ message: "Processo não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar processo por ID." });
		}
	},

	// CREATE: Cria um novo processo
	async create(req, res) {
		const newProcessoData = req.body;
		try {
			const newProcesso = await Processo.create(newProcessoData);
			res.status(201).json(newProcesso);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao criar processo." });
		}
	},

	// DELETE: Exclui um processo com base no ID
	async delete(req, res) {
		const { id } = req.params;
		try {
			const deletedProcesso = await Processo.findByIdAndDelete(id);
			if (deletedProcesso) {
				res.status(204).send();
			} else {
				res.status(404).json({ message: "Processo não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao deletar processo." });
		}
	},

	// UPDATE: Atualiza um processo com base no ID
	async update(req, res) {
		const { id } = req.params;
		const updatedData = req.body;
		try {
			const updatedProcesso = await Processo.findByIdAndUpdate(
				id,
				updatedData,
				{
					new: true,
					runValidators: true,
				}
			);
			if (updatedProcesso) {
				res.status(200).json(updatedProcesso);
			} else {
				res.status(404).json({ message: "Processo não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao atualizar processo." });
		}
	},
};

module.exports = processoController;
