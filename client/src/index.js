import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { ChatProvider } from "./contexts/ChatContext";
import { LogProvider } from "./contexts/LogContext";
import { AppProvider } from "./contexts/AppContext";

// import reportWebVitals from './reportWebVitals';
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1C658C",
			light: "#398AB9",
		},
		// secondary: { main: "#398AB9" },
		secondary: { main: "rgba(255, 171, 0)" },
		background: {
			default: "#EEEEEE",
		},
	},
	typography: {
		fontFamily: "SanFrancisco, Arial",
	},
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<AppProvider>
			<AuthProvider>
				<GameProvider>
					<ChatProvider>
						<LogProvider>
							<ThemeProvider theme={theme}>
								<CssBaseline />
								<App />
							</ThemeProvider>
						</LogProvider>
					</ChatProvider>
				</GameProvider>
			</AuthProvider>
		</AppProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
