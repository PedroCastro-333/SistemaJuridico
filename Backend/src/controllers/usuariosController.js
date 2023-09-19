const Usuarios = require("../models/usuariosModel");

module.exports = {
	// READ: Obtém uma lista de advogados com base em filtros
	async read(req, res) {
		try {
			const filtros = req.body;
			const usuarios = await Usuarios.find(filtros);
			res.status(200).json(usuarios);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar usuario." });
		}
	},

	async readPorId(req, res) {
		const { id } = req.params;
		try {
			const usuario = await Usuarios.findById(id);
			if (usuario) {
				res.status(200).json(usuario);
			} else {
				res.status(404).json({ message: "usuario não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao buscar usuario por ID." });
		}
	},

	// CREATE: Cria um novo advogado
	async create(req, res) {
		try {
			const newUsuarioData = req.body;
			const newUsuario = await Usuarios.create(newUsuarioData);
			res.status(200).json(newUsuario);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao criar usuario." });
		}
	},

	// DELETE: Exclui um advogado com base no ID
	async delete(req, res) {
		try {
			const { id } = req.params;
			const usuarioDelete = await Usuarios.findByIdAndDelete(id);
			if (usuarioDelete) {
				res.json(usuarioDelete);
			} else {
				res.status(404).json({ error: "Usuario não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao excluir usuario." });
		}
	},

	// UPDATE: Atualiza um advogado com base no ID
	async update(req, res) {
		const { id } = req.params;
		const updatedClienteData = req.body;
		try {
			const updatedCliente = await Usuarios.findByIdAndUpdate(
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
