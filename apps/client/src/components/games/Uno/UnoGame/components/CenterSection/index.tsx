import { Button } from '@/components';
import type { UnoCard } from '@shared/types';
import classes from './CenterSection.module.css';
import UnoCardComponent from '../UnoCard';

type CenterSectionProps = {
	currentCard: UnoCard;
};
const CenterSection = ({ currentCard }: CenterSectionProps) => {
	console;

	return (
		<div className={classes.container}>
			<div className={classes.cardsContainer}>
				<Button variant="unstyled" aria-label="draw a card">
					<UnoCardComponent card={null} />
				</Button>
				<UnoCardComponent card={currentCard} />
			</div>
		</div>
	);
};

export default CenterSection;
