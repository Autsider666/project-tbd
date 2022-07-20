import React from 'react'
import Header from './header/Header'
import Main from './main/Main';
import SplashPage from './splashPage/SplashPage';
import './App.css'
import { useEffect } from 'react';
import { socket } from './functions/SocketAPI';
import { useGame } from './contexts/GameContext';

const App = () => {
	useEffect(() => {
		socket.emit('message', 'Connected from Frontend Client');
	}, [])

	const { loaded = false } = useGame()

	return (
		<div id="app">
			<Header />
			<div id="main">
				{
					loaded ? <Main /> : <SplashPage />
				}
			</div>
		</div>
	);
}

export default App;
