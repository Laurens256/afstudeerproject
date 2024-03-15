import type { UnoCard, UnoColor } from '@shared/types';
import { useRef } from 'react';
import { Button } from '@/components';
import clsx from 'clsx';
import socket from '@/socket';
import classes from './CardsList.module.css';
import UnoCardComponent from '../UnoCard';

type CardItemWrapperProps = {
	children: React.ReactNode;
	onClick?: () => void;
	isVisible: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
const CardItemWrapper = ({
	children, onClick, isVisible, ...rest
}: CardItemWrapperProps) => (
	isVisible ? (
		<Button
			aria-roledescription="card"
			variant="unstyled"
			onClick={onClick}
			{...rest}
		>
			{children}
		</Button>
	) : (
		<>{children}</>
	)
);

type CardsListProps = {
	cards: UnoCard[];
	isVisible: boolean;
	username: string;
	currentCard: UnoCard;
	wildcardColor: UnoColor | null;
	className?: string;
	position: 'top' | 'right' | 'bottom' | 'left';
	canDoAction: boolean;
	disableCanDoAction: () => void;
	isCurrentPlayer: boolean;
};
const CardsList = ({
	cards,
	isVisible,
	username,
	currentCard,
	wildcardColor,
	className,
	position,
	canDoAction,
	disableCanDoAction,
	isCurrentPlayer,
}: CardsListProps) => {
	const listRef = useRef<HTMLUListElement>(null);

	const canPlayCard = (card: UnoCard) => {
		let canPlay: boolean | string = true;

		// TODO add check if drawCardCounter is active
		if (!canDoAction) {
			canPlay = 'It\'s not your turn';
		} else if (card.type === 'wild-card') {
			if (cards.length === 1) {
				canPlay = 'You can\'t play a wild card when you have only one card left';
			}
		} else {
			const { type: currentCardType, value: currentCardValue } = currentCard;
			const { color: cardColor, value: cardValue } = card;
			if (currentCardType === 'wild-card') {
				if (wildcardColor !== cardColor) {
					canPlay = `Can't play a ${cardColor} card. Chosen color is: ${wildcardColor}`;
				}
			} else if (cardColor !== currentCard.color && cardValue !== currentCardValue) {
				canPlay = `You can't play a card that doesn't match the current card's color or value. Current card: ${currentCard.color} ${currentCard.value}`;
			}
		}

		return canPlay;
	};

	const onCardClick = (card: UnoCard) => {
		const canPlay = canPlayCard(card);

		if (canPlay === true) {
			disableCanDoAction();
			socket.emit('UNO_PLAY_CARD', card.cardId);
		} else {
			alert(canPlay); // TODO
		}
	};

	return (
		<div>
			<ul
				className={clsx(
					classes.container,
					className,
					classes[`${position}Position`],
					isCurrentPlayer && classes.currentPlayer,
				)}
				aria-label={`${username} cards`}
				ref={listRef}
			>
				{cards.map((card) => (
					<li key={card.cardId} className={classes.cardContainer}>
						<CardItemWrapper
							onClick={() => onCardClick(card)}
							className={classes.cardButtonWrapper}
							isVisible={isVisible}
						>
							<UnoCardComponent
								key={card.cardId}
								card={isVisible ? card : null}
								className={classes.cardImg}
							/>
						</CardItemWrapper>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CardsList;
