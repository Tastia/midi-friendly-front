import { useEffect, useRef } from 'react';

export function useMounted() {
	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true; // pour reset son state lorsqu'on dev

		return () => {
			isMounted.current = false;
		};
	}, []);

	return { isMounted };
}
