import React, { useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Paper,
	useTheme,
} from "@mui/material";
import { tokens } from "../Theme";
import api from "../services/api";
import { useCookies } from "react-cookie";

export default () => {
	// Define o estado inicial do formulário
	const [formData, setFormData] = useState({
		usuario: "",
		senha: "",
	});
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	// Função para lidar com as mudanças nos campos de entrada
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const getToken = async () => {
		const res = await api.post("auth", formData);
		console.log(res);
		if (res.detail) {
			setError(res.detail);
		} else {
			console.log(res);
			setCookie("Salt", res.data.id);
			setCookie("Cargo", res.data.cargo);
			setCookie("AuthToken", res.data.token);
			window.location.reload();
		}
	};

	// Função para lidar com o envio do formulário
	const handleSubmit = (e) => {
		e.preventDefault(); // Impede o comportamento padrão de envio do formulário
		getToken();
	};

	return (
		<Box
			width="100%"
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
		>
			<Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: "100%" }}>
				<Typography variant="h5" align="center" gutterBottom>
					Login
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Usuário"
						variant="outlined"
						name="usuario"
						value={formData.usuario}
						onChange={handleInputChange}
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						fullWidth
						label="Senha"
						variant="outlined"
						type="password"
						name="senha"
						value={formData.senha}
						onChange={handleInputChange}
						sx={{ marginBottom: 2 }}
					/>
					<Button type="submit" variant="contained" color="primary" fullWidth>
						Entrar
					</Button>
				</form>
			</Paper>
		</Box>
	);
};
