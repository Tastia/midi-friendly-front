import classNames from 'classnames/bind';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import styles from './Header.module.scss';

const c = classNames.bind(styles);

type HeaderProps = {};

export default function Header({}: HeaderProps) {
	const { data: session } = useSession();

	return (
		<header className={c('wrapper')}>
			<div className={c('button-container')}>
				{session ? (
					<>
						<span className={c('text')}>Signed in as {session.user?.name}</span>
						<button className={c('button')} onClick={() => signOut()}>
							Sign out
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
