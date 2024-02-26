import clsx from 'clsx';
import classes from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: 'filled' | 'outline' | 'light';
	loading?: boolean;
}

const Button = ({
	children, variant = 'filled', loading, ...props
}: ButtonProps) => (
	<button
		{...props}
		disabled={loading}
		// eslint-disable-next-line react/button-has-type
		type={props.type || 'button'}
		className={clsx(classes.button, props.className, classes[variant])}
	>
		{loading && <span className={classes.loader} />}
		{children}
	</button>
);

export default Button;
