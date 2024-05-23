type GameHistoryProps = {
	entries: { key: string, entry: React.ReactNode }[];
	urgency?: 'assertive' | 'polite';
};
// where the magic happens B), invisible to non-screenreader users
// reads latest entry as it updates and stores old entries in list
// entry === any action that happens within a game, errors excluded
// errors are handled by GameErrorToastProvider since they're also visible for non-screenreader users
// ^^ also errors are not as relevant to store in history list
const GameHistory = ({ entries, urgency = 'assertive' }: GameHistoryProps) => (
	<div className="visuallyHidden">
		<ol aria-label="game history">
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

export default GameHistory;
