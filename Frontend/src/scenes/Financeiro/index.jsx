import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { parseISO, getYear, getMonth } from "date-fns";
import {
	Box,
	Button,
	Typography,
	TextField,
	useTheme,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
} from "@mui/material";
import { tokens } from "../../Theme";
import Header from "../../components/Header";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import MoneyOffCsredOutlinedIcon from "@mui/icons-material/MoneyOffCsredOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import api from "../../services/api";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

// Dados de exemplo

function FinancialControl() {
	const [totalIncome, setTotalIncome] = useState(0);
	const [incomePorCliente, setIncomePorCliente] = useState(0);
	const [jaPagoPorCliente, setJaPagoPorCliente] = useState(0);
	const [financeiro, setFinanceiro] = useState([]);
	const [filteredRows, setFilteredRows] = useState([]);
	const [selectedMonth, setSelectedMonth] = useState(" ");
	const [selectedRows, setSelectedRows] = useState([]);
	const [clientes, setClientes] = useState([]);
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const currentDate = new Date();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const columns = [
		{ field: "dataVencimento", headerName: "Data", flex: 1 },
		{
			field: "valor",
			headerName: "Valor",
			flex: 1,
			valueFormatter: (params) => {
				const formattedValue = params.value.toFixed(2).replace(".", ",");
				return `R$${formattedValue}`;
			},
		},
		{
			field: "clienteId",
			headerName: "Cliente",
			flex: 2,
			valueGetter: (params) => {
				const clienteId = params.value;
				const cliente = clientes.find((c) => c._id === clienteId);

				if (cliente) {
					return cliente.nome;
				}

				return "Cliente Desconhecido";
			},
		},
		{ field: "descricao", headerName: "Descrição", flex: 2 },
		{ field: "parcela", headerName: "Parcela", flex: 1 },
		{
			field: "pago",
			headerName: "Pago",
			headerAlign: "center",
			align: "center",
			flex: 1,
			renderCell: ({ row: { pago } }) => {
				return (
					<Box
						width="100%"
						m="0 auto"
						p="5px"
						display="flex"
						justifyContent="center"
						backgroundColor={
							pago === true ? colors.greenAccent[600] : colors.redAccent[700]
						}
						borderRadius="4px"
					>
						{pago === true && <PaidOutlinedIcon />}
						{pago === false && <MoneyOffCsredOutlinedIcon />}
						<Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
							{pago ? "Pago" : "Pendente"}
						</Typography>
					</Box>
				);
			},
		},
	];
	const [filtro, setFiltro] = useState({
		pago: false,
		clienteId: " ",
	});

	// Função para buscar a lista de clientes
	const getCliente = async () => {
		const res = await api.post("usuarios", { cargo: "Cliente" });
		setClientes(res.data);
	};

	// Função para buscar dados financeiros
	const getFinanceiro = async () => {
		if (cookie.Cargo != "admin" && cookie.Cargo != "Advogado") {
			try {
				const res = await api.post("financeiro", { clienteId: cookie.Salt });
				setFinanceiro(res.data);
			} catch (err) {
				console.log(err);
			}
		} else {
			try {
				const res = await api.post("financeiro");
				setFinanceiro(res.data);
			} catch (err) {
				console.log(err);
			}
		}
	};

	// Função para obter o ID da linha
	const getRowId = (row) => row._id;

	// Função para lidar com o clique no botão de cadastro
	const handleCadastroClick = () => {
		// Lógica para adicionar nova linha aos dados aqui
		// Atualize o estado 'data' após adicionar a nova linha
	};

	// Função para lidar com o clique no botão de baixa
	const handleBaixa = async () => {
		for (const id of selectedRows) {
			try {
				const res = await api.get(`financeiro/${id}`);
				if (res.status === 200) {
					const transacao = res.data;
					const novoStatus = !transacao.pago;

					const update = await api.put(`financeiro/${id}`, {
						pago: novoStatus,
					});

					console.log(update);
					getFinanceiro();
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	// Função para filtrar dados com base no filtro selecionado
	const filtrarDados = (dados, filtro) => {
		return dados.filter((item) => {
			const idEmMinusculo = item.clienteId.toLowerCase();
			const statusFiltrado = filtro.pago;
			const filtroStatusNulo = statusFiltrado === "todos";

			return (
				(filtro.clienteId === " " ||
					idEmMinusculo.includes(filtro.clienteId.toLowerCase())) &&
				(filtroStatusNulo || item.pago === statusFiltrado)
			);
		});
	};

	// Efeito para buscar dados financeiros e de cliente ao montar o componente
	useEffect(() => {
		getFinanceiro();
		getCliente();
	}, []);

	// Efeito para atualizar os dados filtrados e calculos ao selecionar um mês ou mudar o filtro
	useEffect(() => {
		const filteredData = financeiro.filter((row) => {
			const dateString = row.dataVencimento;
			const parts = dateString.split("/");
			const day = parseInt(parts[0], 10);
			const month = parseInt(parts[1] - 1, 10);
			const year = parseInt(parts[2], 10);

			const rowDate = new Date(year, month, day);
			return (
				getYear(rowDate) === currentDate.getFullYear() &&
				getMonth(rowDate) === parseInt(selectedMonth, 10)
			);
		});

		setFilteredRows(filtrarDados(filteredData, filtro));
		if (selectedMonth === " ") {
			const totalAllIncome = financeiro.reduce((total, row) => {
				if (!row.pago) {
					return total + row.valor;
				}
				return total;
			}, 0);
			setTotalIncome(totalAllIncome);
			setFilteredRows(filtrarDados(financeiro, filtro));
		} else {
			const monthlyIncome = filteredData.reduce((total, row) => {
				if (!row.pago) {
					return total + row.valor;
				}
				return total;
			}, 0);
			setTotalIncome(monthlyIncome);
		}

		if (filtro.clienteId !== " ") {
			const incomePorCliente = financeiro
				.filter((row) => row.clienteId === filtro.clienteId && !row.pago)
				.reduce((total, row) => total + row.valor, 0);

			const totalPagos = financeiro
				.filter((row) => row.pago)
				.reduce((total, row) => total + row.valor, 0);

			setJaPagoPorCliente(totalPagos);
			setIncomePorCliente(incomePorCliente);
		}
	}, [selectedMonth, financeiro, filtro]);

	// Função para lidar com a mudança de mês selecionado
	const handleMonthChange = (event) => {
		setSelectedMonth(event.target.value);
	};

	// Função para obter o nome do cliente com base no ID do cliente
	const nomeCliente = (clienteId) => {
		const cliente1 = clientes.find((c) => c._id === filtro.clienteId);
		return cliente1.nome;
	};

	// Função para gerar um PDF
	const generatePDF = () => {
		const pdf = new jsPDF();
		let y = 25;

		// Adicione um título ao relatório
		pdf.setFontSize(16);
		pdf.text(
			filtro.clienteId === " "
				? "Relatório financeiro"
				: `Relatório financeiro de ${nomeCliente(filtro.clienteId)}`,
			105,
			y,
			null,
			null,
			"center"
		);
		y += 20;

		pdf.setFontSize(12);
		if (filtro.clienteId !== " ") {
			pdf.setTextColor("green");
			pdf.text(
				`Total já pago: R$${jaPagoPorCliente.toFixed(2).replace(".", ",")}`,
				15,
				y
			);
			y += 10;
			pdf.setTextColor("black");
			pdf.text(
				`Total pendente: R$${incomePorCliente.toFixed(2).replace(".", ",")}`,
				15,
				y
			);
			y += 10;
		} else {
			pdf.text(
				`Total a receber: R$${totalIncome.toFixed(2).replace(".", ",")}`,
				15,
				y
			);
			y += 10;
		}

		const tableData = [
			["Data", "Valor", "Cliente", "Descrição", "Parcela", "Status"],
		];

		const filteresTransacoes = filteredRows;
		filteresTransacoes.forEach((process) => {
			const cliente = clientes.find((c) => c._id === process.clienteId);
			const clienteNome = cliente.nome;
			tableData.push([
				process.dataVencimento,
				`R$${process.valor.toFixed(2).replace(".", ",")}`,
				clienteNome,
				process.descricao,
				process.parcela,
				process.pago ? "Pago" : "Pendente",
			]);
		});

		pdf.autoTable({
			startX: 20,
			startY: y,
			head: tableData.slice(0, 1),
			body: tableData.slice(1),
			theme: "striped",
		});

		pdf.save(
			filtro.clienteId === " "
				? "relatório_financeiro.pdf"
				: `relatório_financeiro_${nomeCliente(filtro.clienteId)}.pdf`
		);
	};

	return (
		<Box m="20px">
			<Header
				title="Financeiro"
				// subtitle="Consulte sua situação financeira no escritório."
			/>
			<h2>
				{filtro.clienteId != " "
					? `Total em aberto para de ${nomeCliente(
							filtro.clienteId
					  )}: R$${incomePorCliente.toFixed(2).replace(".", ",")}`
					: selectedMonth == " "
					? `Total de em aberto: R$${totalIncome.toFixed(2).replace(".", ",")}`
					: `Total em aberto do mês: R$${totalIncome
							.toFixed(2)
							.replace(".", ",")}`}
			</h2>
			<Box
				display="flex"
				flexDirection="column"
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
				}}
			>
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
				>
					<FormControl>
						<Select
							sx={{ gridColumn: "span 1" }}
							label="Selecione o mês:"
							variant="filled"
							id="monthSelect"
							value={selectedMonth}
							onChange={handleMonthChange}
						>
							<MenuItem value=" ">Selecione o mês</MenuItem>
							<MenuItem value="0">Janeiro</MenuItem>
							<MenuItem value="1">Fevereiro</MenuItem>
							<MenuItem value="2">Março</MenuItem>
							<MenuItem value="3">Abril</MenuItem>
							<MenuItem value="4">Maio</MenuItem>
							<MenuItem value="5">Junho</MenuItem>
							<MenuItem value="6">Julho</MenuItem>
							<MenuItem value="7">Agosto</MenuItem>
							<MenuItem value="8">Setembro</MenuItem>
							<MenuItem value="9">Outubro</MenuItem>
							<MenuItem value="10">Novembro</MenuItem>
							<MenuItem value="11">Dezembro</MenuItem>
						</Select>
					</FormControl>
					<Select
						variant="filled"
						sx={{ gridColumn: "span 1" }}
						type="text"
						label="Filtrar por Status"
						value={filtro.pago}
						onChange={(e) => setFiltro({ ...filtro, pago: e.target.value })}
					>
						<MenuItem value={false}>
							<em>Pendente</em>
						</MenuItem>
						<MenuItem value={true}>Pago</MenuItem>
						<MenuItem value="todos">Todos</MenuItem>
					</Select>
					{(cookie.Cargo == "Advogado" || cookie.Cargo == "admin") && (
						<Select
							variant="filled"
							sx={{ gridColumn: "span 1" }}
							type="text"
							label="Filtrar por Cliente"
							value={filtro.clienteId}
							onChange={(e) =>
								setFiltro({ ...filtro, clienteId: e.target.value })
							}
						>
							<MenuItem value=" ">Selecione um cliente</MenuItem>
							{clientes.map((data) => (
								<MenuItem key={data._id} value={data._id}>
									{data.nome}
								</MenuItem>
							))}
						</Select>
					)}
				</Box>
				{(cookie.Cargo == "Advogado" || cookie.Cargo == "admin") && (
					<Box display="flex" gap="15px">
						<Link to="/cadastrar-financeiro">
							<Button
								variant="outlined"
								color="success"
								onClick={handleCadastroClick}
								style={{ marginTop: "10px" }}
								startIcon={<AddOutlinedIcon />}
								width="25%"
							>
								Cadastrar
							</Button>
						</Link>
						<Button
							variant="outlined"
							color="error"
							onClick={handleBaixa}
							style={{ marginTop: "10px" }}
							startIcon={<PointOfSaleOutlinedIcon />}
							width="25%"
						>
							Dar baixa
						</Button>
						<Button
							variant="outlined"
							color="success"
							startIcon={<PictureAsPdfOutlinedIcon />}
							onClick={generatePDF}
							style={{ marginTop: "10px" }}
						>
							Gerar PDF
						</Button>
					</Box>
				)}
			</Box>
			<Box
				m="20px 0 0 0"
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
				}}
			>
				<Box
					display="grid"
					gap="30px"
					gridTemplateColumns="repeat(4, minmax(0, 1fr))"
				></Box>
				<DataGrid
					rows={filteredRows}
					columns={columns}
					pageSize={5}
					disableSelectionOnClick
					checkboxSelection
					getRowId={getRowId}
					onRowSelectionModelChange={(newSelection) => {
						setSelectedRows(newSelection);
					}}
					sx={{ height: "100%" }}
				/>
			</Box>
		</Box>
	);
}

export default FinancialControl;
