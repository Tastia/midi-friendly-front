import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';
import Cross from '../../svg/cross.svg';
import { apiUrl } from '../../utils/env';
import Field from '../Forms/Field/Field';
import LunchGroup from '../LunchGroup/LunchGroup';
import { NotificationContext } from '../Notification/Notification';
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
	const { notify } = useContext(NotificationContext);
	const { data: session } = useSession();

	function handleClick() {
		setIsModalOpen(!isModalOpen);
	}

	async function validate() {
		if (!schedule) {
			notify({ type: 'error', message: 'Merci de renseigner un horaire' });
			return null;
		}

		var date = new Date();
		date.toISOString();

		const user: any = session?.user;

		const body = {
			fake_schedule: schedule,
			users: user.id,
			date: date,
			restaurant: restaurant.id,
			organization: user.organization.id,
		};

		const res = await fetch(apiUrl + '/lunch-groups', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + user.token,
			},
		});

		const response = await res.json();

		if (response.statusCode === 400) {
			notify({ type: 'error', message: response.message });
		} else {
			notify({
				type: 'success',
				message: 'Le groupe a bien été créé.',
			});
			setIsModalOpen(false);
		}

		return null;
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
