import clsx from 'clsx';
import classes from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	variant?: 'filled' | 'outline' | 'light' | 'icon';
	loading?: boolean;
	innerRef?: React.Ref<HTMLButtonElement>;
	inert?: string;
}

const Button = ({
	children, variant = 'filled', loading, innerRef, ...props
}: ButtonProps) => (
	<button
		{...props}
		ref={innerRef}
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
