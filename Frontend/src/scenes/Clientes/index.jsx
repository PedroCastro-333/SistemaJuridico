import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	MenuItem,
	Select,
	Button,
	useTheme,
} from "@mui/material";

import { Link } from "react-router-dom";

// Imports de componentes do Material-UI
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DoNotDisturbOffOutlinedIcon from "@mui/icons-material/DoNotDisturbOffOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

// Imports personalizados
import Header from "../../components/Header";
import api from "../../services/api";
import { tokens } from "../../Theme";

export default () => {
	// Função para obter o ID da linha
	const getRowId = (row) => row._id;

	// Lógica para lidar com o clique no botão de cadastro
	const handleCadastroClick = () => {};

	// Tema e cores do Material-UI
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	// Definição das colunas da tabela
	const columns = [
		{
			field: "nome",
			headerName: "Nome",
			flex: 1,
			cellClassName: "name-column--cell",
		},
		{
			field: "cpf",
			headerName: "CPF",
			flex: 1,
		},
		{
			field: "telefone",
			headerName: "Telefone",
			flex: 1,
		},
		{
			field: "email",
			headerName: "E-mail",
			flex: 1,
		},
		{
			field: "status",
			headerName: "Status",
			headerAlign: "center",
			align: "center",
			flex: 1,
			renderCell: ({ row: { status } }) => {
				return (
					<Box
						width="60%"
						m="0 auto"
						p="5px"
						display="flex"
						justifyContent="center"
						backgroundColor={
							status === true ? colors.greenAccent[600] : colors.redAccent[700]
						}
						borderRadius="4px"
					>
						{status === true && <CheckCircleOutlineOutlinedIcon />}
						{status === false && <DoNotDisturbOffOutlinedIcon />}
						<Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
							{status ? "Ativo" : "Inativo"}
						</Typography>
					</Box>
				);
			},
		},
	];

	// Estado para filtros
	const [filtro, setFiltro] = useState({
		nome: "",
		cpf: "",
		telefone: "",
		email: "",
		status: true,
	});

	// Estado para os dados dos clientes
	const [clientes, setClientes] = useState([]);

	// Estado para as linhas selecionadas
	const [selectedRows, setSelectedRows] = useState([]);

	// Efeito para carregar os clientes ao montar o componente
	useEffect(() => {
		getClientes();
	}, []);

	// Função para buscar os clientes na API
	const getClientes = async () => {
		const res = await api.post("/usuarios", { cargo: "Cliente" });
		setClientes(res.data);
	};

	// Função para filtrar os dados
	const filtrarDados = (dados, filtro) => {
		return dados.filter((item) => {
			const nomeEmMinusculo = item.nome.toLowerCase();
			const cpfEmMinusculo = item.cpf.toLowerCase();
			const telefoneEmMinusculo = item.telefone.toLowerCase();
			const emailEmMinusculo = item.email.toLowerCase();
			const statusFiltrado = filtro.status;
			const filtroStatusNulo = statusFiltrado === "todos";

			return (
				nomeEmMinusculo.includes(filtro.nome.toLowerCase()) &&
				cpfEmMinusculo.includes(filtro.cpf.toLowerCase()) &&
				telefoneEmMinusculo.includes(filtro.telefone.toLowerCase()) &&
				emailEmMinusculo.includes(filtro.email.toLowerCase()) &&
				(filtroStatusNulo || item.status === statusFiltrado)
			);
		});
	};

	// Função para mudar o status dos clientes selecionados
	const handleMudarStatus = async () => {
		for (const id of selectedRows) {
			try {
				const res = await api.get(`usuarios/${id}`);
				if (res.status === 200) {
					const cliente = res.data;
					const novoStatus = !cliente.status;
					const update = await api.put(`usuarios/${id}`, {
						status: novoStatus,
					});
				}
				getClientes();
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<Box m="20px">
			<Header title="Clientes" subtitle="Consulte e cadastre seus clientes." />
			<Box
				m="40px 0 0 0"
				height="75vh"
				sx={{
					"& .MuiDataGrid-root": {
						border: "none",
					},
					"& .MuiDataGrid-cell": {
						borderBottom: "none",
					},
					"& .name-column--cell": {
						color: colors.greenAccent[300],
					},
					"& .MuiDataGrid-columnHeaders": {
						backgroundColor: colors.blueAccent[700],
						borderBottom: "none",
					},
					"& .MuiDataGrid-virtualScroller": {
						backgroundColor: colors.primary[400],
					},
					"& .MuiDataGrid-footerContainer": {
						borderTop: "none",
						backgroundColor: colors.blueAccent[700],
					},
					"& .MuiCheckbox-root": {
						color: `${colors.greenAccent[200]} !important`,
					},
					"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
						color: `${colors.grey[100]} !important`,
					},
					height: "100%",
				}}
			>
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
				>
					<TextField
						variant="filled"
						type="text"
						label="Filtrar por Nome"
						name="nome"
						sx={{ gridColumn: "span 1" }}
						value={filtro.nome}
						onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
					/>
					<TextField
						variant="filled"
						type="text"
						label="Filtrar por CPF"
						sx={{ gridColumn: "span 1" }}
						value={filtro.cpf}
						onChange={(e) => setFiltro({ ...filtro, cpf: e.target.value })}
					/>
					<TextField
						variant="filled"
						type="text"
						label="Filtrar por Telefone"
						sx={{ gridColumn: "span 1" }}
						value={filtro.telefone}
						onChange={(e) => setFiltro({ ...filtro, telefone: e.target.value })}
					/>
					<TextField
						variant="filled"
						type="text"
						label="Filtrar por Email"
						sx={{ gridColumn: "span 1" }}
						value={filtro.email}
						onChange={(e) => setFiltro({ ...filtro, email: e.target.value })}
					/>
					<Select
						variant="filled"
						type="text"
						label="Filtrar por Status"
						sx={{ gridColumn: "span 1" }}
						value={filtro.status}
						onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
					>
						<MenuItem value={true}>
							<em>Ativo</em>
						</MenuItem>
						<MenuItem value={false}>Inativo</MenuItem>
						<MenuItem value="todos">Todos</MenuItem>
					</Select>
				</Box>
				<Link to="/cadastrar-cliente">
					<Button
						variant="outlined"
						color="success"
						onClick={handleCadastroClick}
						style={{ margin: "20px" }}
						startIcon={<AddOutlinedIcon />}
					>
						Cadastrar
					</Button>
				</Link>
				<Button
					variant="outlined"
					color="error"
					onClick={handleMudarStatus}
					style={{ margin: "20px" }}
					startIcon={<AutorenewOutlinedIcon />}
				>
					Mudar status
				</Button>
				<DataGrid
					checkboxSelection
					getRowId={getRowId}
					rows={filtrarDados(clientes, filtro)}
					columns={columns}
					onRowSelectionModelChange={(newSelection) => {
						setSelectedRows(newSelection);
					}}
				/>
			</Box>
		</Box>
	);
};
