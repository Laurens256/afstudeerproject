import type { UnoCard } from '@shared/types';
import { Button } from '@/components';
import clsx from 'clsx';
import classes from './CardsList.module.css';
import UnoCardComponent from '../UnoCard';

type CardsListProps = {
	cards: UnoCard[];
	username: string;
	className?: string;
	isOurTurn: boolean;
	onCardClick: (card: UnoCard) => void;
	currentPlayerUsername: string;
};
const CardsList = ({
	cards,
	username,
	className,
	isOurTurn,
	onCardClick,
	currentPlayerUsername,
}: CardsListProps) => (
	<div className={classes.outer}>
		<p
			className={clsx(
				'cartoonText',
				classes.turnIndicator,
				isOurTurn && classes.ourTurn,
			)}
		>
			{`It's ${currentPlayerUsername} turn`}
			<span
				className={clsx(
					classes.loadingAnimation,
					isOurTurn && classes.ourTurn,
				)}
				aria-hidden="true"
			>
				...
			</span>
		</p>
		<ul
			className={clsx(
				classes.container,
				className,
				isOurTurn && classes.currentPlayer,
			)}
			aria-label={`${username} cards`}
		>
			{cards.map((card) => (
				<li key={card.cardId} className={classes.cardContainer}>
					<Button
						aria-roledescription="card"
						variant="unstyled"
						onClick={() => onCardClick(card)}
						className={classes.cardButtonWrapper}
						disabled={!isOurTurn}
					>
						<UnoCardComponent key={card.cardId} card={card} />
					</Button>
				</li>
			))}
		</ul>
	</div>
);

export default CardsList;
