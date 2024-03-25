import { ToastQueue, useToastQueue } from '@react-stately/toast';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classes from './ToastProvider.module.css';
import Toast, { type ToastProps } from './Toast';

const toastQueue = new ToastQueue<ToastProps>({
	maxVisibleToasts: 10,
});

const ToastProvider = () => {
	const [isMounted, setIsMounted] = useState(false);
	const ref = useRef(null);
	const state = useToastQueue(toastQueue);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return createPortal(
		<ol
			role="region"
			aria-label="Notifications"
			tabIndex={-1}
			ref={ref}
			className={classes.container}
		>
			{state.visibleToasts.map(({ key, content: { title, message, variant } }) => (
				<li className={classes.toastItem}>
					<Toast
						key={key}
						variant={variant}
						title={title}
						message={message}
					/>
				</li>
			))}
		</ol>,
		document.body,
	);
};

export { ToastProvider, toastQueue };
