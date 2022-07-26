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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<AppProvider>
			<AuthProvider>
				<GameProvider>
					<ChatProvider>
						<LogProvider>
							<App />
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
