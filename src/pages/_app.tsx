import classNames from 'classnames/bind';
import 'destyle.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRef } from 'react';
import Notification, {
	NotificationContext,
	NotificationHandle,
} from '../components/Notification/Notification';
import styles from './main.module.scss';
import '/src/styles/fonts.scss';
import '/src/styles/global.scss';

const c = classNames.bind(styles);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const notification = useRef<NotificationHandle>(null);

	const NotificationValue: NotificationHandle = {
		notify: (props) => notification.current?.notify(props),
	};

	return (
		<div className={c('main-wrapper')}>
			<SessionProvider session={session}>
				<NotificationContext.Provider value={NotificationValue}>
					<Component {...pageProps} />
				</NotificationContext.Provider>
			</SessionProvider>
			<Notification ref={notification} />
		</div>
	);
}

export default MyApp;
