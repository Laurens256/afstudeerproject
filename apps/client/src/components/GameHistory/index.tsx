import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { IconHistory, IconX } from '@tabler/icons-react';
import { useLocalStorage } from '@/hooks';
import classes from './GameHistory.module.css';
import Button from '../Button';

type GameHistoryProps = {
	entries: { key: string, entry: React.ReactNode }[];
	className?: string;
	urgency?: 'assertive' | 'polite';
};
// TODO: test assertive vs polite
const GameHistory = ({ entries, className, urgency = 'assertive' }: GameHistoryProps) => {
	const ref = useRef<HTMLOListElement>(null);
	const [isCollapsed, setIsCollapsed] = useLocalStorage('gameHistoryCollapsed', false);

	useEffect(() => {
		if (!isCollapsed) {
			const element = ref.current;
			if (element) {
				element.focus();
			}
		}
	}, [isCollapsed]);

	const entriesReversed = entries.reverse();

	return (
		<>
			<div className={clsx(classes.container, isCollapsed && classes.collapsed, className)}>
				{isCollapsed && (
					<Button
						variant="cartoon"
						withCartoonRay={false}
						className={classes.openButton}
						onClick={() => setIsCollapsed(false)}
						aria-label="enable game state reader"
					>
						<IconHistory />
					</Button>
				)}
				{!isCollapsed && (
					<div className={classes.listWrapper}>
						<div className={classes.header}>
							<h3 id="game_history">Game history</h3>
							<Button aria-label="disable game state reader" variant="icon">
								<IconX
									size={20}
									className={classes.closeIcon}
									onClick={() => setIsCollapsed(true)}
								/>
							</Button>
						</div>
						<ol className={classes.list} ref={ref} aria-labelledby="game_history">
							{entriesReversed.map(({ key, entry }) => (
								<li key={key} className={classes.entry}>
									{entry}
								</li>
							))}
						</ol>
					</div>
				)}
			</div>
			<p className="visuallyHidden" aria-live={urgency}>
				{entriesReversed[0]?.entry}
			</p>
		</>
	);
};

export default GameHistory;
