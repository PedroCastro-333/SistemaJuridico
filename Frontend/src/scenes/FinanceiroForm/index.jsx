import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	useTheme,
	Select,
	MenuItem,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { tokens } from "../../Theme";
import api from "../../services/api";

export default () => {
	// Obtenha o tema e as cores do tema atual
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	// Verifique se a tela é maior que 600px (responsividade)
	const isNonMobile = useMediaQuery("(min-width:600px)");

	// Estado para armazenar os dados da nova transação
	const [newTransacao, setNewTransacao] = useState({
		clienteId: " ",
		valor: 0,
		dataVencimento: "",
		pago: false,
		processo: "",
		descricao: "",
		metodoPagamento: " ",
	});

	// Estado para armazenar os clientes
	const [clientes, setClientes] = useState([]);

	// Função para buscar os clientes da API
	const getCliente = async () => {
		const res = await api.post("usuarios", { cargo: "Cliente" });
		setClientes(res.data);
	};

	// Efeito para buscar os clientes ao montar o componente
	useEffect(() => {
		getCliente();
	}, []);

	// Função para lidar com o envio do formulário
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			const parcelasTotais = newTransacao.parcela;
			const mesInicio = new Date(
				newTransacao.dataVencimento.split("/").reverse().join("-")
			);
			const totalParcelas = parseInt(parcelasTotais);

			for (let i = 1; i <= totalParcelas; i++) {
				// Clona a nova transação para criar uma nova instância
				const novaTransacao = { ...newTransacao };

				// Calcula a nova data de vencimento (mês seguinte)
				const novaData = new Date(mesInicio);
				novaData.setMonth(mesInicio.getMonth() + i - 1); // Subtrai 1 para o mês atual

				// Formata a nova data de vencimento de volta para o formato "dd/mm/aaaa"
				const dd = String(novaData.getDate()).padStart(2, "0");
				const mm = String(novaData.getMonth() + 1).padStart(2, "0"); // Adiciona 1 porque o mês começa em 0
				const aaaa = novaData.getFullYear();
				novaTransacao.dataVencimento = `${dd}/${mm}/${aaaa}`;

				// Atualiza o campo de parcelas
				novaTransacao.parcela = `${i}/${totalParcelas}`;

				// Envia a nova transação para o banco de dados
				const res = await api.post("financeiro/novo", novaTransacao);

				// Faça algo com a resposta, se necessário
			}

			// Limpa o estado após o envio bem-sucedido
			setNewTransacao({
				clienteId: "",
				valor: 0,
				dataVencimento: "",
				pago: false,
				processo: "",
				descricao: "",
				metodoPagamento: "",
				parcela: "", // Limpa o campo de parcelas
			});

			alert("Transações cadastradas com sucesso.");
		} catch (err) {
			console.error(err);
			alert("Erro ao cadastrar transações.");
		}
	};

	// Função para lidar com as mudanças nos campos do formulário
	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewTransacao({
			...newTransacao, // Mantém o estado anterior
			[name]: value, // Atualiza a propriedade com o novo valor
		});
	};

	// Função para formatar a data no formato "dd/mm/aaaa"
	const handleData = (e) => {
		const { name, value } = e.target;

		const numericValue = value.replace(/\D/g, "");

		const formattedData = numericValue.replace(
			/^(\d{2})(\d{2})(\d{4})$/,
			"$1/$2/$3"
		);

		setNewTransacao({
			...newTransacao,
			[name]: formattedData,
		});
	};

	return (
		<Box m="20px">
			{/* Componente de cabeçalho */}
			<Header
				title="Cadastrar Transação"
				subtitle="Cadastre uma nova transação."
			/>

			<form onSubmit={handleFormSubmit}>
				{/* Campos do formulário */}
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
					sx={{
						"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
					}}
				>
					<Select
						variant="filled"
						sx={{ gridColumn: "span 2" }}
						type="text"
						label="Filtrar por Cliente"
						value={newTransacao.clienteId}
						name="clienteId"
						onChange={(e) => handleChange(e)}
					>
						<MenuItem value=" ">Selecione um cliente</MenuItem>
						{clientes.map((data) => (
							<MenuItem key={data._id} value={data._id}>
								{data.nome}
							</MenuItem>
						))}
					</Select>
					<TextField
						fullWidth
						variant="filled"
						type="number"
						label="Valor"
						onChange={(e) => handleChange(e)}
						value={newTransacao.valor}
						name="valor"
						sx={{ gridColumn: "span 2" }}
					/>

					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Data de Vencimento"
						onChange={(e) => handleData(e)}
						value={newTransacao.dataVencimento}
						name="dataVencimento"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="number"
						label="Parcelas"
						onChange={(e) => handleChange(e)}
						value={newTransacao.parcela}
						name="parcela"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Descrição"
						onChange={(e) => handleChange(e)}
						value={newTransacao.descricao}
						name="descricao"
						sx={{ gridColumn: "span 2" }}
					/>
					<Select
						sx={{ gridColumn: "span 2" }}
						label="Selecione o mês:"
						variant="filled"
						id="monthSelect"
						name="metodoPagamento"
						value={newTransacao.metodoPagamento}
						onChange={(e) => handleChange(e)}
					>
						<MenuItem value=" ">Método de pagamento</MenuItem>
						<MenuItem value="Pix">Pix</MenuItem>
						<MenuItem value="Boleto">Boleto</MenuItem>
						<MenuItem value="Cartão de Crédito">Cartão de Crédito</MenuItem>
						<MenuItem value="Cartao de Débito">Cartão de Débito</MenuItem>
						<MenuItem value="Depósito">Depósito</MenuItem>
						<MenuItem value="Link de pagamento">Link de pagamento</MenuItem>
					</Select>
				</Box>
				{/* Botão de envio */}
				<Box display="flex" justifyContent="end" mt="20px">
					<Button type="submit" color="secondary" variant="contained">
						Cadastrar nova transação
					</Button>
				</Box>
			</form>
		</Box>
	);
};
