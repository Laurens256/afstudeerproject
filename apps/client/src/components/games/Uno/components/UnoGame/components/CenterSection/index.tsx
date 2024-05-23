import { Button } from '@/components';
import type { UnoCard, UnoColor } from '@shared/types';
import socket from '@/socket';
import clsx from 'clsx';
import type { GameErrorToastProps } from '@/types';
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
	showErrorToast: (props: GameErrorToastProps) => void;
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
	showErrorToast,
}: CenterSectionProps) => {
	const onDrawCard = async () => {
		if (canDoAction && !hasDrawnCard) {
			setHasDrawnCard(true);
			socket.emit('UNO_DRAW_CARDS', cardDrawCounter || 1);

			// if cardDrawCounter > 0 and currentCard is wild-draw-four, user is allowed to choose
			// color because they had to draw and last card was wild-draw-four
			// check for > 0 because user can draw card when they were not forced because of draw 4, trust me
			if (cardDrawCounter > 0 && currentCard.value === 'wild-draw-four') {
				const color = await getColorFromPicker();
				socket.emit('UNO_CHOOSE_COLOR', color);
			}
		} else if (canDoAction && hasDrawnCard) {
			showErrorToast({ message: 'You already drew a card, you can end your turn or play a card' });
		} else {
			showErrorToast({ message: 'It\'s not your turn' });
		}
	};

	const onSkipTurn = () => {
		if (canSkipTurn) {
			disableCanDoAction();
			socket.emit('UNO_END_TURN');
		} else if (!canDoAction) {
			showErrorToast({ message: 'It\'s not your turn' });
		} else {
			showErrorToast({ message: 'You can\'t end your turn until you draw or play a card' });
		}
	};

	const enabledHsl = 'hsl(241, 62%, 55%)';
	const disabledHsl = 'hsl(211, 12%, 48%)';
	const drawButtonDisabled = !canDoAction || (canDoAction && hasDrawnCard);
	const endTurnButtonDisabled = !canSkipTurn;
	return (
		<div className={classes.container}>
			<Button
				variant="cartoon"
				onClick={onDrawCard}
				className={clsx(classes.skipTurnButton, classes.button)}
				disabled={drawButtonDisabled}
				cartoonColor={drawButtonDisabled ? disabledHsl : enabledHsl}
			>
				{`DRAW CARD${cardDrawCounter > 1 ? `S (${cardDrawCounter})` : ''}`}
			</Button>
			<div className={classes.cardsContainer}>
				<UnoCardComponent card={currentCard} cardLabelPrefix="Current card: " />
			</div>
			<Button
				variant="cartoon"
				onClick={onSkipTurn}
				className={clsx(classes.skipTurnButton, classes.button)}
				cartoonColor={endTurnButtonDisabled ? disabledHsl : enabledHsl}
				disabled={endTurnButtonDisabled}
			>
				END TURN
			</Button>
		</div>
	);
};

export default CenterSection;
