import clsx from 'clsx';
import classes from './TurnIndicator.module.css';

type TurnIndicatorProps = {
	isOurTurn: boolean;
	username: string;
};
const TurnIndicator = ({ isOurTurn, username }: TurnIndicatorProps) => (
	<p
		key={String(isOurTurn)}
		className={clsx(
			'cartoonText',
			classes.container,
			isOurTurn && classes.ourTurn,
		)}
	>
		{`It's ${isOurTurn ? 'your' : username} turn`}
	</p>
);

export default TurnIndicator;
