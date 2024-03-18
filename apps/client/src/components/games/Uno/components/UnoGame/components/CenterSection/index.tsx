import { Button } from '@/components';
import type { UnoCard, UnoColor } from '@shared/types';
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
	getColorFromPicker: () => Promise<UnoColor>;
};
const CenterSection = ({
	currentCard,
	canDoAction,
	disableCanDoAction,
	canSkipTurn,
	hasDrawnCard,
	setHasDrawnCard,
	cardDrawCounter,
	getColorFromPicker,
}: CenterSectionProps) => {
	const onDrawCard = async () => {
		if (canDoAction && !hasDrawnCard) {
			setHasDrawnCard(true);
			socket.emit('UNO_DRAW_CARDS', cardDrawCounter || 1);

			// if cardDrawCounter > 0 and currentCard is wild-draw-four, user is allowed to choose
			// color because they had to draw and last card was wild-draw-four
			// check for > 0 because user can draw card when they were not forced because of draw 4
			if (cardDrawCounter > 0 && currentCard.value === 'wild-draw-four') {
				const color = await getColorFromPicker();
				socket.emit('UNO_CHOOSE_COLOR', color);
			}
		} else if (hasDrawnCard) {
			alert('You already drew a card, you can end your turn or play a card');
		} else {
			alert('It\'s not your turn');
		}
	};

	const onSkipTurn = () => {
		if (canSkipTurn) {
			disableCanDoAction();
			socket.emit('UNO_SKIP_TURN');
		} else {
			alert('You can\'t end your turn until you draw a card or play a card');
		}
	};

	return (
		<div className={classes.container}>
			<Button onClick={onSkipTurn}>
				END TURN
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
