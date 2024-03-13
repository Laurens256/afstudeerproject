import { useState, useEffect } from 'react';
import socket from '@/socket';
import type { Player, UnoGameState } from '@shared/types';

type UnoProps = {
	playersInGame: Player[]
};
const Uno = ({ playersInGame }: UnoProps) => {
	const [gameState, setGameState] = useState<UnoGameState | null>(null);

	useEffect(() => {
		if (gameState) {
			return;
		}
		const handleGetGameState = (serverGameState: UnoGameState) => {
			setGameState(serverGameState);
		};

		socket.on('UNO_GET_GAME_STATE', handleGetGameState);
		socket.emit('UNO_INITIALIZE_GAME', playersInGame);
		return () => {
			socket.off('UNO_GET_GAME_STATE', handleGetGameState);
		};
	}, [gameState, playersInGame]);

	return (
		<div>
			<h1>Uno</h1>
		</div>
	);
};

export default Uno;
