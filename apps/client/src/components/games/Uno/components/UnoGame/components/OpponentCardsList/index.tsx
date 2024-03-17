import clsx from 'clsx';
import { memo } from 'react';
import type { UnoCard } from '@shared/types';
import classes from './OpponentCardsList.module.css';
import UnoCardComponent from '../UnoCard';

type OpponentCardsListProps = {
	cards: UnoCard[];
	isCurrentPlayer: boolean;
	username: string;
};

const OpponentCardsList = ({ cards, isCurrentPlayer, username }: OpponentCardsListProps) => {
	const rotateStep = 360 / cards.length;
	return (
		<ul
			className={clsx(classes.cardsContainer, isCurrentPlayer && classes.currentPlayer)}
			aria-label={`${username} cards`}
		>
			{cards.map((card, i) => (
				<li
					key={card.cardId}
					className={classes.card}
					style={{
						rotate: `${rotateStep * i}deg`,
					}}
				>
					<UnoCardComponent card={null} />
				</li>
			))}
		</ul>
	);
};

export default memo(OpponentCardsList);
