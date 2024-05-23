import Link from 'next/link';
import { RoutePath } from '@/routes';
import classes from './404.module.css';

const Custom404 = () => (
	<main className={classes.container}>
		<h1>404 - Page Not Found</h1>
		<Link href={RoutePath.Home} className={classes.action}>go to home</Link>
	</main>
);

export default Custom404;
