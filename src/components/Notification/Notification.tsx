import classNames from 'classnames/bind';
import React, {
	createContext,
	ForwardedRef,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { useMounted } from '../../utils/useMounted';
import styles from './Notification.module.scss';

const c = classNames.bind(styles);

const TIMEOUT = 3000;

type NotificationPayload = { message: string; type: 'success' | 'error' };

export type NotificationHandle = {
	notify: (props: NotificationPayload) => void;
};

export const NotificationContext = createContext<NotificationHandle>({
	notify: () => null,
});

interface NotificationProps {}

function Notification(
	{}: NotificationProps,
	forwardedRef: ForwardedRef<NotificationHandle>,
) {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState('');
	const [type, setType] = useState<NotificationPayload['type']>('success');

	const { isMounted } = useMounted();

	const timeout = useRef<NodeJS.Timeout>();

	useImperativeHandle(forwardedRef, () => ({
		notify: (n) => {
			if (timeout.current) {
				clearTimeout(timeout.current);
				timeout.current = undefined;
			}

			setType(n.type);
			setMessage(n.message);
			setVisible(true);

			timeout.current = setTimeout(() => {
				if (isMounted.current) setVisible(false);
			}, TIMEOUT);
		},
	}));

	return (
		<div className={c('wrapper', { visible }, type)} aria-hidden={!visible}>
			<p className={c('text')}>{message}</p>

			<button className={c('close')} onClick={() => setVisible(false)} />
		</div>
	);
}

export default forwardRef(Notification);
