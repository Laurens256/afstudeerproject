import classes from './OpponentCardsList.module.css';
import UnoCard from '../UnoCard';

type OpponentCardsListProps = {
	cardIds: number[];
};

const OpponentCardsList = ({ cardIds }: OpponentCardsListProps) => {
	console;
	return (
		<ul className={classes.container}>
			{cardIds.map((cardId, i) => (
				<li
					key={cardId}
					className={classes.card}
					style={{}}
				>
					<UnoCard card={null} />
				</li>
			))}
		</ul>
	);
};

export default OpponentCardsList;
