import classNames from 'classnames/bind';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SignIn from '../../components/Forms/SignIn/SignIn';
import Logo from '../../svg/logo.svg';
import styles from './home.module.scss';

const c = classNames.bind(styles);

type PageProps = {};

function parseJwt(token: any) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join(''),
	);

	return JSON.parse(jsonPayload);
}

export default function Home({}: PageProps) {
	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			const user: any = session.user;
			const orgaID = user.organizationID;

			const currentTimestamp = Math.floor(Date.now() / 1000);
			const jwtExpiration = parseJwt(session.user.token).exp;
			if (currentTimestamp > jwtExpiration) {
				signOut();
			} else {
				router.push('/map/' + orgaID);
			}
		}
	});

	return (
		<div className={c('wrapper')}>
			<Link href="/">
				<Logo className={c('logo')} />
			</Link>
			<div className={c('forms')}>
				<h1 className={c('title')}>Connexion</h1>
				<SignIn />
			</div>
			<Link href="/signup">
				<span className={c('link')}>
					{"Pas encore de compte, je m'inscris"}
				</span>
			</Link>
		</div>
	);
}
