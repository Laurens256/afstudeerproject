import type { UnoCard } from '@shared/types';

const specialCardLabelMap = {
	wild: 'Wildcard choose color',
	'wild-draw-four': 'Wildcard draw four',
	reverse: 'Reverse order',
	skip: 'Next user skips turn',
	'draw-two': 'Draw two',
} as const;

export const cardToLabel = (card: UnoCard | null) => {
	if (!card) {
		return 'Unknown card';
	}

	const { type, value } = card;
	if (type === 'wild-card') {
		return specialCardLabelMap[value];
	} if (type === 'special-card') {
		return `${card.color} ${specialCardLabelMap[value]}`;
	}

	return `${card.color} ${value}`;
};
