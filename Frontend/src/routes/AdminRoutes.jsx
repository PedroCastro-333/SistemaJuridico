import React from "react";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";
import Routes from "./Routing";

export default ({ children }) => {
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const authToken = cookie.AuthToken;
	const authCargo = cookie.Cargo;

	return authToken ? (
		authCargo == "admin" || authCargo == "Advogado" ? (
			children
		) : (
			<Navigate to={"/"} />
		)
	) : (
		<Navigate to={"/login"} />
	);
};
