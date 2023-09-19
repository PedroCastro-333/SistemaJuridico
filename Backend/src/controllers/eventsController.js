const Eventos = require("../models/eventsModel");

module.exports = {
	// READ: Obtém uma lista de evento com base em filtros
	async read(req, res) {
		try {
			const eventoLista = await Eventos.find();

			res.status(200).json(eventoLista);
		} catch (error) {
			console.error(error);
			res.status(401).json({ error: "Erro ao buscar eventos." });
		}
	},

	// CREATE: Cria um novo evento
	async create(req, res) {
		const newEventoData = req.body;
		try {
			const newEvento = await Eventos.create(newEventoData);
			res.status(201).json(newEvento);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao criar evento." });
		}
	},

	// DELETE: Exclui um evento com base no ID
	async delete(req, res) {
		const { id } = req.params;
		try {
			const deletedEvento = await Eventos.findByIdAndDelete(id);
			if (deletedEvento) {
				res.status(204);
			} else {
				res.status(404).json({ message: "Evento não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao deletar Eventos." });
		}
	},

	// UPDATE: Atualiza um evento com base no ID
	async update(req, res) {
		const { id } = req.params;
		const updatedEventoData = req.body;
		try {
			const updatedEvento = await Eventos.findByIdAndUpdate(
				id,
				updatedEventoData,
				{
					new: true,
					runValidators: true,
				}
			);
			if (updatedEvento) {
				res.status(200).json(updatedEvento);
			} else {
				res.status(404).json({ message: "Evento não encontrado." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao atualizar Eventos." });
		}
	},
};
