import type { UnoCard } from '@shared/types';
import Image from 'next/image';
import { memo } from 'react';
import dynamic from 'next/dynamic';

type UnoCardProps = {
	card: UnoCard | null;
	className?: string;
};

// maybe move to types if needed elsewhere
const specialCardLabelMap = {
	wild: 'wildcard choose color',
	'wild-draw-four': 'wildcard draw four',
	reverse: 'reverse order',
	skip: 'next user skips turn',
	'draw-two': 'draw two',
} as const;

const cardToLabel = (card: UnoCardProps['card']) => {
	if (!card) {
		return 'unknown card';
	}

	const { type, value } = card;
	if (type === 'wild-card') {
		return specialCardLabelMap[value];
	} if (type === 'special-card') {
		return `${card.color} ${specialCardLabelMap[value]}`;
	}

	return `${card.color} ${value}`;
};

const UnoCardComponent = ({ card, className }: UnoCardProps) => {
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
			<p className="visually-hidden">
				{cardToLabel(card)}
			</p>
			<Image
				// src={`https://placehold.co/150x225/png?text=${imgFilename}`}
				// src="/img/uno/cards/red-0.png"
				// src="/img/uno/cards/red-0.png"
				src={`/img/uno/cards/${imgFilename}.png`}
				loading="eager"
				alt=""
				width={125}
				height={187.5}
				className={className}
				draggable={false}
				style={{
					backgroundColor: card?.type === 'special-card' || card?.type === 'number-card'
						? `var(--uno-color-${card.color})` : 'var(--uno-color-black)',
					borderRadius: '0.5rem',
				}}
			/>
		</div>
	);
};

export default memo(UnoCardComponent);
