import classNames from 'classnames/bind';
import { signIn, signOut, useSession } from 'next-auth/react';
import Logo from '../../svg/logo_horizontal.svg';
import styles from './Header.module.scss';

const c = classNames.bind(styles);

type HeaderProps = {};

export default function Header({}: HeaderProps) {
	const { data: session } = useSession();

	return (
		<header className={c('wrapper')}>
			<Logo className={c('logo')} />
			<div className={c('button-container')}>
				{session ? (
					<>
						<button
							className={c('button')}
							onClick={() => signOut({ callbackUrl: '/' })}
						>
							Se déconnecter
						</button>
					</>
				) : (
					<>
						<span className={c('text')}>Not signed in</span>
						<button className={c('button')} onClick={() => signIn()}>
							Sign in
						</button>
					</>
				)}
			</div>
		</header>
	);
}
