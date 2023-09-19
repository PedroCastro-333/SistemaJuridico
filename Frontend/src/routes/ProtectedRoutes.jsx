import React from "react";
import { useCookies } from "react-cookie";

import Login from "../components/Login";
import Routes from "./Routing";
import { Navigate } from "react-router-dom";

export default ({ children }) => {
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const authToken = cookie.AuthToken;

	return authToken ? children : <Navigate to={"/processos"} />;
};
