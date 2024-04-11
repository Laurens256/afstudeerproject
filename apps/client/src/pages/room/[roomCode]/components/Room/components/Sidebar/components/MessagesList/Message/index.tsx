import { type Message, type UserMessage, type JoinedLeftMessage } from '@shared/types';
import clsx from 'clsx';
import { memo } from 'react';
import { Avatar } from '@/components';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import classes from './Message.module.css';

type UserMessageComponentProps = {
	message: UserMessage;
	prevMsgSameUser: boolean;
};
const UserMessageComponent = ({ message, prevMsgSameUser }: UserMessageComponentProps) => {
	const { username, text } = message;

	return (
		<li
			className={clsx(
				classes.userMessage,
				classes.message,
				!prevMsgSameUser && classes.firstByUser,
			)}
		>
			<div className={classes.iconContainer}>
				{!prevMsgSameUser && (
					<Avatar name={username} />
				)}
			</div>
			<div>
				{!prevMsgSameUser && (
					<b className={classes.username}>{username}</b>
				)}
				<p className={classes.msgText}>{text}</p>
			</div>
		</li>
	);
};

const JoinedLeftMessageComponent = ({ text, action }: JoinedLeftMessage) => (
	<li className={clsx(
		classes.joinedLeftMessage,
		classes.message,
	)}
	>
		<div className={classes.iconContainer}>
			{action === 'joined'
				? <IconArrowRight className={clsx(classes.iconJoined, classes.iconJoinedLeft)} />
				: <IconArrowLeft className={clsx(classes.iconLeft, classes.iconJoinedLeft)} />}
		</div>
		<p>{text}</p>
	</li>
);

type MessageComponentProps = {
	message: Message;
	prevMsgSameUser: boolean;
};
const MessageComponent = ({ message, prevMsgSameUser }: MessageComponentProps) => {
	if (message.type === 'user') {
		return (
			<UserMessageComponent
				message={message}
				prevMsgSameUser={prevMsgSameUser}
			/>
		);
	}
	return <JoinedLeftMessageComponent {...message} />;
};

export default memo(MessageComponent);
