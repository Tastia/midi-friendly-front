import classNames from 'classnames/bind';
import { useState } from 'react';
import Cross from '../../svg/cross.svg';
import Field from '../Forms/Field/Field';
import LunchGroup from '../LunchGroup/LunchGroup';
import styles from './Details.module.scss';

const c = classNames.bind(styles);

type DetailsProps = {
	className?: string;
	restaurant: any;
	closeDetails: () => void;
};

export default function Details({
	className,
	restaurant,
	closeDetails,
}: DetailsProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [schedule, setSchedule] = useState('');

	function handleClick() {
		setIsModalOpen(!isModalOpen);
	}

	if (restaurant.name) {
		return (
			<div className={c('wrapper', className)}>
				<div className={c('top-section')}>
					<a
						href={`https://www.google.com/maps/place/?q=place_id:${restaurant.place_id}`}
						target="_blank"
						rel="noreferrer"
					>
						<span className={c('title')}>{restaurant.name}</span>
					</a>

					<button className={c('button-close')} onClick={() => closeDetails()}>
						<Cross className={c('cross-svg')} />
					</button>
				</div>
				<button className={c('button')} onClick={handleClick}>
					Créer un groupe
				</button>

				{isModalOpen && (
					<div className={c('modal')}>
						<Field
							name="schedule"
							label="Définir un horaire"
							value={schedule}
							setValue={setSchedule}
							className={c('input')}
						/>
						<button className={c('button')} onClick={validate}>
							Valider
						</button>
					</div>
				)}

				<ul className={c('lunch-groups')}>
					{restaurant.lunchGroups &&
						restaurant.lunchGroups.map((lunchGroup: any, i: number) => (
							<LunchGroup key={i} lunchGroup={lunchGroup} />
						))}
				</ul>
			</div>
		);
	} else {
		return null;
	}
}
