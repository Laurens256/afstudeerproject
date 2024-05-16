import clsx from 'clsx';
import { memo } from 'react';
import type { UnoCard } from '@shared/types';
import { Avatar } from '@/components';
import classes from './OpponentCardsList.module.css';
import UnoCardComponent from '../UnoCard';

type OpponentCardsListProps = {
	cards: UnoCard[];
	isCurrentPlayer: boolean;
	username: string;
};

const OpponentCardsList = ({ cards, isCurrentPlayer, username }: OpponentCardsListProps) => {
	const rotateStep = 180 / cards.length;
	return (
		<div className={clsx(classes.container, isCurrentPlayer && classes.currentPlayer)}>
			<ul className={classes.cardsList} aria-hidden="true">
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

			<article
				className={classes.userInfoContainer}
				aria-label={`${username}${username.endsWith('s') ? '\'' : '\'s'} cards`}
			>
				<Avatar name={username} sizeRem={2.5} />

				<div>
					<h3 className={classes.username}>{username}</h3>
					<p>{`${cards.length} card${cards.length === 1 ? '' : 's'}`}</p>
				</div>
			</article>
		</div>
	);
};

export default memo(OpponentCardsList);
