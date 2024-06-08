import type { UnoCard } from '@shared/types';

const specialCardLabelMap = {
	wild: 'choose color',
	'wild-draw-four': 'draw four',
	reverse: 'reverse order',
	skip: 'next user skips turn',
	'draw-two': 'draw two',
} as const;

export const cardToLabel = (card: UnoCard | null) => {
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
