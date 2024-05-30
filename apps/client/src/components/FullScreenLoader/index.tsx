import classes from './FullScreenLoader.module.css';

// SOURCE: https://cssloaders.github.io/
const FullScreenLoader = () => (
	<div className={classes.root} aria-busy="true" />
);

export default FullScreenLoader;
