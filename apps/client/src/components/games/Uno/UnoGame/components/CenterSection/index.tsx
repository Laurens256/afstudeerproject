import { Button } from '@/components';
import type { UnoCard } from '@shared/types';
import socket from '@/socket';
import classes from './CenterSection.module.css';
import UnoCardComponent from '../UnoCard';

type CenterSectionProps = {
	currentCard: UnoCard;
	canDoAction: boolean;
	disableCanDoAction: () => void;
};
const CenterSection = ({ currentCard, canDoAction, disableCanDoAction }: CenterSectionProps) => {
	const onDrawCard = () => {
		if (canDoAction) {
			// disableCanDoAction();
			socket.emit('UNO_DRAW_CARDS', 1);
		}
	};

	return (
		<div className={classes.container}>
			<div className={classes.cardsContainer}>
				<Button variant="unstyled" aria-label="draw a card" onClick={onDrawCard}>
					<UnoCardComponent card={null} />
				</Button>
				<UnoCardComponent card={currentCard} />
			</div>
		</div>
	);
};

export default CenterSection;
