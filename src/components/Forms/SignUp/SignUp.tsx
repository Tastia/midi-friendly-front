import classNames from 'classnames/bind';
import { getCsrfToken } from 'next-auth/react';
import React, { FormEvent, useContext, useState } from 'react';
import { apiSignUp, apiUrl } from '../../../utils/env';
import { NotificationContext } from '../../Notification/Notification';
import Field from '../Field/Field';
import styles from './SignUp.module.scss';

const c = classNames.bind(styles);

type SignUpProps = {};

export default function SignUp({}: SignUpProps) {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [firstname, setFirstname] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const { notify } = useContext(NotificationContext);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (password !== passwordConfirm) {
			notify({
				type: 'error',
				message: 'Les mots de passe ne correspondent pas',
			});
			return null;
		}
		if (apiUrl && apiSignUp) {
			const body = {
				username: firstname.toLowerCase() + '_' + name.toLowerCase(),
				name: name,
				firstname: firstname,
				email: email,
				password: password,
			};

			const res = await fetch(apiUrl + apiSignUp, {
				method: 'POST',
				body: JSON.stringify(body),
				headers: { 'Content-Type': 'application/json' },
			});

			const response = await res.json();

			if (response.message) {
				response.message[0].messages.forEach((message: { message: string }) => {
					notify({ type: 'error', message: message.message });
				});
			} else {
				notify({
					type: 'success',
					message:
						'Votre compte est enregistré, merci de vérifier votre adresse mail.',
				});
			}

			return null;
		}
	}

	return (
		<form method="post" className={c('wrapper')} onSubmit={handleSubmit}>
			<Field
				label="Email"
				name="email"
				placeholder="exemple@mail.com"
				type="email"
				required={true}
				value={email}
				setValue={setEmail}
			/>
			<Field
				label="Prénom"
				name="firstname"
				placeholder="Michel"
				type="firstname"
				required={true}
				value={firstname}
				setValue={setFirstname}
			/>
			<Field
				label="Nom"
				name="name"
				type="text"
				required={true}
				value={name}
				setValue={setName}
			/>
			<Field
				label="Mot de passe"
				name="password"
				type="password"
				required={true}
				value={password}
				setValue={setPassword}
			/>
			<Field
				label="Confirmation du mot de passe"
				name="passwordConfirm"
				type="password"
				required={true}
				value={passwordConfirm}
				setValue={setPasswordConfirm}
			/>
			<button className={c('button')} type="submit">
				{"S'inscrire"}
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
