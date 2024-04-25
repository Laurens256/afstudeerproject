import type { UnoCard } from '@shared/types';
import Image from 'next/image';
import { memo } from 'react';
import clsx from 'clsx';
import { cardToLabel } from '@/components/games/Uno/util';
import classes from './UnoCard.module.css';

type UnoCardProps = {
	card: UnoCard | null;
	className?: string;
	cardLabelPrefix?: string;
};

const UnoCardComponent = ({ card, className, cardLabelPrefix = '' }: UnoCardProps) => {
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
				// src={`https://placehold.co/150x225/png?text=${imgFilename}`}
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
				}}
			/>
		</div>
	);
};

export default memo(UnoCardComponent);
