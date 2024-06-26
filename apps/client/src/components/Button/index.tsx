import clsx from 'clsx';
import { memo, forwardRef } from 'react';
import classes from './Button.module.css';

// generates necessary color variables for the cartoon button based on input color
// CODE SOURCE: https://codepen.io/Rybak/pen/xdzXNj (not the generateColorVariables func, but the css)
// DESIGN SOURCE: https://dribbble.com/shots/3456012-game-button
const generateColorVariables = (inputColor: string) => {
	const regex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/; // yup
	const match = inputColor?.match(regex);
	if (!match) return;
	const inputHue = Number(match[1]);
	const inputSaturation = Number(match[2]);
	const inputLightness = Number(match[3]);

	const ratios: Record<string, {
		hue: number, saturation: number, lightness: number, alpha?: number
	}> = {
		'--text-shadow-1': { hue: 1.015, saturation: 1.086, lightness: 0.524 },
		'--text-shadow-2': { hue: 1.040, saturation: 1.086, lightness: 0.426 },
		'--background-lines-1': { hue: 1, saturation: 1, lightness: 1 },
		'--background-lines-2': { hue: 1.020, saturation: 0.967, lightness: 1 },
		'--border-bottom': { hue: 1.030, saturation: 1.083, lightness: 0.512, alpha: 0.5 },
		'--border-top': { hue: 0, saturation: 0, lightness: 1.086, alpha: 0.3 },
		'--box-shadow-1': { hue: 1.010, saturation: 0.630, lightness: 0.426 },
		'--box-shadow-2': { hue: 0, saturation: 0, lightness: 0, alpha: 0.3 },
		'--box-shadow-3': { hue: 1.030, saturation: 0.815, lightness: 0.459 },
		'--box-shadow-4': { hue: 1.015, saturation: 0.772, lightness: 0.537 },
		'--box-shadow-5': { hue: 1.015, saturation: 0.837, lightness: 0.385 },
	};

	return Object.entries(ratios).reduce((acc, [key, ratio]) => {
		const hue = Math.floor(inputHue * ratio.hue);
		const saturation = Math.floor(inputSaturation * ratio.saturation);
		const lightness = Math.floor(inputLightness * ratio.lightness);
		if (ratio.alpha) {
			return { ...acc, [key]: `hsla(${hue}, ${saturation}%, ${lightness}%, ${ratio.alpha})` };
		}
		return { ...acc, [key]: `hsl(${hue}, ${saturation}%, ${lightness}%)` };
	}, {});
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: 'filled' | 'outline' | 'light' | 'icon' | 'unstyled' | 'cartoon';
	cartoonColor?: string;
	withCartoonRay?: boolean;
	loading?: boolean;
	inert?: string;
	disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
	children,
	variant = 'filled',
	cartoonColor = 'hsl(199, 92%, 61%)',
	withCartoonRay = true,
	loading,
	disabled,
	...props
}, ref) => (
	<button
		{...props}
		ref={ref}
		disabled={loading || disabled}
		// eslint-disable-next-line react/button-has-type
		type={props.type || 'button'}
		className={clsx(
			classes.button,
			classes[variant],
			variant === 'cartoon' && ['cartoonText'],
			withCartoonRay && classes.withCartoonRay,
			props.className,
		)}
		style={{
			...(variant === 'cartoon' ? generateColorVariables(cartoonColor) : {}),
			...props.style,
		}}
	>
		{loading && <span className="loader" />}
		{children}
	</button>
));

export default memo(Button);
