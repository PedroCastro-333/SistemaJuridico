import React from "react";
import { Box } from "@mui/material";

// Componentes
import Header from "../../components/Header";

export default function Dashboard() {
	return (
		<Box m="20px">
			{/* Cabeçalho do Dashboard */}
			<Box display="flex" justifyContent="space-between" alignItems="center">
				<Header title="Dashboard" subtitle="Welcome to your dashboard" />
			</Box>
		</Box>
	);
}
