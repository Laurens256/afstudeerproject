import type { Message } from '@shared/types';
import { useEffect, useRef } from 'react';

const useScrollToBottom = (messages: Message[]) => {
	const listRef = useRef<HTMLOListElement>(null);

	useEffect(() => {
		const checkShouldScrollToBottom = (addedElement: HTMLLIElement) => {
			const list = listRef.current;
			if (!list) return;

			const lastMessageStyle = window.getComputedStyle(addedElement);
			const marginTop = parseInt(lastMessageStyle.marginTop, 10);
			const marginBottom = parseInt(lastMessageStyle.marginBottom, 10);

			const lastMessageHeight = addedElement.offsetHeight + marginTop + marginBottom;
			const messagesListHeight = list.scrollHeight;
			const heightBeforeLastMessage = messagesListHeight - lastMessageHeight;
			const scrollPosition = list.scrollTop + list.clientHeight;

			if (scrollPosition >= heightBeforeLastMessage - 10) {
				list.scrollTo({ top: messagesListHeight, behavior: 'auto' });
			}
		};

		const addedElement = listRef.current?.lastElementChild as HTMLLIElement;
		if (addedElement) {
			checkShouldScrollToBottom(addedElement);
		}
	}, [messages]);

	return listRef;
};

export default useScrollToBottom;
