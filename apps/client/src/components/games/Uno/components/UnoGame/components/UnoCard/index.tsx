import type { UnoCard } from '@shared/types';
import Image from 'next/image';
import React, { memo } from 'react';
import clsx from 'clsx';
import { cardToLabel } from '@/components/games/Uno/util';
import classes from './UnoCard.module.css';

type UnoCardProps = {
	card: UnoCard | null;
	className?: string;
	cardLabelPrefix?: string;
	scale?: number;
	style?: React.CSSProperties;
};

const UnoCardComponent = ({ card, className, cardLabelPrefix = '', scale = 1, style }: UnoCardProps) => {
	let imgFilename = 'back';
	if (card) {
		const { type, value } = card;
		if (type === 'number-card' || type === 'special-card') {
			imgFilename = `${card.color}-${value}`;
		} else if (type === 'wild-card') {
			imgFilename = value;
		}
	}

	return (
		<div>
			<p className="visuallyHidden">
				{`${cardLabelPrefix}${cardToLabel(card)}`}
			</p>
			<Image
				src={`/img/uno/cards/${imgFilename}.png`}
				loading="eager"
				alt=""
				width={300}
				height={450}
				className={clsx(classes.image, className)}
				draggable={false}
				style={{
					backgroundColor: card?.type === 'special-card' || card?.type === 'number-card'
						? `var(--uno-color-${card.color})` : 'var(--uno-color-black)',
					'--scale': scale,
					...style,
				} as React.CSSProperties}
			/>
		</div>
	);
};

export default memo(UnoCardComponent);
