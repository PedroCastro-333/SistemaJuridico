import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./Theme";

import Routing from "./routes/Routing";
import { useCookies } from "react-cookie";

function App() {
	// Obtém o tema e o modo de cores do contexto do tema
	const [theme, colorMode] = useMode();
	const [cookie, setCookie, removeCookie] = useCookies(null);
	const authToken = cookie.AuthToken;

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<div className="app">
					<Routing />
				</div>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default App;
