import { useEffect, useRef } from 'react';

// SOURCE: https://stackoverflow.com/a/57706747/16071690
const usePreviousState = <T>(value: T): T | undefined => {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = JSON.parse(JSON.stringify(value));
	});
	return ref.current;
};

export default usePreviousState;
