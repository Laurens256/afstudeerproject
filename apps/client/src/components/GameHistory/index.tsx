import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { IconHistory } from '@tabler/icons-react';
import { useLocalStorage } from '@/hooks';
import classes from './GameHistory.module.css';
import Button from '../Button';

type GameHistoryProps = {
	entries: React.ReactNode[];
	className?: string;
	urgency?: 'assertive' | 'polite';
};
// TODO: make collapsible, test if should still read when collapsed
// TODO: test assertive vs polite
const GameHistory = ({ entries, className, urgency = 'assertive' }: GameHistoryProps) => {
	const ref = useRef<HTMLOListElement>(null);
	const [isCollapsed, setIsCollapsed] = useLocalStorage('gameHistoryCollapsed', false);

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight;
		}
	}, [entries]);

	useEffect(() => {
		if (!isCollapsed) {
			const element = ref.current;
			if (element) {
				element.scrollTop = element.scrollHeight;
				element.focus();
			}
		}
	}, [isCollapsed]);

	return (
		<>
			<div className={clsx(classes.container, isCollapsed && classes.collapsed, className)}>
				<Button
					variant="cartoon"
					cartoonColor="hsl(241, 62%, 55%)"
					withCartoonRay={false}
					className={clsx(classes.toggleButton, isCollapsed && classes.collapsed)}
					onClick={() => setIsCollapsed(!isCollapsed)}
					aria-label={isCollapsed ? 'enable game state reader' : 'disable game state reader'}
				>
					<IconHistory className={classes.historyIcon} size={20} />
				</Button>
				{!isCollapsed && (
					<div className={classes.listWrapper}>
						<h3 id="game_history">Game history</h3>
						<ol className={classes.list} ref={ref} aria-labelledby="game_history">
							{entries.map((entry, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<li key={index} className={classes.entry}>
									{entry}
								</li>
							))}
						</ol>
					</div>
				)}
			</div>
			<p className="visually-hidden" aria-live={urgency}>
				{entries[entries.length - 1]}
			</p>
		</>
	);
};

export default GameHistory;
