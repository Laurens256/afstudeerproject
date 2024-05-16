/* eslint-disable no-console, react-hooks/exhaustive-deps */
// SOURCE: https://github.com/mantinedev/mantine/tree/master/packages/%40mantine/hooks/src/use-local-storage
import { useCallback, useEffect, useState } from 'react';

interface StorageProperties<T> {
	key: string;
	defaultValue?: T;
	getInitialValueInEffect?: boolean;
}

const deserializeJSON = (value: string | undefined) => {
	try {
		return value && JSON.parse(value);
	} catch {
		return value;
	}
};

const useLocalStorage = <T>(props: StorageProperties<T>) => {
	const getItem = (key: string) => localStorage.getItem(key);
	const setItem = (key: string, value: string) => localStorage.setItem(key, value);
	const removeItem = (key: string) => localStorage.removeItem(key);

	const { key, defaultValue, getInitialValueInEffect = true } = props;

	const readStorageValue = useCallback((skipStorage?: boolean): T => {
		let storageBlockedOrSkipped;

		try {
			storageBlockedOrSkipped = typeof window === 'undefined'
            || !('localStorage' in window)
            || localStorage === null
            || !!skipStorage;
		} catch (_e) {
			storageBlockedOrSkipped = true;
		}

		if (storageBlockedOrSkipped) {
			return defaultValue as T;
		}

		const storageValue = getItem(key);
		return storageValue !== null ? deserializeJSON(storageValue) : (defaultValue as T);
	}, [key, defaultValue]);

	const [value, setValue] = useState<T>(readStorageValue(getInitialValueInEffect));

	const setStorageValue = useCallback((val: T | ((prevState: T) => T)) => {
		if (val instanceof Function) {
			setValue((current) => {
				const result = val(current);
				setItem(key, JSON.stringify(result));
				window.dispatchEvent(new CustomEvent('useLocalStorage', { detail: { key, value: val(current) } }));
				return result;
			});
		} else {
			setItem(key, JSON.stringify(val));
			window.dispatchEvent(new CustomEvent('useLocalStorage', { detail: { key, value: val } }));
			setValue(val);
		}
	}, [key]);

	const removeStorageValue = useCallback(() => {
		removeItem(key);
		window.dispatchEvent(new CustomEvent('useLocalStorage', { detail: { key, value: defaultValue } }));
	}, []);

	useEffect(() => {
		if (defaultValue !== undefined && value === undefined) {
			setStorageValue(defaultValue);
		}
	}, [defaultValue, value, setStorageValue]);

	useEffect(() => {
		const val = readStorageValue();
		if (val !== undefined) {
			setStorageValue(val);
		}

		const storageListener = (event: StorageEvent) => {
			if (event.storageArea === localStorage && event.key === key) {
				setValue(deserializeJSON(event.newValue ?? undefined));
			}
		};
		const customStorageListener = (event: CustomEvent) => {
			if (event.detail.key === key) {
				setValue(event.detail.value);
			}
		};

		window.addEventListener('useLocalStorage' as any, customStorageListener);
		window.addEventListener('storage', storageListener);
		return () => {
			window.removeEventListener('useLocalStorage' as any, customStorageListener);
			window.removeEventListener('storage', storageListener);
		};
	}, []);

	return [value === undefined
		? defaultValue
		: value, setStorageValue, removeStorageValue] as [
		T,
		(val: T | ((prevState: T) => T)) => void,
		() => void,
	];
};

export default useLocalStorage;
