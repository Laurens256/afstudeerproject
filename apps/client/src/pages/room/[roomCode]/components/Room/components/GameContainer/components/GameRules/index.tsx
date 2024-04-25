import { Button } from '@/components';
import * as Dialog from '@radix-ui/react-dialog';
import type { GamesType } from '@shared/types';
import { IconVocabulary } from '@tabler/icons-react';
import { Games } from '@shared/types';
import { Fragment } from 'react';
import classes from './GameRules.module.css';

const rulesObj = {
	[Games.UNO]: {
		description: 'Chaos Cards is an Uno inspired game, meaning most of the same rules apply.',
		rules: {
			General: ['When it\'s your turn, you can play a card with the same face or color as the current card, or any card with a black background.',
				'If you can\'t play a card, you must draw a card from the deck. After drawing a card you may play a card or end your turn.',
				'If the player before you plays a (+2) or (+4) card, you can only play a (+2) or (+4) card. When multiple people play (+2) or (+4) cards in a row, the count of cards to draw is added together.',
				'If you can\'t play a (+2) or (+4) card, you must draw the amount of cards specified by the draw count.'],
		},
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
					<div>
						<Dialog.Title>{`${game} rules`}</Dialog.Title>
						<Dialog.Description>{description}</Dialog.Description>
					</div>

					<ul className={classes.rulesList}>
						{/* {rules.map((rule, index) => (
							<li key={rule}>{rule}</li>
						))} */}
						{Object.entries(rules).map(([category, rulesPerCategory]) => (
							<Fragment key={category}>
								<li className={classes.ruleHeading}><h3>{category}</h3></li>
								{rulesPerCategory.map((rule) => (
									<li key={rule}>{rule}</li>
								))}
							</Fragment>
						))}
					</ul>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default GameRules;
