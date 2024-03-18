import { Button } from '@/components';
import type { UnoColor } from '@shared/types';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import classes from './ColorPicker.module.css';

const useColorPicker = () => {
	const [open, setOpen] = useState(false);
	const [resolver, setResolver] = useState<((value: UnoColor) => void) | null>(null);
	const colors: UnoColor[] = ['red', 'yellow', 'green', 'blue'];

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
				<Dialog.Title className={classes.title}>Choose a color</Dialog.Title>

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
			</Dialog.Content>
		</Dialog.Root>
	);

	return [getColorFromPicker, ColorPicker] as const;
};

export default useColorPicker;
