export type ToastProps = {
	variant?: 'info' | 'success' | 'warning' | 'error';
	title?: React.ReactNode;
	message?: React.ReactNode;
};

const Toast = ({ title, message, variant = 'info' }: ToastProps) => {
	console;
	return (
		<div>
			<h3>{title}</h3>
			<p>{message}</p>
		</div>
	);
};

export default Toast;
