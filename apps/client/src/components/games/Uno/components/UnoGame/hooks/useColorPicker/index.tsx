import { Button } from '@/components';
import type { UnoCard, UnoColor } from '@shared/types';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import classes from './ColorPicker.module.css';
import { cardToLabel } from '../../../../util';

// very cool hook, allows awaiting user input asynchronously :0
const useColorPicker = (cards: UnoCard[] = []) => {
	const [open, setOpen] = useState(false);
	const [resolver, setResolver] = useState<((value: UnoColor) => void) | null>(null);
	const colors: UnoColor[] = ['red', 'yellow', 'green', 'blue'];

	// partially based on https://daveteu.medium.com/react-custom-confirmation-box-458cceba3f7b
	const getColorFromPicker = async (): Promise<UnoColor> => {
		setOpen(true);
		let resolveFunc: (value: UnoColor) => void;
		const promise = new Promise<UnoColor>((resolve) => {
			resolveFunc = resolve;
		});
		setResolver(() => resolveFunc);
		return promise;
	};

	const onClick = (color: UnoColor) => {
		setOpen(false);
		if (resolver) {
			resolver(color);
		}
	};

	const ColorPicker = () => (
		<Dialog.Root open={open}>
			<Dialog.Overlay className={classes.overlay} />
			<Dialog.Content className={classes.container}>
				<Dialog.Title className={classes.title}>
					What&apos;ll the new color be?
				</Dialog.Title>

				<div className={classes.colorsContainer}>
					{colors.map((color) => (
						<Button
							key={color}
							onClick={() => onClick(color)}
							aria-label={color}
							variant="unstyled"
							style={{ backgroundColor: `var(--uno-color-${color})` }}
							className={clsx(classes.colorButton, classes[color])}
						/>
					))}
				</div>
				<div className="visuallyHidden">
					<h3>Your cards are:</h3>
					<ul>
						{cards.map((card) => (
							<li key={card.cardId}>{cardToLabel(card)}</li>
						))}
					</ul>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);

	return [getColorFromPicker, ColorPicker] as const;
};

export default useColorPicker;
