import { useRef } from 'react';

type GameHistoryProps = {
	entries: { key: string, entry: React.ReactNode }[];
	urgency?: 'assertive' | 'polite';
};
const GameHistory = ({ entries, urgency = 'assertive' }: GameHistoryProps) => {
	const ref = useRef<HTMLOListElement>(null);

	return (
		<div className="visuallyHidden">
			<ol ref={ref} aria-label="game history">
				{entries.map(({ key, entry }) => (
					<li key={key}>
						{entry}
					</li>
				))}
			</ol>
			<p aria-live={urgency}>
				{entries[0]?.entry}
			</p>
		</div>
	);
};

export default GameHistory;
