import React, { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../Theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import pp from "../../assets/tt_pp.jpg";
import AdminSideBar from "./AdminSideBar";
import { useCookies } from "react-cookie";
import api from "../../services/api";

const Item = ({ title, to, icon, selected, setSelected }) => {
	// Obtenha o tema e as cores do tema atual
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<MenuItem
			active={selected === title}
			style={{
				color: colors.grey[100],
			}}
			onClick={() => setSelected(title)}
			icon={icon}
		>
			<Typography>{title}</Typography>
			<Link to={to} />
		</MenuItem>
	);
};

const Sidebar = () => {
	const [cookie, setCookie, removeCookie] = useCookies(null);

	// Obtenha o tema e as cores do tema atual
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	// Estado para controlar se a barra lateral está recolhida ou expandida
	const [isCollapsed, setIsCollapsed] = useState(false);

	// Estado para controlar o item de menu selecionado
	const [selected, setSelected] = useState("Dashboard");

	const [usuario, setUsuario] = useState({});
	const ufUpper = String(usuario.uf).toUpperCase();

	const getCliente = async () => {
		const res = await api.get(`usuarios/${cookie.Salt}`);
		setUsuario(res.data);
	};

	useEffect(() => {
		getCliente();
	}, []);

	return (
		<Box
			sx={{
				"& .pro-sidebar-inner": {
					background: `${colors.primary[400]} !important`,
				},
				"& .pro-icon-wrapper": {
					backgroundColor: "transparent !important",
				},
				"& .pro-inner-item": {
					padding: "5px 35px 5px 20px !important",
				},
				"& .pro-inner-item:hover": {
					color: "#868dfb !important",
				},
				"& .pro-menu-item.active": {
					color: "#6870fa !important",
				},
				minHeight: "100vh", // Defina a altura máxima como a altura da janela
			}}
		>
			<ProSidebar collapsed={isCollapsed}>
				<Menu iconShape="square">
					{/* LOGO AND MENU ICON */}
					<MenuItem
						onClick={() => setIsCollapsed(!isCollapsed)}
						icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
						style={{
							margin: "10px 0 20px 0",
							color: colors.grey[100],
						}}
					>
						{!isCollapsed && (
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								ml="15px"
							>
								<IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
									<MenuOutlinedIcon />
								</IconButton>
							</Box>
						)}
					</MenuItem>

					{!isCollapsed && (
						<Box mb="25px">
							<Box display="flex" justifyContent="center" alignItems="center">
								<img
									alt="profile-user"
									width="100px"
									height="100px"
									src={pp}
									style={{ cursor: "pointer", borderRadius: "50%" }}
								/>
							</Box>
							<Box textAlign="center">
								<Typography
									variant="h4"
									color={colors.grey[100]}
									fontWeight="bold"
									sx={{ m: "10px 0 0 0" }}
								>
									{usuario.nome}
								</Typography>
								<Typography variant="h6" color={colors.greenAccent[500]}>
									{cookie.Cargo == "admin" || cookie.Cargo == "Advogado"
										? `OAB-${ufUpper} ${usuario.oab}`
										: `${usuario.cpf}`}
								</Typography>
							</Box>
						</Box>
					)}

					<Box paddingLeft={isCollapsed ? undefined : "10%"}>
						<Item
							title="Dashboard"
							to="/"
							icon={<HomeOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
						/>

						<Typography
							variant="h6"
							color={colors.grey[300]}
							sx={{ m: "15px 0 5px 20px" }}
						>
							Consultar
						</Typography>
						{(cookie.Cargo == "Advogado" || cookie.Cargo == "admin") && (
							<Item
								title="Clientes"
								to="/clientes"
								icon={<PeopleOutlinedIcon />}
								selected={selected}
								setSelected={setSelected}
							/>
						)}
						<Item
							title="Processos"
							to="/processos"
							icon={<GavelOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
						/>
						<Item
							title="Financeiro"
							to="/financeiro"
							icon={<ReceiptOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
						/>
						{(cookie.Cargo == "Advogado" || cookie.Cargo == "admin") && (
							<Item
								title="Agenda"
								to="/agenda"
								icon={<CalendarTodayOutlinedIcon />}
								selected={selected}
								setSelected={setSelected}
							/>
						)}
						{(cookie.Cargo == "Advogado" || cookie.Cargo == "admin") && (
							<Box>
								<AdminSideBar selected={selected} setSelected={setSelected} />
							</Box>
						)}

						{/* <Typography
							variant="h6"
							color={colors.grey[300]}
							sx={{ m: "15px 0 5px 20px" }}
						>
							Charts
						</Typography>
						<Item
							title="Bar Chart"
							to="/bar"
							icon={<BarChartOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
						/>
						<Item
							title="Pie Chart"
							to="/pie"
							icon={<PieChartOutlineOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
						/>
						<Item
							title="Line Chart"
							to="/line"
							icon={<TimelineOutlinedIcon />}
							selected={selected}
							setSelected={setSelected}
						/> */}
					</Box>
				</Menu>
			</ProSidebar>
		</Box>
	);
};

export default Sidebar;
