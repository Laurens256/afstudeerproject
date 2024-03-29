import type { UnoCard } from '@shared/types';
import { Button } from '@/components';
import clsx from 'clsx';
import classes from './CardsList.module.css';
import UnoCardComponent from '../UnoCard';

type CardsListProps = {
	cards: UnoCard[];
	username: string;
	className?: string;
	isCurrentPlayer: boolean;
	onCardClick: (card: UnoCard) => void;
};
const CardsList = ({
	cards,
	username,
	className,
	isCurrentPlayer,
	onCardClick,
}: CardsListProps) => (
	<ul
		className={clsx(
			classes.container,
			className,
			isCurrentPlayer && classes.currentPlayer,
		)}
		aria-label={`${username} cards`}
	>
		{cards.map((card, i) => (
			<li key={card.cardId} className={classes.cardContainer}>
				<Button
					aria-roledescription="card"
					variant="unstyled"
					onClick={() => onCardClick(card)}
					className={classes.cardButtonWrapper}
				>
					<UnoCardComponent key={card.cardId} card={card} />
				</Button>
			</li>
		))}
	</ul>
);

export default CardsList;
