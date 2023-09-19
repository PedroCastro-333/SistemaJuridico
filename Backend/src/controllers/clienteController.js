const Cliente = require("../models/clienteModel");

// Controlador de Clientes
const clienteController = {
	// READ: Obtém uma lista de clientes com base em filtros
	async read(req, res) {
		const filtros = req.body;
		try {
			const clientes = await Cliente.find(filtros);
			res.status(200).json(clientes);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar clientes." });
		}
	},

	// READ POR ID: Obtém um cliente específico por ID
	async readPorId(req, res) {
		const { id } = req.params;
		try {
			const cliente = await Cliente.findById(id);
			if (cliente) {
				res.status(200).json(cliente);
			} else {
				res.status(404).json({ message: "Cliente não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar cliente por ID." });
		}
	}, 

	// CREATE: Cria um novo cliente
	async create(req, res) {
		const newClienteData = req.body;
		try {
			const newCliente = await Cliente.create(newClienteData);
			res.status(201).json(newCliente);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao criar cliente." });
		}
	},

	// DELETE: Exclui um cliente com base no ID
	async delete(req, res) {
		const { id } = req.params;
		try {
			const deletedCliente = await Cliente.findByIdAndDelete(id);
			if (deletedCliente) {
				res.status(204).send();
			} else {
				res.status(404).json({ message: "Cliente não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao deletar cliente." });
		}
	},

	// UPDATE: Atualiza um cliente com base no ID
	async update(req, res) {
		const { id } = req.params;
		const updatedClienteData = req.body;
		try {
			const updatedCliente = await Cliente.findByIdAndUpdate(
				id,
				updatedClienteData,
				{
					new: true,
					runValidators: true,
				}
			);
			if (updatedCliente) {
				res.status(200).json(updatedCliente);
			} else {
				res.status(404).json({ message: "Cliente não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao atualizar cliente." });
		}
	},
};

module.exports = clienteController;
