import { useState, useEffect } from 'react';
import socket from '@/socket';
import type { Player, UnoGameState, UnoCard } from '@shared/types';
import UnoGame from './UnoGame';

type UnoProps = {
	playersInGame: Player[]
};
const Uno = ({ playersInGame }: UnoProps) => {
	const [gameState, setGameState] = useState<UnoGameState | null>(null);
	const [movePlayed, setMovePlayed] = useState(false);
	const isOurTurn = gameState?.currentPlayerId === socket.id;
	const canDoAction = gameState?.currentPlayerId === socket.id && !movePlayed;

	useEffect(() => {
		if (isOurTurn) {
			setMovePlayed(false);
		}
	}, [isOurTurn]);

	useEffect(() => {
		if (gameState) {
			return;
		}
		const handleGetGameState = (serverGameState: UnoGameState) => {
			console.log('here')
			setGameState(serverGameState);
		};

		socket.on('UNO_GET_GAME_STATE', handleGetGameState);
		socket.emit('UNO_GET_GAME_STATE');
		return () => {
			socket.off('UNO_GET_GAME_STATE', handleGetGameState);
		};
	}, [gameState, playersInGame]);

	useEffect(() => {
		const handleDrawCards = (socketId: string, cards: UnoCard[], nextPlayer: string) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;

				const newGameState = { ...prevGameState };
				newGameState.currentPlayerId = nextPlayer;
				const cardReceiver = newGameState.players.find(
					(player) => player.socketId === socketId,
				);
				if (cardReceiver) {
					cardReceiver.cards.push(...cards);
				}
				return newGameState;
			});
		};

		const handleSetPlayerTurn = (socketId: string) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;

				const newGameState = { ...prevGameState };
				newGameState.currentPlayerId = socketId;
				return newGameState;
			});
		};

		const handlePlayCard = (
			socketId: string,
			cardId: number,
			newState: Partial<UnoGameState>,
		) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;

				const newGameState = { ...prevGameState };
				const player = newGameState.players.find(
					(p) => p.socketId === socketId,
				);
				if (player) {
					const cardIndex = player.cards.findIndex(
						(card) => card.cardId === cardId,
					);
					if (cardIndex !== -1) {
						player.cards.splice(cardIndex, 1);
					}
				}
				return { ...newGameState, ...newState };
			});
		};

		socket.on('UNO_DRAW_CARDS', handleDrawCards);
		socket.on('UNO_SET_PLAYER_TURN', handleSetPlayerTurn);
		socket.on('UNO_PLAY_CARD', handlePlayCard);

		return () => {
			socket.off('UNO_DRAW_CARDS', handleDrawCards);
			socket.off('UNO_SET_PLAYER_TURN', handleSetPlayerTurn);
			socket.off('UNO_PLAY_CARD', handlePlayCard);
		};
	}, []);

	const ourPlayer = playersInGame.find((player) => player.socketId === socket.id);
	const ourCards = gameState?.players.find(
		(player) => player.socketId === ourPlayer?.socketId,
	)?.cards;

	if (!gameState || !ourPlayer || !ourCards) {
		// TODO loader or error
		return <div>Loading...</div>;
	}

	return (
		<UnoGame
			gameState={gameState}
			players={playersInGame}
			canDoAction={canDoAction}
			disableCanDoAction={() => setMovePlayed(true)}
			ourPlayer={ourPlayer}
		/>
	);
};

export default Uno;
