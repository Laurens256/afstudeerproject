import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import type { UnoColor } from '@shared/types';
import { Button } from '@/components';
import classes from './ColorPicker.module.css';

type ColorPickerProps = {
	open: boolean;
};
const ColorPicker = ({ open }: ColorPickerProps) => {
	const colors: UnoColor[] = ['red', 'yellow', 'green', 'blue'];

	return (
		<Dialog.Root open={open}>
			<Dialog.Overlay className={classes.overlay} />
			<Dialog.Content className={classes.container}>
				<Dialog.Title className={classes.title}>Choose a color</Dialog.Title>

				<div className={classes.colorsContainer}>
					{colors.map((color) => (
						<Button
							key={color}
							// onClick={() => onColorChosen(color)}
							aria-label={color}
							variant="unstyled"
							style={{ backgroundColor: color }}
							className={clsx(classes.colorButton, classes[color])}
						/>
					))}
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
};

export default ColorPicker;
