import clsx from 'clsx';
import { forwardRef } from 'react';
import classes from './Input.module.css';

const castArray = (value: string | string[]) => (Array.isArray(value) ? value : [value]);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: React.ReactNode;
	error?: string | string[] | null;
	containerClassName?: string;
	labelClassName?: string;
	labelVisuallyHidden?: boolean;
	children?: React.ReactNode;
	id: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
	{
		label,
		error,
		containerClassName,
		labelClassName,
		labelVisuallyHidden,
		children,
		id,
		...rest
	}: InputProps,
	ref,
) => (
	<div className={clsx(classes.container, containerClassName)}>
		<label
			htmlFor={id}
			className={clsx(
				classes.label,
				labelClassName,
			)}
		>
			<span className={clsx(labelVisuallyHidden && 'visuallyHidden')}>
				{label}
			</span>
			{error
					&& castArray(error).map((err) => (
						<p key={err} className={classes.errorMsg}>
							{err}
						</p>
					))}
		</label>

		<div className={classes.inputContainer}>
			<input
				{...rest}
				ref={ref}
				id={id}
				aria-invalid={!!error}
				className={clsx(classes.input, error && classes.error, rest.className)}
			/>
			{children}
		</div>
	</div>
));

export default Input;
