const Usuarios = require("../models/usuariosModel");
const jwt = require("jsonwebtoken");

module.exports = {
	// READ: Obtém uma lista de advogados com base em filtros
	async auth(req, res) {
		try {
			const { usuario, senha } = req.body;
			const usuario_r = await Usuarios.findOne({
				usuario: usuario,
				senha: senha,
			});

			let tokenData = { id: usuario_r._id };

			let token = jwt.sign(tokenData, "secret", { expiresIn: "1hr" });

			res
				.status(200)
				.json({ token, cargo: usuario_r.cargo, id: usuario_r._id });
		} catch (error) {
			console.error(error);
			res.status(401).json({ error: "Erro ao buscar usuario." });
		}
	},
};
