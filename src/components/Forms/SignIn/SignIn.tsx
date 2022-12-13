import classNames from 'classnames/bind';
import { getCsrfToken, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { NotificationContext } from '../../Notification/Notification';
import Field from '../Field/Field';
import styles from './SignIn.module.scss';

const c = classNames.bind(styles);

type SignInProps = {};

export default function SignIn({}: SignInProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const { notify } = useContext(NotificationContext);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const query = await signIn('credentials', {
			identifier: email,
			password: password,
		});
	}

	useEffect(() => {
		if ('error' in router.query) {
			notify({
				type: 'error',
				message: 'Une erreur est survenue, merci de vérifier vos informations',
			});
		}
	}, [router, notify]);

	return (
		<form method="post" className={c('wrapper')} onSubmit={handleSubmit}>
			<Field
				label="Email"
				name="email"
				placeholder="email@societe.com"
				type="email"
				required={true}
				value={email}
				setValue={setEmail}
			/>
			<Field
				label="Mot de passe"
				name="password"
				type="password"
				placeholder="•••••••••"
				required={true}
				value={password}
				setValue={setPassword}
			/>
			<button className={c('button')} type="submit">
				{'Accéder à MidiFriendly'}
			</button>
		</form>
	);
}

export async function getServerSideProps(context: any) {
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	};
}
