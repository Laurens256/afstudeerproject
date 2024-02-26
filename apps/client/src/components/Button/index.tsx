import classes from './Button.module.css';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: 'filled' | 'outline';
	loading?: boolean;
}

const Button = ({ children, variant = 'outline', loading, ...props }: ButtonProps) => {
	return (
		<button
			{...props}
			className={clsx(classes.button, props.className, classes[variant])}>
			{loading && <span className={classes.loader} />}
			{children}
		</button>
	);
};

export default Button;
