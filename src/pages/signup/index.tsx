import classNames from 'classnames/bind';
import SignUp from '../../components/Forms/SignUp/SignUp';
import styles from './signup.module.scss';
import Logo from '../../svg/logo.svg';
import Link from 'next/link';

const c = classNames.bind(styles);

type PageProps = {};

export default function SignupPage({}: PageProps) {
	return (
		<div className={c('wrapper')}>
			<Link href="/">
				<Logo className={c('logo')}/>
			</Link>
			<div className={c('forms')}>
				<h1 className={c('title')}>Inscription</h1>
				<SignUp />
			</div>
			<Link href="/">
				<span className={c('link')}>
					{"J'ai déjà un compte, me connecter"}
				</span>
			</Link>
		</div>
	);
}
