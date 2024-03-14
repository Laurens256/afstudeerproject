import type { UnoCard, UnoColor } from '@shared/types';
import { useRef } from 'react';
import { Button } from '@/components';
import clsx from 'clsx';
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
	onClick?: (card: UnoCard) => void;
	className?: string;
	position: 'top' | 'right' | 'bottom' | 'left';
};
const CardsList = ({
	cards, isVisible, username, currentCard, wildcardColor, onClick, className, position,
}: CardsListProps) => {
	const listRef = useRef<HTMLUListElement>(null);

	const canPlayCard = (card: UnoCard) => {
		if (!onClick) return false;
		if (card.type === 'wild-card') return cards.length !== 1;

		const { type: currentCardType, value: currentCardValue } = currentCard;
		const { color: cardColor, value: cardValue } = card;
		if (currentCardType === 'wild-card') {
			return wildcardColor === cardColor;
		}

		return cardColor === currentCard.color || cardValue === currentCardValue;
	};

	return (
		<div>
			<ul
				className={clsx(classes.container, className, classes[`${position}Position`])}
				aria-label={`${username} cards`}
				ref={listRef}
			>
				{cards.map((card) => (
					<li
						key={card.cardId}
						className={classes.cardContainer}
						style={{
							outline: `5px solid ${canPlayCard(card) ? 'green' : 'red'}`,
						}}
					>
						<CardItemWrapper
							onClick={() => onClick && onClick(card)}
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
