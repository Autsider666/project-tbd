import React from "react";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Header from './header/Header'
import Main from './main/Main';
import SplashPage from './splashPage/SplashPage';
import { useGame } from './contexts/GameContext';
// import './App.css'
import { Box } from "@mui/system";
import { useApp } from "./contexts/AppContext";
import WikiModal from "./components/WikiModal"
import WorldDeathModal from "./components/WorldDeathModal";



const marginAmount = 24


function App() {

	const { loaded = false } = useGame()

	const { snackbar, hideSnackbar } = useApp()

	return (
		<Box sx={{
			height: { xs: 'auto', lg: "100%" },
			width: "100%",
			backgroundColor: "#b0620d",
		}}>
			<Header />
			<Box sx={{
				height: { xs: "980px", sm: "1070px", md: "1200px", lg: `calc(100% - 24px - ${marginAmount * 2}px)` },
				// width: `calc(100% - ${marginAmount * 2}px)`,
				padding: 3,
			}} >
				{
					loaded ? <Main marginAmount={marginAmount} /> : <SplashPage marginAmount={marginAmount} />
				}
			</Box>

			<Snackbar
				open={snackbar.visible}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				autoHideDuration={3000}
				onClose={hideSnackbar}
				sx={{ bottom: { xs: 120 } }}
			>
				<Alert variant="filled" onClose={hideSnackbar} severity={snackbar.severity}>
					{snackbar.message}
				</Alert>
			</Snackbar>
			<WikiModal />
			<WorldDeathModal />
		</Box>
	);
}

export default App;
