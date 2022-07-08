import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import Button from '../../components/Button/Button';
import Logo from '../../svg/logo_horizontal.svg';
import styles from './homepage.module.scss';

const c = classNames.bind(styles);

type PageProps = {};

export default function Homepage({}: PageProps) {
	const router = useRouter();
	const { data: session } = useSession();

	return (
		<div className={c('main')}>
			<header>
				<Logo className={c('logo')} />
				<Button name={"Accéder à l'app"} type={'primary'} />
			</header>
			<div className={c('hero-container')}>
				<div className={c('content')}>
					<h1>
						Vos collèges vous demandent
						<br />
						ou manger ?
					</h1>
					<h2>{`Réponder leur "Midi Fiendly"`}</h2>
					<p>
						Lorem ipsum de la muerta del sol de la cuenta por favor este texto
						es por la cocina y la tortilla con las patatas por favor hombre.
						Lorem ipsum de la muerta del sol de la cuenta por favor este texto
						es por la cocina y la tortilla con las patatas por favor hombre.
					</p>
					<div className={c('buttons-list')}>
						<Button name={'Je suis une organisation'} type={'secondary'} />
						<Button name={'Commencer maintenant'} type={'primary'} />
					</div>
				</div>
			</div>
			<div className={c('video-container')}>
				<div className={c('container')}>
					<div className={c('content')}>
						<h2>Nom de la vidéo</h2>
						<p>
							Lorem ipsum de la muerta del sol de la cuenta por favor este texto
							es por la cocina y la tortilla con las patatas por favor hombre.
							Lorem ipsum de la muerta del sol de la cuenta por favor este texto
							es por la cocina y la tortilla con las patatas por favor hombre.
						</p>
						<Button name={"Tester l'application"} type={'tertiary'} />
					</div>
					<iframe
						width="560"
						height="315"
						src="https://www.youtube.com/embed/QoJnUc6MBJ8"
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			</div>
			<div className={c('features-container')}>
				<h2>Features</h2>
				<div className={c('features')}>
					<article>
						<h3>Title features</h3>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus
							phasellus id donec est magna nunc.Lorem ipsum dolor sit amet,
							consectetur adipiscing elit.
						</p>
					</article>
					<article>
						<h3>Title features</h3>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus
							phasellus id donec est magna nunc.Lorem ipsum dolor sit amet,
							consectetur adipiscing elit.
						</p>
					</article>
					<article>
						<h3>Title features</h3>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus
							phasellus id donec est magna nunc.Lorem ipsum dolor sit amet,
							consectetur adipiscing elit.
						</p>
					</article>
					<article>
						<h3>Title features</h3>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempus
							phasellus id donec est magna nunc.Lorem ipsum dolor sit amet,
							consectetur adipiscing elit.
						</p>
					</article>
				</div>
			</div>
			<div className={c('box-container')}>
				<div className={c('box', 'primary')}>
					<h2>Features</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Justo massa
						turpis enim eget purus enim in fames. Commodo in habitant amet
						risus, vulputate. Nulla mi, nibh ac turpis at. Sit morbi non laoreet
						tortor orci sit ornare tempus. Donec mauris, morbi et felis justo
						suspendisse.
					</p>
					<Button name={'Je suis organisation'} type={'secondary'} />
				</div>
				<div className={c('box', 'secondary')}>
					<h2>Features</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Justo massa
						turpis enim eget purus enim in fames. Commodo in habitant amet
						risus, vulputate. Nulla mi, nibh ac turpis at. Sit morbi non laoreet
						tortor orci sit ornare tempus. Donec mauris, morbi et felis justo
						suspendisse.
					</p>
					<Button name={'Restaurer'} type={'primary'} />
				</div>
			</div>

			<footer>
				<Logo className={c('logo')} />
				<div className={c('links')}>
					<h4>Title links</h4>
					<a href="#">Links numero</a>
					<a href="#">Links numero</a>
					<a href="#">Links numero</a>
				</div>
				<div className={c('links')}>
					<h4>Title links</h4>
					<a href="#">Links numero</a>
					<a href="#">Links numero</a>
				</div>
			</footer>
		</div>
	);
}
