import type { UnoCard, UnoColor } from '@shared/types';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import classes from './SpecialCardsLayer.module.css';
import { Skip, Reverse } from './components';

type SpecialCardsLayerProps = {
	currentCard: UnoCard;
	isClockwise: boolean;
	chosenColor: UnoColor | null;
};

// layer for animations on special cards (draw 2/4, skip, reverse, color picker)
const SpecialCardsLayer = ({ currentCard, isClockwise, chosenColor }: SpecialCardsLayerProps) => {
	const [key, setKey] = useState(currentCard.cardId);
	useEffect(() => {
		if (currentCard.type === 'special-card' || currentCard.type === 'wild-card') {
			setKey(currentCard.cardId);
		}
	}, [currentCard]);

	let glowColor = 'var(--uno-color-black)';
	if (currentCard.type === 'wild-card') {
		glowColor = `var(--uno-color-${chosenColor || 'black'})`;
	} else {
		glowColor = `var(--uno-color-${currentCard.color})`;
	}

	return (
		<div className={classes.container} aria-hidden="true">
			<div
				className={classes.fadeContainer}
				key={`${key}${chosenColor}`}
				style={{ '--glow-color': glowColor } as React.CSSProperties}
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
				{currentCard.type === 'wild-card' && currentCard.value === 'wild-draw-four' && !chosenColor && (
					<p className={classes.text}>+4</p>
				)}
				{currentCard.type === 'wild-card' && chosenColor && (
					<p className={classes.text}>
						{chosenColor.toUpperCase()}
					</p>
				)}
			</div>
		</div>
	);
};

export default SpecialCardsLayer;
