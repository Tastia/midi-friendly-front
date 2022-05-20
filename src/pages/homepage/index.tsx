import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from '../../components/Button/Button';
import FavorisIcon from '../../svg/homepage/favoris.svg';
import OrganisationIcon from '../../svg/homepage/organisation.svg';
import SocietyIcon from '../../svg/homepage/society.svg';
import UserIcon from '../../svg/homepage/users.svg';
import Logo from '../../svg/logo_horizontal.svg';
import styles from './homepage2.module.scss';

const c = classNames.bind(styles);

type PageProps = {};

export default function Homepage2({}: PageProps) {
	const router = useRouter();
	const { data: session } = useSession();

	return (
		<div className={c('main')}>
			<header>
				<div className={c('menu', 'max-width')}>
					<Logo className={c('logo')} />
					<div className={c('nav')}>
						<a href="#">Fonctionnement</a>
						<a href="#">Utilisateurs</a>
						<a href="#">Équipe</a>
						<Button name={'Connexion'} type={'primary'} />
					</div>
				</div>
			</header>
			<div className={c('hero-container', 'main-hero')}>
				<div className={c('max-width')}>
					<h1>
						Enfin un moyen pour vous et vos collègues de{' '}
						<span>trouver à manger</span>
					</h1>
					<h2>{`Réponder leur "Midi Fiendly"`}</h2>
					<p>
						Lorem ipsum de la muerta del sol de la cuenta por favor este texto
						es por la cocina y la tortilla con las patatas por favor hombre.
						Lorem ipsum de la muerta del sol de la cuenta por favor este texto
						es por la cocina y la tortilla con las patatas por favor hombre.
					</p>
					<div className={c('buttons-list')}>
						<Button name={'Je cherche mes collègues'} type={'secondary'} />
						<Button name={"C'est pour mon organisation"} type={'primary'} />
					</div>
				</div>
			</div>
			<div className={c('hero-container')}>
				<div className={c('max-width')}>
					<h2>Fonctionnalités et utilisation</h2>
					<div className={c('row-section', 'usecase')}>
						<img src="./images/map.jpg" alt="" />
						<div className={c('content')}>
							<h3>Savoir simplement ou déjeuner</h3>
							<p>
								Le moment le plus important d’une journée de travail n’est pas
								la réunion, mais bien le déjeuner. Echanger, intégrer et
								rigoler, c’est la période à privilégier pour vous et votre
								entreprise. Finis la prise de tête à demander où manger,
								MidiFriendly
							</p>
							<Button name={'Tester par soi-même'} type={'secondary'} />
						</div>
					</div>
					<div className={c('fonctionnalite')}>
						<div className={c('content')}>
							<h3>Fonctionnalités</h3>
							<div className={c('list-use')}>
								<article>
									<UserIcon />
									<h4>Groupes</h4>
									<p>
										MidiFriendly est un outil fait pour se regrouper entre
										collègues. La rencontre et le partage sont les valeurs que
										nous voulons vous faire profiter.
									</p>
								</article>
								<article>
									<FavorisIcon />
									<h4>Favoris</h4>
									<p>
										Vous cherchez chaque jour vers quel restaurant se tourner ?
										Ajouter ses restaurants favoris et pouvoir, d’un coup
										d’oeil, connaître les goûts de chacun.
									</p>
								</article>
								<article>
									<OrganisationIcon />
									<h4>Organisation</h4>
									<p>
										Organisez vos équipes et encouragez ses membres à créer des
										liens entre eux.
									</p>
								</article>
								<article>
									<SocietyIcon />
									<h4>Canal {`d'entreprise`}</h4>
									<p>
										Misez sur la période de la journée commune à toute votre
										entreprise. Que vous soyez manager ou membre d’équipe.
									</p>
								</article>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={c('hero-container')}>
				<div className={c('max-width')}>
					<h2>Utilisateurs</h2>
					<div className={c('row-section', 'users')}>
						<div className={c('userType')}>
							<h3>Entreprise</h3>
							<p>
								Vous souhaitez utiliser MidiFriendly et ses services pour vos
								équipes.
							</p>
							<Button name={'Connexion'} type={'primary'} />
						</div>
						<div className={c('userType')}>
							<h3>Utilisateur</h3>
							<p>
								A la recherche de vos collègues ? Pour retrouver les membres de
								votre organisation, c’est ici !
							</p>
							<Button name={'Connexion'} type={'primary'} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
