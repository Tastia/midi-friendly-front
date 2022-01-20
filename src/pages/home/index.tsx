import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SignIn from '../../components/Forms/SignIn/SignIn';
import SignUp from '../../components/Forms/SignUp/SignUp';
import styles from './home.module.scss';

const c = classNames.bind(styles);

type PageProps = {};

export default function Home({}: PageProps) {
	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			const user: any = session.user;
			const orgaID = user.organization.id;
			router.push('/map/' + orgaID);
		}
	});

	return (
		<div className={c('wrapper')}>
			<div className={c('forms')}>
				<h1 className={c('title')}>Bienvenue sur Tastia</h1>
				<SignIn />
				<SignUp />
			</div>
		</div>
	);
}
