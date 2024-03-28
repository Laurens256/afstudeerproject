import type { UnoCard } from '@shared/types';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { IconRefresh } from '@tabler/icons-react';
import classes from './SpecialCardsLayer.module.css';
import { Skip, Reverse } from './components';

type SpecialCardsLayerProps = {
	currentCard: UnoCard;
	isClockwise: boolean;
};

const SpecialCardsLayer = ({ currentCard, isClockwise }: SpecialCardsLayerProps) => {
	const [key, setKey] = useState(currentCard.cardId);
	useEffect(() => {
		if (currentCard.type === 'special-card' || currentCard.type === 'wild-card') {
			setKey(currentCard.cardId);
		}
	}, [currentCard]);

	return (
		<div className={classes.container} aria-hidden="true">
			<div
				className={classes.fadeContainer}
				key={key}
				style={{
					'--glow-color': currentCard.type === 'wild-card' ? 'var(--uno-color-black)' : `var(--uno-color-${currentCard.color})`,
				} as React.CSSProperties}
			>
				{currentCard.type === 'special-card' && currentCard.value === 'draw-two' && (
					<p className={classes.text}>+2</p>
				)}
				{currentCard.type === 'special-card' && currentCard.value === 'skip' && (
					<Skip className={classes.svg} />
				)}
				{currentCard.type === 'special-card' && currentCard.value === 'reverse' && (
					<Reverse className={clsx(
						classes.svg,
						classes.reverse,
						!isClockwise && classes.counterClockwise,
					)}
					/>
				)}
				{currentCard.type === 'wild-card' && currentCard.value === 'wild-draw-four' && (
					<p className={classes.text}>+4</p>
				)}
				{currentCard.type === 'wild-card' && currentCard.value === 'wild' && (
					<p className={classes.text}>Choose color</p>
				)}
			</div>

			{/* <div className={clsx(
				classes.directionIndicator,
				!isClockwise && classes.counterClockwise,
			)}
			>
				<IconRefresh />
			</div> */}
		</div>
	);
};

export default SpecialCardsLayer;
