import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	useTheme,
	TextField,
	MenuItem,
	Select,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../Theme";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DoNotDisturbOffOutlinedIcon from "@mui/icons-material/DoNotDisturbOffOutlined";
import Header from "../../components/Header";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import api from "../../services/api";
import Button from "@mui/material/Button";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useCookies } from "react-cookie";
import "jspdf-autotable";
import ProcessosForm from "../ProcessosForm";
import jsPDF from "jspdf";

export default () => {
	// Função para obter a ID da linha
	const getRowId = (row) => row._id;

	// Função para lidar com o clique no botão de cadastro
	const handleCadastroClick = () => {
		// Adicione aqui a lógica para adicionar uma nova linha aos dados (por exemplo, um formulário de entrada)
		// Após adicionar a nova linha, atualize o estado 'data' para refletir os novos dados
	};

	// Obtenha o tema e as cores do tema atual
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const [open, setOpen] = useState(false);
	// Defina as colunas da tabela
	const columns = [
		{
			field: "numero",
			headerName: "Número",
			flex: 1,
			cellClassName: "name-column--cell",
		},
		{
			field: "autores",
			headerName: "Autores",
			flex: 1,
		},
		{
			field: "reus",
			headerName: "Réus",
			flex: 1,
		},
		{
			field: "tribunal",
			headerName: "Tribunal",
			flex: 0.5,
		},
		{
			field: "materia",
			headerName: "Matéria",
			flex: 0.5,
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

	// Estado para armazenar o filtro
	const [filtro, setFiltro] = useState({
		numero: "",
		tribunal: "",
		materia: "",
		status: true,
	});

	// Estado para armazenar os dados dos processos
	const [processos, setProcessos] = useState([]);

	// Estado para armazenar as linhas selecionadas
	const [selectedRows, setSelectedRows] = useState([]);

	// Efeito para carregar os dados dos processos ao montar o componente
	useEffect(() => {
		getProcessos();
	}, []);

	const handleOpenModal = () => {
		setOpen(true);
	};

	const handleCloseModal = () => {
		setOpen(false);
	};

	// Função para obter os processos da API
	const getProcessos = async () => {
		if (cookie.Cargo != "admin" && cookie.Cargo != "Advogado") {
			try {
				const res = await api.post("processos", {
					clientesId: cookie.Salt,
				});
				setProcessos(res.data);
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				const res = await api.post("processos");
				setProcessos(res.data);
			} catch (err) {
				console.log(err);
			}
		}
	};

	// Função para lidar com a mudança de status dos processos selecionados
	const handleMudarStatus = async () => {
		// Filtrar os dados selecionados com base nas IDs das linhas selecionadas
		for (const id of selectedRows) {
			try {
				const res = await api.get(`processos/${id}`);
				if (res.status === 200) {
					const processo = res.data;

					// Inverta o status
					const novoStatus = !processo.status;

					// Agora, faça uma solicitação PUT para atualizar o status
					const update = await api.put(`processos/${id}`, {
						status: novoStatus,
					});
					getProcessos();
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	// Manipulador de mudança para o campo de número do processo
	const handleNumeroProcesso = (e) => {
		const { name, value } = e.target;

		// Remove todos os caracteres não numéricos
		const numericValue = value.replace(/\D/g, "");

		// Aplicar a formatação usando regex
		const formattedNumero = numericValue.replace(
			/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/,
			"$1-$2.$3.$4.$5.$6"
		);

		setFiltro({ ...filtro, [name]: formattedNumero });
	};

	// Função para filtrar os dados com base no filtro atual
	const filtrarDados = (dados, filtro) => {
		return dados.filter((item) => {
			const numeroEmMinusculo = item.numero.toLowerCase();
			const tribunalEmMinusculo = item.tribunal.toLowerCase();
			const materiaEmMinusculo = item.materia.toLowerCase();

			// Use o valor booleano diretamente para a comparação
			const statusFiltrado = filtro.status;

			// Verifica se o filtro de status é nulo (ou não foi selecionado)
			const filtroStatusNulo = statusFiltrado === "todos";

			return (
				numeroEmMinusculo.includes(filtro.numero.toLowerCase()) &&
				tribunalEmMinusculo.includes(filtro.tribunal.toLowerCase()) &&
				materiaEmMinusculo.includes(filtro.materia.toLowerCase()) &&
				(filtroStatusNulo || item.status === statusFiltrado)
			);
		});
	};

	// Função para gerar um PDF com os dados filtrados
	const generatePDF = () => {
		// Crie um novo objeto jsPDF
		const pdf = new jsPDF();

		// Defina a posição inicial do conteúdo no PDF
		let y = 25;

		// Adicione um título ao relatório
		pdf.setFontSize(16);
		pdf.text("Relatório de Processos", 10, y);
		y += 10;

		// Crie uma matriz de dados da tabela com cabeçalhos
		const tableData = [
			["Número", "Autores", "Réus", "Tribunal", "Matéria", "Status"],
		];

		// Adicione os dados dos processos à matriz da tabela
		const filteredProcesses = filtrarDados(processos, filtro);
		filteredProcesses.forEach((process) => {
			tableData.push([
				process.numero,
				process.autores,
				process.reus,
				process.tribunal,
				process.materia,
				process.status ? "Ativo" : "Inativo",
			]);
		});

		// Crie uma tabela usando o método table do jsPDF
		pdf.autoTable({
			startY: y, // Posição inicial da tabela
			head: tableData.slice(0, 1), // Cabeçalho da tabela
			body: tableData.slice(1), // Corpo da tabela (dados dos processos)
			theme: "striped", // Estilo da tabela (opcional)
		});

		// Salve ou exiba o PDF, dependendo do que você precisa
		// Exemplo: Salvar o PDF com um nome de arquivo
		pdf.save("relatorio_processos.pdf");
	};

	return (
		<Box m="20px">
			<Header
				title="Processos"
				subtitle="Consulte e cadastre seus processos."
			/>
			<Box
				m="40px 0 0 0"
				height="75vh"
				gap="10px"
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
					marginTop: "10px",
				}}
			>
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
					marginBottom={"20px"}
				>
					<TextField
						variant="filled"
						type="text"
						label="Filtrar por Número"
						name="numero"
						sx={{ gridColumn: "span 1" }}
						value={filtro.numero}
						onChange={(e) => handleNumeroProcesso(e)}
					/>
					<TextField
						variant="filled"
						type="text"
						label="Filtrar por Tribunal"
						sx={{ gridColumn: "span 1" }}
						value={filtro.tribunal}
						onChange={(e) => setFiltro({ ...filtro, tribunal: e.target.value })}
					/>
					<TextField
						variant="filled"
						type="text"
						label="Filtrar por Matéria"
						sx={{ gridColumn: "span 1" }}
						value={filtro.materia}
						onChange={(e) => setFiltro({ ...filtro, materia: e.target.value })}
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
				{(cookie.Cargo == "Advogado" || cookie.Cargo == "admin") && (
					<>
						<Button
							variant="outlined"
							color="success"
							onClick={handleOpenModal}
							style={{ margin: "20px" }}
							startIcon={<AddOutlinedIcon />}
						>
							Cadastrar
						</Button>
						<Dialog
							fullWidth
							maxWidth="md"
							open={open}
							onClose={handleCloseModal}
						>
							<DialogContent>
								<ProcessosForm
									onClose={handleCloseModal}
									getProcessos={getProcessos}
								/>
							</DialogContent>
						</Dialog>

						<Button
							variant="outlined"
							color="error"
							onClick={handleMudarStatus}
							style={{ margin: "20px" }}
							startIcon={<AutorenewOutlinedIcon />}
						>
							Mudar status
						</Button>
						<Button
							variant="outlined"
							color="success"
							startIcon={<PictureAsPdfOutlinedIcon />}
							onClick={generatePDF} // Chame a função de geração de PDF ao clicar no botão
							style={{ margin: "20px" }}
						>
							Gerar PDF
						</Button>
					</>
				)}
				<DataGrid
					checkboxSelection
					getRowId={getRowId}
					onRowSelectionModelChange={(newSelection) => {
						setSelectedRows(newSelection);
					}}
					rows={filtrarDados(processos, filtro)}
					columns={columns}
				/>
			</Box>
		</Box>
	);
};
