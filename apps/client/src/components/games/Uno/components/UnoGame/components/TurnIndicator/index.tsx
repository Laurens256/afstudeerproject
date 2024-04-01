import clsx from 'clsx';
import { Button } from '@/components';
import { useState } from 'react';
import classes from './TurnIndicator.module.css';

type TurnIndicatorProps = {
	isOurTurn: boolean;
	username: string;
};
const TurnIndicator = ({ isOurTurn, username }: TurnIndicatorProps) => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<Button
			className={clsx(
				classes.container,
				isCollapsed && classes.collapsed,
				isOurTurn && classes.isOurTurn,
				'cartoonText',
			)}
			variant="unstyled"
			onClick={() => setIsCollapsed((prev) => !prev)}
		>
			{`It's ${isOurTurn ? 'your' : username} turn`}
			<p className="visuallyHidden">, click to hide visually</p>
		</Button>
	);
};

export default TurnIndicator;
