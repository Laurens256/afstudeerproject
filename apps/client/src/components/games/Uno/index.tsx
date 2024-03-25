import { useState, useEffect } from 'react';
import socket from '@/socket';
import type { Player, UnoGameState, UnoCard, UnoColor } from '@shared/types';
import { GameHistory } from '@/components';
import { UnoGame, WinnerModal } from './components';
import { cardToLabel } from './util';

const endName = (name: string) => {
	if (name === 'you') return 'your';
	return (name.endsWith('s') ? `${name}'` : `${name}'s`);
};
const pluralize = (count: number) => (count === 1 ? '' : 's');

type UnoProps = {
	playersInGame: Player[]
};
const Uno = ({ playersInGame }: UnoProps) => {
	const [gameState, setGameState] = useState<UnoGameState | null>(null);
	const [movePlayed, setMovePlayed] = useState(false);
	const [hasDrawnCard, setHasDrawnCard] = useState(false);

	const [gameHistory, setGameHistory] = useState<string[]>([]);
	const addGameHistoryEntry = (entry: string) => {
		setGameHistory((prevGameHistory) => [...prevGameHistory, entry]);
	};

	const isOurTurn = gameState?.currentPlayerId === socket.id;
	const canDoAction = gameState?.currentPlayerId === socket.id && !movePlayed;
	const canSkipTurn = isOurTurn && hasDrawnCard;

	useEffect(() => {
		if (isOurTurn) {
			setMovePlayed(false);
			setHasDrawnCard(false);
		}
	}, [isOurTurn]);

	useEffect(() => {
		const handleGetGameState = (serverGameState: UnoGameState) => {
			setGameState(serverGameState);
		};

		socket.on('UNO_GET_GAME_STATE', handleGetGameState);

		if (!gameState) {
			if (playersInGame.map((player) => player.socketId).includes(socket.id)) {
				const expectedSocketIds = playersInGame.map((player) => player.socketId);
				socket.emit('UNO_PLAYER_GET_INITIAL_STATE', expectedSocketIds);
			} else {
				socket.emit('UNO_GET_GAME_STATE');
			}
		}
		return () => {
			socket.off('UNO_GET_GAME_STATE', handleGetGameState);
		};
	}, [gameState, playersInGame]);

	useEffect(() => {
		const findUsernameBySocketId = (socketId: string | undefined, capitalizeYou?: boolean) => {
			if (socketId === socket.id) {
				return capitalizeYou ? 'You' : 'you';
			}

			const player = playersInGame.find((p) => p.socketId === socketId);
			return player?.username || 'Someone';
		};

		const handleDrawCards = (socketId: string, cards: UnoCard[]) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;

				const newGameState = { ...prevGameState };
				const cardReceiver = newGameState.players.find(
					(player) => player.socketId === socketId,
				);
				if (cardReceiver) {
					cardReceiver.cards.push(...cards);
					addGameHistoryEntry(`${findUsernameBySocketId(socketId, true)} drew ${cards.length} card${pluralize(cards.length)}`);
				}
				newGameState.cardDrawCounter = 0;
				return newGameState;
			});
		};

		const handleSetPlayerTurn = (socketId: string) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;

				const newGameState = { ...prevGameState };
				newGameState.currentPlayerId = socketId;
				addGameHistoryEntry(`It's now ${endName(findUsernameBySocketId(socketId))} turn`);
				return newGameState;
			});
		};

		const handlePlayCard = (
			cardPlayerSocketId: string,
			cardId: number,
			newState: Partial<UnoGameState>,
		) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;

				const newGameState = { ...prevGameState };
				const unoPlayer = newGameState.players.find(
					(p) => p.socketId === cardPlayerSocketId,
				);
				if (unoPlayer) {
					const cardIndex = unoPlayer.cards.findIndex(
						(card) => card.cardId === cardId,
					);
					if (cardIndex !== -1) {
						const card = unoPlayer.cards[cardIndex];
						const newUnoPlayer = newGameState.players.find(
							(p) => p.socketId === newState.currentPlayerId,
						);

						const cardPlayerUsername = findUsernameBySocketId(cardPlayerSocketId, true);
						const currentPlayerConnectorWord = newUnoPlayer?.socketId === prevGameState.currentPlayerId ? 'still' : 'now';
						const newPlayerUsername = endName(
							findUsernameBySocketId(newState.currentPlayerId),
						);
						const choseNewColorStr = newState.wildcardColor ? ` and chose ${newState.wildcardColor} as the new color` : '';

						addGameHistoryEntry(`${cardPlayerUsername} played ${cardToLabel(card)}${choseNewColorStr}. It's ${currentPlayerConnectorWord} ${newPlayerUsername} turn`);

						unoPlayer.cards.splice(cardIndex, 1);
					}
				}
				return { ...newGameState, ...newState };
			});
		};

		const handleChooseColor = (color: UnoColor) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;
				addGameHistoryEntry(`${endName(findUsernameBySocketId(prevGameState.currentPlayerId))} chose ${color} as the new color`);
				return { ...prevGameState, wildcardColor: color };
			});
		};

		socket.on('UNO_DRAW_CARDS', handleDrawCards);
		socket.on('UNO_SET_PLAYER_TURN', handleSetPlayerTurn);
		socket.on('UNO_PLAY_CARD', handlePlayCard);
		socket.on('UNO_CHOOSE_COLOR', handleChooseColor);

		return () => {
			socket.off('UNO_DRAW_CARDS', handleDrawCards);
			socket.off('UNO_SET_PLAYER_TURN', handleSetPlayerTurn);
			socket.off('UNO_PLAY_CARD', handlePlayCard);
			socket.off('UNO_CHOOSE_COLOR', handleChooseColor);
		};
	}, [playersInGame]);

	const ourPlayer = playersInGame.find((player) => player.socketId === socket.id);
	const ourCards = gameState?.players.find(
		(player) => player.socketId === ourPlayer?.socketId,
	)?.cards;

	if (!gameState || !ourPlayer || ourCards === undefined) {
		// TODO loader or error
		return <p>Loading...</p>;
	}
	const winner = gameState.winnerId
		? playersInGame.find((player) => player.socketId === gameState.winnerId) : undefined;

	return (
		<>
			<UnoGame
				gameState={gameState}
				players={playersInGame}
				canDoAction={canDoAction}
				disableCanDoAction={() => setMovePlayed(true)}
				ourPlayer={ourPlayer}
				canSkipTurn={canSkipTurn}
				setHasDrawnCard={setHasDrawnCard}
				hasDrawnCard={hasDrawnCard}
				addGameHistoryEntry={addGameHistoryEntry}
			/>
			{/* TODO: generic WinnerModal for all games */}
			{winner && <WinnerModal winner={winner} />}
			<GameHistory entries={gameHistory} />
		</>
	);
};

export default Uno;
