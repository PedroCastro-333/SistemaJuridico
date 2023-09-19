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
import { format } from "date-fns";

const initialState = {
	dataCadastro: "",
	nome: "",
	rg: "",
	cpf: "",
	email: "",
	dataNascimento: "",
	telefone: "",
	profissao: "",
	estadoCivil: " ",
	cep: "",
	cidade: "",
	endereco: "",
	numero: "",
	complemento: "",
	bairro: "",
	uf: "",
	status: true,
	cargo: "Cliente",
	usuario: "",
	senha: "",
};

export default function ClienteForm() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width:600px)");

	const [newCliente, setNewCliente] = useState(initialState);

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		// Obter a data e hora atual
		const currentDate = new Date();

		// Formatar a data no formato desejado
		const formattedDate = format(currentDate, "dd/MM/yyyy, HH:mm:ss");
		try {
			const res = await api.post("usuarios/novo", {
				...newCliente,
				dataCadastro: formattedDate,
			});
			setNewCliente(initialState);
			alert("Cliente Cadastrado com sucesso.");
		} catch (err) {
			console.error(err);
			alert("Erro ao cadastrar o cliente.");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewCliente({
			...newCliente,
			[name]: value,
		});
	};

	// Função de manipulação de evento personalizada para o campo de telefone
	const handleTelefoneChange = (e) => {
		const { name, value } = e.target;
		// Aqui, você pode aplicar a lógica desejada para formatar o número
		// Por exemplo, formatar para (12)99190-1390
		const formattedValue = value.replace(/\D/g, "");
		const formattedTelefone = `(${formattedValue.slice(
			0,
			2
		)})${formattedValue.slice(2, 7)}-${formattedValue.slice(7, 11)}`;

		setNewCliente({
			...newCliente,
			[name]: formattedTelefone,
		});
	};

	// Função de manipulação de evento personalizada para o campo de CPF
	const handleCpfChange = (e) => {
		const { name, value } = e.target;

		// Remover caracteres não numéricos
		const numericValue = value.replace(/\D/g, "");

		// Aplicar a formatação usando regex
		const formattedCpf = numericValue.replace(
			/(\d{3})(\d{3})(\d{3})(\d{2})/,
			"$1.$2.$3-$4"
		);

		setNewCliente({
			...newCliente,
			[name]: formattedCpf,
		});
	};

	// Função de manipulação de evento personalizada para o campo de RG
	const handleRgChange = (e) => {
		const { name, value } = e.target;

		// Remover caracteres não numéricos
		const numericValue = value.replace(/\D/g, "");

		// Aplicar a formatação usando regex
		const formattedRg = numericValue.replace(
			/(\d{2})(\d{3})(\d{3})(\d{1})/,
			"$1.$2.$3-$4"
		);

		setNewCliente({
			...newCliente,
			[name]: formattedRg,
		});
	};

	// Função de manipulação de evento personalizada para o campo de CEP
	const handleCepChange = (e) => {
		const { name, value } = e.target;
		// Aqui, você pode aplicar a lógica desejada para formatar o número

		const numericValue = value.replace(/\D/g, "");

		const formattedCep = numericValue.replace(
			/^(\d{2})(\d{3})(\d{3})$/,
			"$1.$2-$3"
		); // Remove caracteres não numéricos

		setNewCliente({
			...newCliente,
			[name]: formattedCep,
		});
	};

	const handleEnderecoComplete = () => {
		fetch(`https://brasilapi.com.br/api/cep/v1/${newCliente.cep}`)
			.then((res) => res.json())
			.then((data) =>
				setNewCliente({
					...newCliente,

					cidade: data.city,
					endereco: data.street,
					bairro: data.neighborhood,
					uf: data.state,
				})
			);
	};

	const handleData = (e) => {
		const { name, value } = e.target;

		const numericValue = value.replace(/\D/g, "");

		const formattedData = numericValue.replace(
			/^(\d{2})(\d{2})(\d{4})$/,
			"$1/$2/$3"
		);

		setNewCliente({
			...newCliente,
			[name]: formattedData,
		});
	};

	return (
		<Box m="20px">
			<Header title="Cadastrar cliente" subtitle="Cadastre um novo cliente." />

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
						fullWidth
						variant="filled"
						type="text"
						label="Nome completo"
						onChange={(e) => handleChange(e)}
						value={newCliente.nome}
						name="nome"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="RG"
						onChange={(e) => handleRgChange(e)}
						value={newCliente.rg}
						name="rg"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="CPF"
						onChange={(e) => handleCpfChange(e)}
						value={newCliente.cpf}
						name="cpf"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Data de Nascimento"
						onChange={(e) => handleData(e)}
						value={newCliente.dataNascimento}
						name="dataNascimento"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Email"
						onChange={(e) => handleChange(e)}
						value={newCliente.email}
						name="email"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Telefone"
						onChange={(e) => handleTelefoneChange(e)}
						value={newCliente.telefone}
						name="telefone"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Profissão"
						onChange={(e) => handleChange(e)}
						value={newCliente.profissao}
						name="profissao"
						sx={{ gridColumn: "span 2" }}
					/>
					<Select
						fullWidth
						variant="filled"
						type="text"
						label="Estado Civil"
						onChange={(e) => handleChange(e)}
						value={newCliente.estadoCivil}
						name="estadoCivil"
						sx={{ gridColumn: "span 2" }}
					>
						<MenuItem value=" ">
							<em>Estado Civil</em>
						</MenuItem>
						<MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
						<MenuItem value="Casado(a)">Casado(a)</MenuItem>
						<MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
						<MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
						<MenuItem value="Separado(a) Judicialmente">
							Separado(a) Judicialmente
						</MenuItem>
					</Select>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="CEP"
						onBlur={handleEnderecoComplete}
						onChange={(e) => handleCepChange(e)}
						value={newCliente.cep}
						name="cep"
						sx={{ gridColumn: "span 2" }}
					/>

					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Cidade"
						onChange={(e) => handleChange(e)}
						value={newCliente.cidade}
						name="cidade"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Endereço"
						onChange={(e) => handleChange(e)}
						value={newCliente.endereco}
						name="endereco"
						sx={{ gridColumn: "span 4" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Numero"
						onChange={(e) => handleChange(e)}
						value={newCliente.numero}
						name="numero"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Complemento"
						onChange={(e) => handleChange(e)}
						value={newCliente.complemento}
						name="complemento"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="Bairro"
						onChange={(e) => handleChange(e)}
						value={newCliente.bairro}
						name="bairro"
						sx={{ gridColumn: "span 2" }}
					/>
					<TextField
						fullWidth
						variant="filled"
						type="text"
						label="UF"
						onChange={(e) => handleChange(e)}
						value={newCliente.uf}
						name="uf"
						sx={{ gridColumn: "span 2" }}
					/>
				</Box>
				<Box display="flex" justifyContent="end" mt="20px">
					<Button type="submit" color="secondary" variant="contained">
						Cadastrar novo usuário
					</Button>
				</Box>
			</form>
		</Box>
	);
}
