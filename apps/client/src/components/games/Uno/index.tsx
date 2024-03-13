import { useState, useEffect } from 'react';
import socket from '@/socket';
import type { UnoGameState } from '@shared/types';

const Uno = () => {
	const [gameState, setGameState] = useState<UnoGameState | null>(null);

	useEffect(() => {
		if (gameState) {
			return;
		}
		const handleGetGameState = (serverGameState: UnoGameState) => {
			setGameState(serverGameState);
		};

		socket.on('UNO_GET_GAME_STATE', handleGetGameState);
		socket.emit('UNO_GET_GAME_STATE');
		return () => {
			socket.off('UNO_GET_GAME_STATE', handleGetGameState);
		};
	}, [gameState]);

	return (
		<div>
			<h1>Uno</h1>
		</div>
	);
};

export default Uno;
