import classNames from 'classnames/bind';
import SignUp from '../../components/Forms/SignUp/SignUp';
import styles from './signup.module.scss';

const c = classNames.bind(styles);

type PageProps = {};

export default function SignupPage({}: PageProps) {
	return (
		<div className={c('wrapper')}>
			<div className={c('forms')}>
				<h1 className={c('title')}>Bienvenue sur Tastia</h1>
				<SignUp />
			</div>
		</div>
	);
}
