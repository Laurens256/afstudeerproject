import type { UnoCard } from '@shared/types';
import { Button } from '@/components';
import clsx from 'clsx';
import classes from './CardsList.module.css';
import UnoCardComponent from '../UnoCard';

type CardsListProps = {
	cards: UnoCard[];
	username: string;
	className?: string;
	position: 'top' | 'right' | 'bottom' | 'left';
	isCurrentPlayer: boolean;
	onCardClick?: (card: UnoCard) => void;
};
const CardsList = ({
	cards,
	username,
	className,
	position,
	isCurrentPlayer,
	onCardClick,
}: CardsListProps) => (
	<div>
		<ul
			className={clsx(
				classes.container,
				className,
				classes[`${position}Position`],
				isCurrentPlayer && classes.currentPlayer,
			)}
			aria-label={`${username} cards`}
		>
			{onCardClick ? cards.map((card) => (
				<li key={card.cardId} className={classes.cardContainer}>
					<Button
						aria-roledescription="card"
						variant="unstyled"
						onClick={() => onCardClick(card)}
						className={classes.cardButtonWrapper}
					>
						<UnoCardComponent
							key={card.cardId}
							card={card}
							className={classes.cardImg}
						/>
					</Button>
				</li>
			)) : (
				cards.map((card) => (
					<li key={card.cardId} className={classes.cardContainer}>
						<UnoCardComponent
							key={card.cardId}
							card={null}
							className={classes.cardImg}
						/>
					</li>
				))
			)}
		</ul>
	</div>
);

export default CardsList;
