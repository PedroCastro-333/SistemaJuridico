import React from "react";
import { Routes, Route } from "react-router-dom";

import TopBar from "../scenes/global/TopBar";
import SideBar from "../scenes/global/SideBar";
import Dashboard from "../scenes/Dashboard";
import Clientes from "../scenes/Clientes";
import Processos from "../scenes/Processos";
import Financeiro from "../scenes/Financeiro";
import Clienteform from "../scenes/ClienteForm";
import FinanceiroForm from "../scenes/FinanceiroForm";
import ProcessosForm from "../scenes/ProcessosForm";
import Agenda from "../scenes/Agenda";
import Login from "../components/Login";

import ProtectedRoutes from "./ProtectedRoutes"; // Certifique-se de criar esse componente

import { useCookies } from "react-cookie";
import AdminRoutes from "./AdminRoutes";

export default () => {
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const authToken = cookie.AuthToken;
	const cargo = cookie.Cargo;
	return (
		<>
			{!authToken && <Login />}
			{/* Renderizar o Login somente quando o usuário não estiver autenticado */}
			{authToken && (
				<>
					{/* Barra lateral para navegação */}
					<SideBar />
					<main className="content">
						{/* Barra superior */}
						<TopBar />
						{/* Configuração das rotas */}
						<Routes>
							<Route
								path="/"
								element={
									<ProtectedRoutes>
										<Dashboard />
									</ProtectedRoutes>
								}
							/>
							{!authToken && <Route path="/login" element={<Login />} />}
							<Route
								path="/clientes"
								element={
									<AdminRoutes>
										<Clientes />
									</AdminRoutes>
								}
							/>
							<Route
								path="/processos"
								element={
									<ProtectedRoutes>
										<Processos />
									</ProtectedRoutes>
								}
							/>
							<Route
								path="/financeiro"
								element={
									<ProtectedRoutes>
										<Financeiro />
									</ProtectedRoutes>
								}
							/>
							<Route
								path="/cadastrar-cliente"
								element={
									<AdminRoutes>
										<Clienteform />
									</AdminRoutes>
								}
							/>
							<Route
								path="/cadastrar-processo"
								element={
									<AdminRoutes>
										<ProcessosForm />
									</AdminRoutes>
								}
							/>
							<Route
								path="/cadastrar-financeiro"
								element={
									<AdminRoutes>
										<FinanceiroForm />
									</AdminRoutes>
								}
							/>
							<Route path="/agenda" element={<Agenda />} />
							{/* <Route path="/pie" element={<Pie />} /> */}
							{/* <Route path="/line" element={<Line />} /> */}
						</Routes>
					</main>
				</>
			)}
		</>
	);
};
