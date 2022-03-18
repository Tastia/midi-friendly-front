import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SignIn from '../../components/Forms/SignIn/SignIn';
import Logo from '../../svg/logo.svg';
import styles from './home.module.scss';

const c = classNames.bind(styles);

type PageProps = {};

export default function Home({}: PageProps) {
	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			console.log(session);
			const user: any = session.user;
			const orgaID = user.organization.id;
			router.push('/map/' + orgaID);
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
