import { Button } from '@/components';
import type { UnoCard } from '@shared/types';
import socket from '@/socket';
import classes from './CenterSection.module.css';
import UnoCardComponent from '../UnoCard';

type CenterSectionProps = {
	currentCard: UnoCard;
	canDoAction: boolean;
	disableCanDoAction: () => void;
	canSkipTurn: boolean;
	hasDrawnCard: boolean;
	setHasDrawnCard: (hasDrawn: boolean) => void;
	cardDrawCounter: number;
};
const CenterSection = ({
	currentCard,
	canDoAction,
	disableCanDoAction,
	canSkipTurn,
	hasDrawnCard,
	setHasDrawnCard,
	cardDrawCounter,
}: CenterSectionProps) => {
	const onDrawCard = () => {
		if (canDoAction && !hasDrawnCard) {
			setHasDrawnCard(true);
			socket.emit('UNO_DRAW_CARDS', cardDrawCounter || 1);
		} else if (hasDrawnCard) {
			alert('You already drew a card, you can skip your turn or play a card');
		} else {
			alert('It\'s not your turn');
		}
	};

	const onSkipTurn = () => {
		if (canSkipTurn) {
			disableCanDoAction();
			socket.emit('UNO_SKIP_TURN');
		} else {
			alert('You can\'t skip your turn');
		}
	};

	return (
		<div className={classes.container}>
			<Button onClick={onSkipTurn}>
				SKIP TURN
			</Button>
			<div className={classes.cardsContainer}>
				<Button variant="unstyled" aria-label="draw a card" onClick={onDrawCard}>
					<UnoCardComponent card={null} />
				</Button>
				<UnoCardComponent card={currentCard} />
			</div>
			<Button>
				UNO
			</Button>
		</div>
	);
};

export default CenterSection;
