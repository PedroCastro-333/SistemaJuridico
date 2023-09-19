import React from "react";
import { tokens } from "../../Theme";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import { Link } from "react-router-dom";

export default ({ selected, setSelected }) => {
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

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<>
			<Typography
				variant="h6"
				color={colors.grey[300]}
				sx={{ m: "15px 0 5px 20px" }}
			>
				Cadastrar
			</Typography>
			<Item
				title="Cadastrar Cliente"
				to="/cadastrar-cliente"
				icon={<PersonOutlinedIcon />}
				selected={selected}
				setSelected={setSelected}
			/>

			{/* <Item
				title="Cadastrar processo"
				to="/cadastrar-processo"
				icon={<TaskOutlinedIcon />}
				selected={selected}
				setSelected={setSelected}
			/> */}

			<Item
				title="Cadastrar transação"
				to="/cadastrar-financeiro"
				icon={<PointOfSaleOutlinedIcon />}
				selected={selected}
				setSelected={setSelected}
			/>
		</>
	);
};
