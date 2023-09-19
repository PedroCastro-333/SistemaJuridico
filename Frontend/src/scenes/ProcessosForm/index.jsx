import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	useTheme,
	Select,
	MenuItem,
	InputLabel,
	Checkbox,
	FormControl,
	FormControlLabel,
} from "@mui/material";
import { pink } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { tokens } from "../../Theme";
import api from "../../services/api";
import { format } from "date-fns";

export default ({ onClose, getProcessos }) => {
	// Obtém o tema e cores do tema atual
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width:600px)");

	// Estado para armazenar os dados do novo processo
	const [newProcesso, setNewProcesso] = useState({
		numero: "",
		tribunal: "",
		estado: " ",
		comarca: " ",
		vara: "",
		clientesId: " ",
		autores: [],
		reus: [],
		valorDaCausa: "",
		tipoDeAcao: "",
		materia: " ",
		juiz: "",
		dataDist: "",
		clienteAutor: false,
		advogado: "6503a57375fc0cb088c82a71",
		status: true,
	});

	// Estados para armazenar informações como estados, cidades, clientes e advogados
	const [estados, setEstados] = useState([]);
	const [cidades, setCidades] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [advogados, setAdvogados] = useState([]);

	// Efeitos para carregar informações necessárias ao montar o componente
	useEffect(() => {
		getEstados();
		getClientes();
		getAdvogados();
	}, []);

	useEffect(() => {
		getCidades();
	}, [newProcesso.estado]);

	// Função para obter a lista de estados
	const getEstados = () => {
		fetch(`https://brasilapi.com.br/api/ibge/uf/v1`)
			.then((res) => res.json())
			.then((data) => {
				setEstados(data);
			});
	};

	// Função para obter a lista de cidades com base no estado selecionado
	const getCidades = () => {
		const estadoProcesso = estados.find(
			(estado) => estado.nome == newProcesso.estado
		);

		if (newProcesso.estado != " ") {
			fetch(
				`https://brasilapi.com.br/api/ibge/municipios/v1/${estadoProcesso.sigla}`
			)
				.then((res) => res.json())
				.then((data) => {
					setCidades(data);
				});
		}
	};

	// Função para obter a lista de clientes
	const getClientes = async () => {
		const res = await api.post("usuarios", { cargo: "Cliente" });
		setClientes(res.data);
	};

	// Função para obter a lista de advogados
	const getAdvogados = async () => {
		const res = await api.post("usuarios", { cargo: ["Advogado", "admin"] });
		setAdvogados(res.data);
	};

	// Função para capitalizar a primeira letra de uma palavra
	const capitalizeFirstLetter = (word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	};

	// Função para lidar com o envio do formulário
	const handleFormSubmit = async (e) => {
		e.preventDefault();

		// Obter a data e hora atual
		const currentDate = new Date();

		// Formatar a data no formato desejado
		const formattedDate = format(currentDate, "dd/MM/yyyy, HH:mm:ss");

		try {
			const res = await api.post("processos/novo", {
				...newProcesso,
				dataCadastro: formattedDate,
			});

			setNewProcesso({
				dataCadastro: "",
				numero: "",
				tribunal: "",
				estado: " ",
				comarca: " ",
				vara: "",
				clientesId: " ",
				autores: [],
				reus: [],
				valorDaCausa: "",
				tipoDeAcao: "",
				materia: " ",
				juiz: "",
				dataDist: "",
				clienteAutor: false,
				clienteReu: false,
				advogado: "64d1ac272ebc864b06b0b375",
				status: true,
			});
			alert("Processo Cadastrado com sucesso.");

			onClose();
			getProcessos();
		} catch (err) {
			alert("Erro ao cadastrar o cliente.");
		}
	};

	// Função para lidar com a mudança nos campos do formulário
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		let newValue = value;

		if (name === "tribunal") {
			newValue = value.toUpperCase(); // Converte para maiúsculas se for "tribunal"
		}
		if (name === "comarca") {
			newValue = capitalizeFirstLetter(value);
		}

		if (name === "clienteAutor" && type === "checkbox") {
			// Se o evento for do tipo checkbox e o nome for "clienteAutor"
			const nomeCliente = clientes.find(
				(cliente) => cliente._id == newProcesso.clientesId
			);
			setNewProcesso({
				...newProcesso,
				[name]: checked, // Atualize o estado do checkbox diretamente
				autores: checked ? [nomeCliente.nome] : [], // Preencha com o nome do cliente se o checkbox for marcado
			});
		} else if (name === "clienteReu" && type === "checkbox") {
			// Se o evento for do tipo checkbox e o nome for "clienteAutor"
			const nomeCliente = clientes.find(
				(cliente) => cliente._id == newProcesso.clientesId
			);
			setNewProcesso({
				...newProcesso,
				[name]: checked, // Atualize o estado do checkbox diretamente
				reus: checked ? [nomeCliente.nome] : [], // Preencha com o nome do cliente se o checkbox for marcado
			});
		} else if (name === "autores" || name === "reus") {
			// Se o nome for "autores"
			const autoresArray = value.split(";").map((autor) => {
				return autor.trimLeft(); // Remove apenas os espaços à esquerda
			});
			setNewProcesso({
				...newProcesso,
				[name]: autoresArray,
			});
		} else {
			// Se não for nenhum dos casos acima
			setNewProcesso({
				...newProcesso,
				[name]: newValue, // Atualize outros campos
			});
		}
	};

	// Função para lidar com a formatação da data de distribuição
	const handleData = (e) => {
		const { name, value } = e.target;

		const numericValue = value.replace(/\D/g, "");

		const formattedData = numericValue.replace(
			/^(\d{2})(\d{2})(\d{4})$/,
			"$1/$2/$3"
		);

		setNewProcesso({
			...newProcesso,
			[name]: formattedData,
		});
	};

	// Função para lidar com a formatação do número do processo
	const handleNumeroProcesso = (e) => {
		const { name, value } = e.target;

		// Remove todos os caracteres não numéricos
		const numericValue = value.replace(/\D/g, "");

		// Aplicar a formatação usando regex
		const formattedNumero = numericValue.replace(
			/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/,
			"$1-$2.$3.$4.$5.$6"
		);

		setNewProcesso({ ...newProcesso, [name]: formattedNumero });
	};

	return (
		<Box m="20px">
			<Box display="flex" justifyContent="space-between">
				<Header
					title="Cadastrar Processo"
					subtitle="Cadastre um novo processo."
				/>
				<Button
					variant="outlined"
					onClick={onClose}
					sx={{ height: "30px" }}
					color="error"
				>
					Fechar
				</Button>
			</Box>

			<form onSubmit={handleFormSubmit}>
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
					sx={{
						"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
					}}
				>
					<TextField
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Número do processo"
						onChange={(e) => handleNumeroProcesso(e)}
						value={newProcesso.numero}
						name="numero"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Tribunal"
						onChange={(e) => handleChange(e)}
						value={newProcesso.tribunal}
						name="tribunal"
						sx={{ gridColumn: "span 2" }}
					/>
					<Select
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Estado"
						onChange={(e) => handleChange(e)}
						value={newProcesso.estado}
						name="estado"
						sx={{ gridColumn: "span 2" }}
					>
						<MenuItem value=" ">Selecione um Estado</MenuItem>
						{estados.map((data) => (
							<MenuItem key={data.id} value={data.nome}>
								{data.nome}
							</MenuItem>
						))}
					</Select>
					<Select
						fullWidth
						variant="filled"
						type="text"
						label="Comarca"
						onChange={(e) => handleChange(e)}
						value={newProcesso.comarca}
						name="comarca"
						sx={{ gridColumn: "span 2" }}
					>
						<MenuItem value=" ">Selecione uma Comarca</MenuItem>
						{cidades.map((data) => (
							<MenuItem key={data.codigo_ibge} value={data.nome}>
								{data.nome}
							</MenuItem>
						))}
					</Select>
					<TextField
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Vara"
						onChange={(e) => handleChange(e)}
						value={newProcesso.vara}
						name="vara"
						sx={{ gridColumn: "span 2" }}
					/>
					<Select
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Clientes (fazer select)"
						onChange={(e) => handleChange(e)}
						value={newProcesso.clientesId}
						name="clientesId"
						sx={{ gridColumn: "span 2" }}
					>
						<MenuItem value=" ">Selecione um cliente</MenuItem>
						{clientes.map((data) => (
							<MenuItem key={data._id} value={data._id}>
								{data.nome}
							</MenuItem>
						))}
					</Select>
					<Box sx={{ gridColumn: "span 2" }}>
						<TextField
							fullWidth
							variant="filled"
							type="text"
							label="Autor(es)"
							onChange={(e) => handleChange(e)}
							value={newProcesso.autores.join("; ")}
							name="autores"
						/>
						<FormControlLabel
							control={
								<Checkbox
									sx={{
										color: pink[800],
										"&.Mui-checked": {
											color: pink[600],
										},
									}}
									checked={newProcesso.clienteAutor}
									onChange={(e) => handleChange(e)}
									name="clienteAutor"
								/>
							}
							label="Cliente é autor"
						/>
					</Box>
					<Box sx={{ gridColumn: "span 2" }}>
						<TextField
							autoComplete="off"
							fullWidth
							variant="filled"
							type="text"
							label="Réu(s)"
							onChange={(e) => handleChange(e)}
							value={newProcesso.reus.join("; ")}
							name="reus"
						/>
						<FormControlLabel
							control={
								<Checkbox
									sx={{
										color: pink[800],
										"&.Mui-checked": {
											color: pink[600],
										},
									}}
									checked={newProcesso.clienteReu}
									onChange={(e) => handleChange(e)}
									name="clienteReu"
								/>
							}
							label="Cliente é réu"
						/>
					</Box>
					<TextField
						autoComplete="off"
						fullWidth
						variant="filled"
						type="number"
						label="Valor da Causa"
						onChange={(e) => handleChange(e)}
						value={newProcesso.valorDaCausa}
						name="valorDaCausa"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Tipo de Ação"
						onChange={(e) => handleChange(e)}
						value={newProcesso.tipoDeAcao}
						name="tipoDeAcao"
						sx={{ gridColumn: "span 2" }}
					/>
					<Select
						fullWidth
						variant="filled"
						type="text"
						label="Matéria (TextField)"
						onChange={(e) => handleChange(e)}
						value={newProcesso.materia}
						name="materia"
						sx={{ gridColumn: "span 2" }}
					>
						<MenuItem value=" ">Selecione uma matéria</MenuItem>
						<MenuItem value="Penal">Penal</MenuItem>
						<MenuItem value="Civil">Civil</MenuItem>
						<MenuItem value="Trabalhista">Trabalhista</MenuItem>
					</Select>
					<TextField
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Juiz(a)"
						onChange={(e) => handleChange(e)}
						value={newProcesso.juiz}
						name="juiz"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						autoComplete="off"
						fullWidth
						variant="filled"
						type="text"
						label="Data de distribuição"
						onChange={(e) => handleData(e)}
						value={newProcesso.dataDist}
						name="dataDist"
						sx={{ gridColumn: "span 2" }}
					/>
					<Select
						fullWidth
						variant="filled"
						type="text"
						label="Advogado"
						onChange={(e) => handleChange(e)}
						value={newProcesso.advogado}
						name="advogado"
						sx={{ gridColumn: "span 2" }}
					>
						<MenuItem value="">
							<em>Escolha um advogado principal</em>
						</MenuItem>
						{advogados.map((data) => (
							<MenuItem key={data._id} value={data._id}>
								{data.nome}
							</MenuItem>
						))}
					</Select>
				</Box>
				<Box display="flex" justifyContent="end" mt="20px">
					<Button type="submit" color="success" variant="outlined">
						Cadastrar novo Processo
					</Button>
				</Box>
			</form>
		</Box>
	);
};
