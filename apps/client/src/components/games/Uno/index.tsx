import { useState, useEffect, useCallback } from 'react';
import socket from '@/socket';
import type { Player, UnoGameState, UnoCard, UnoColor } from '@shared/types';
import { GameHistory, WinnerModal, FullScreenLoader } from '@/components';
import type { GameErrorToastProps } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { stringUtil } from '@/utils';
import { UnoGame } from './components';
import { cardToLabel } from './util';

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
		setGameHistory((prevGameHistory) => [{
			key: uuidv4(), entry,
		}, ...prevGameHistory]);
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
	) => {
		if (socketId === socket.id) {
			return 'you';
		}

		const player = playersInGame.find((p) => p.socketId === socketId);
		return player?.username || 'someone';
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
					const canPlayOrEndTurn = cardReceiver.socketId === newGameState.currentPlayerId
					&& socket.id === cardReceiver.socketId
						? ' you can now play a card or end your turn'
						: ' they still need to end their turn';
					addGameHistoryEntry(`${findUsernameBySocketId(socketId)} drew ${cards.length} card${stringUtil.pluralizeUsername(cards.length)}.${canPlayOrEndTurn}`);
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
				const prevPlayerUsername = findUsernameBySocketId(prevGameState.currentPlayerId);
				const wasOurTurn = prevGameState.currentPlayerId === socket.id;
				addGameHistoryEntry(`${prevPlayerUsername} ended ${wasOurTurn ? 'your' : 'their'} turn. It's now ${stringUtil.endUsername(findUsernameBySocketId(socketId))} turn`);
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

						const cardPlayerUsername = findUsernameBySocketId(cardPlayerSocketId);
						const currentPlayerConnectorWord = newUnoPlayer?.socketId === prevGameState.currentPlayerId ? 'still' : 'now';
						const newPlayerUsername = stringUtil.endUsername(
							findUsernameBySocketId(newState.currentPlayerId),
						);
						const choseNewColorStr = newState.wildcardColor
							? ` and chose ${newState.wildcardColor} as the new color`
							: '';
						const newTurnStr = newState.winnerId
							? ' and won the game!'
							: `. it's ${currentPlayerConnectorWord} ${newPlayerUsername} turn`;

						addGameHistoryEntry(`${cardPlayerUsername} played ${cardToLabel(card)}${choseNewColorStr} card${newTurnStr}`);

						unoPlayer.cards.splice(cardIndex, 1);
					}
				}
				return { ...newGameState, ...newState };
			});
		};

		const handleChooseColor = (color: UnoColor) => {
			setGameState((prevGameState) => {
				if (!prevGameState) return prevGameState;
				addGameHistoryEntry(`${findUsernameBySocketId(prevGameState.currentPlayerId)} chose ${color} as the new color`);
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
		return <FullScreenLoader />;
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
				currentPlayerUsername={stringUtil.endUsername(
					findUsernameBySocketId(gameState.currentPlayerId),
				)}
				showErrorToast={showErrorToast}
			/>
			{winner && (
				<WinnerModal
					winner={winner}
					ourPlayer={ourPlayer}
				/>
			)}
			<GameHistory entries={gameHistory} />
		</>
	);
};

export default Uno;
