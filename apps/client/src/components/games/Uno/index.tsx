import { useState, useEffect, useCallback } from 'react';
import socket from '@/socket';
import type { Player, UnoGameState, UnoCard, UnoColor } from '@shared/types';
import { GameHistory } from '@/components';
import type { GameErrorToastProps } from '@/types';
import { UnoGame, WinnerModal } from './components';
import { cardToLabel } from './util';

const endName = (name: string) => {
	if (name === 'you') return 'your';
	if (name === 'You') return 'Your';
	return (name.endsWith('s') ? `${name}'` : `${name}'s`);
};
const pluralize = (count: number) => (count === 1 ? '' : 's');

type UnoProps = {
	playersInGame: Player[];
	showErrorToast: (props: GameErrorToastProps) => void;
};
const Uno = ({ playersInGame, showErrorToast }: UnoProps) => {
	const [gameState, setGameState] = useState<UnoGameState | null>(null);
	const [movePlayed, setMovePlayed] = useState(false);
	const [hasDrawnCard, setHasDrawnCard] = useState(false);

	const [gameHistory, setGameHistory] = useState<{ key: string, entry: React.ReactNode }[]>([]);
	const addGameHistoryEntry = (entry: React.ReactNode) => {
		// setGameHistory((prevGameHistory) => [..., entry]);
		setGameHistory((prevGameHistory) => [...prevGameHistory, {
			key: Date.now().toString(), entry,
		}]);
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

	const findUsernameBySocketId = useCallback((
		socketId: string | undefined,
		capitalizeYou?: boolean,
	) => {
		if (socketId === socket.id) {
			return capitalizeYou ? 'You' : 'you';
		}

		const player = playersInGame.find((p) => p.socketId === socketId);
		return player?.username || 'Someone';
	}, [playersInGame]);

	useEffect(() => {
		const handleDrawCards = (socketId: string, cards: UnoCard[]) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;

				const newGameState = { ...prevGameState };
				const cardReceiver = newGameState.players.find(
					(player) => player.socketId === socketId,
				);
				if (cardReceiver) {
					cardReceiver.cards.push(...cards);
					const canPlayOrEndTurn = cardReceiver.socketId === newGameState.currentPlayerId ? ' You can now play a card or end your turn' : '';
					addGameHistoryEntry(`${findUsernameBySocketId(socketId, true)} drew ${cards.length} card${pluralize(cards.length)}.${canPlayOrEndTurn}`);
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

						addGameHistoryEntry(`${cardPlayerUsername} played ${cardToLabel(card)}${choseNewColorStr} card. It's ${currentPlayerConnectorWord} ${newPlayerUsername} turn`);

						unoPlayer.cards.splice(cardIndex, 1);
					}
				}
				return { ...newGameState, ...newState };
			});
		};

		const handleChooseColor = (color: UnoColor) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;
				addGameHistoryEntry(`${findUsernameBySocketId(prevGameState.currentPlayerId, true)} chose ${color} as the new color`);
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
	}, [findUsernameBySocketId, playersInGame]);

	const ourPlayer = playersInGame.find((player) => player.socketId === socket.id) || null;
	if (!gameState) {
		// if (!gameState || !ourPlayer || ourCards === undefined) {
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
				currentPlayerUsername={endName(findUsernameBySocketId(gameState.currentPlayerId))}
				showErrorToast={showErrorToast}
			/>
			{/* TODO: generic WinnerModal for all games */}
			{winner && <WinnerModal winner={winner} ourPlayer={ourPlayer} />}
			<GameHistory entries={gameHistory} />
		</>
	);
};

export default Uno;
