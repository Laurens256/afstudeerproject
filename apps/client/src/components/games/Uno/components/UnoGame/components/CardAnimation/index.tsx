import type { UnoCard, UnoPlayer } from '@shared/types';
import { useEffect, useState } from 'react';
import { usePreviousState } from '@/hooks';
import socket from '@/socket';
import UnoCardComponent from '../UnoCard';
import classes from './CardAnimation.module.css';

type CardAnimationProps = {
	players: UnoPlayer[];
	drawButtonRef: React.RefObject<HTMLButtonElement>;
	cardPileRefs: React.MutableRefObject<{ [socketId: string]: HTMLDivElement }>;
	dropPileRef: React.RefObject<HTMLDivElement>;
};

// returns cards in arr1 that are not in arr2
const getCardsDiff = (arr1: UnoCard[], arr2: UnoCard[]) => arr1.filter(
	(card1) => !arr2.some((card2) => card1.cardId === card2.cardId),
);

type Coords = { x: number; y: number };

// component for animating drawing and dropping cards
const CardAnimation = ({
	players, drawButtonRef, cardPileRefs, dropPileRef,
}: CardAnimationProps) => {
	const prevPlayersState = usePreviousState(players);
	const [cards, setCards] = useState<(UnoCard | null)[]>([]);
	const [fromCenter, setFromCenter] = useState<Coords>({ x: 0, y: 0 });
	const [toCenter, setToCenter] = useState<Coords>({ x: 0, y: 0 });

	useEffect(() => {
		if (!prevPlayersState || !prevPlayersState.length) {
			return;
		}

		// find player who drew or dropped a card (if any)
		const playerWithCardDiff = players.find((player) => {
			const prevPlayer = prevPlayersState.find((p) => p.socketId === player.socketId);
			if (!prevPlayer) return false;

			const prevCardIds = new Set(prevPlayer.cards.map(({ cardId }) => cardId));
			const currentCardIds = new Set(player.cards.map(({ cardId }) => cardId));

			const hasDrawnCards = player.cards.some(
				({ cardId }) => !prevCardIds.has(cardId),
			);
			const hasDroppedCards = prevPlayer.cards.some(
				({ cardId }) => !currentCardIds.has(cardId),
			);

			return hasDrawnCards || hasDroppedCards;
		});

		const newCards = playerWithCardDiff?.cards;
		const prevCards = prevPlayersState.find(
			(p) => p.socketId === playerWithCardDiff?.socketId,
		)?.cards;

		if (!prevCards || !newCards) {
			return;
		}

		// find cards that were drawn or dropped by comparing current and previous cards
		const drawnCards = getCardsDiff(newCards, prevCards);
		const droppedCards = getCardsDiff(prevCards, newCards);
		let cardsToAnimate: (UnoCard | null)[] = [];
		let fromEl: HTMLElement | null = null;
		let toEl: HTMLElement | null = null;

		const canSeeCards = socket.id === playerWithCardDiff.socketId
		|| droppedCards.length;

		if (droppedCards.length) {
			cardsToAnimate = droppedCards;
			fromEl = cardPileRefs.current[playerWithCardDiff.socketId];
			toEl = dropPileRef.current;
		} else if (drawnCards.length) {
			cardsToAnimate = drawnCards;
			fromEl = drawButtonRef.current;
			toEl = cardPileRefs.current[playerWithCardDiff.socketId];
		}
		// only show cards if it's the current player's turn or if cards were dropped
		if (!canSeeCards) {
			cardsToAnimate = cardsToAnimate.map(() => null);
		}

		if (!fromEl || !toEl) {
			return;
		}

		const fromBox = fromEl.getBoundingClientRect();
		const toBox = toEl.getBoundingClientRect();

		setCards(cardsToAnimate);
		setFromCenter({
			x: fromBox.left + fromBox.width / 2,
			y: fromBox.top + fromBox.height / 2,
		});
		setToCenter({
			x: toBox.left + toBox.width / 2,
			y: toBox.top + toBox.height / 2,
		});
	}, [cardPileRefs, drawButtonRef, dropPileRef, players, prevPlayersState]);

	return (
		<div
			className={classes.container}
			style={{
				'--from-x': `${fromCenter.x}px`,
				'--from-y': `${fromCenter.y}px`,
				'--to-x': `${toCenter.x}px`,
				'--to-y': `${toCenter.y}px`,
			} as React.CSSProperties}
			aria-hidden="true"
		>
			{cards.map((card, i) => (
				<UnoCardComponent
					key={card?.cardId ?? i}
					card={card}
					className={classes.card}
					style={{
						'--index': i,
					} as React.CSSProperties}
				/>
			))}
		</div>
	);
};

export default CardAnimation;
