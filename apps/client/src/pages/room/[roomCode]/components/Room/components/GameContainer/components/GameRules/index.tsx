import { Button } from '@/components';
import * as Dialog from '@radix-ui/react-dialog';
import type { GamesType } from '@shared/types';
import { IconVocabulary, IconX } from '@tabler/icons-react';
import { Games } from '@shared/types';
import classes from './GameRules.module.css';

const rulesObj = {
	[Games.UNO]: {
		description: 'Chaos Cards is an Uno inspired game, meaning most of the same rules apply.',
		rules: [
			'When it\'s your turn, you can play a card with the same face or color as the current card, or any card with a black background.',
			'If you can\'t play a card, you must draw a card from the deck. After drawing a card you may play a card or end your turn.',
			'If the player before you plays a (+2) or (+4) card, you can only play a (+2) or (+4) card. When multiple people play (+2) or (+4) cards in a row, the count of cards to draw is added together.',
			'If you can\'t play a (+2) or (+4) card, you must draw the amount of cards specified by the draw count.',
			'The order of players starts clockwise, but can be changed by playing a reverse card.',
			'Playing a skip card skips the next player. When 2 players are playing, the person who played the skip card plays again.',
		],
	},
};

type SpectatorDialogProps = {
	game: GamesType;
};
const GameRules = ({ game }: SpectatorDialogProps) => {
	const { description, rules } = rulesObj[game];

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<Button
					variant="cartoon"
					className={classes.openButton}
					aria-label="view rules"
					withCartoonRay={false}
				>
					<IconVocabulary />
				</Button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className={classes.overlay} />
				<Dialog.Content className={classes.dialog}>
					<Dialog.Close asChild>
						<Button variant="light" className={classes.closeButton} aria-label="close rules">
							<IconX />
						</Button>
					</Dialog.Close>
					<div>
						<Dialog.Title>{`${game} rules`}</Dialog.Title>
						<Dialog.Description>{description}</Dialog.Description>
					</div>

					<ul className={classes.rulesList}>
						{rules.map((rule) => (
							<li key={rule}>{rule}</li>
						))}
					</ul>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default GameRules;
