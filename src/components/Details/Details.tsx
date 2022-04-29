import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import React, { useContext, useState } from 'react';
import Cross from '../../svg/cross.svg';
import { apiUrl } from '../../utils/env';
import Field from '../Forms/Field/Field';
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
	const user: any = session?.user;

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

		if (response.message) {
			response.message[0].messages.forEach((message: { message: string }) => {
				notify({ type: 'error', message: message.message });
			});
		} else {
			notify({
				type: 'success',
				message: 'Le groupe a bien été créé.',
			});
			setIsModalOpen(false);
		}

		return null;
	}

	async function joinClick(lunchGroup: any) {
		const apiURL =
			process.env.NEXT_PUBLIC_API_URL + '/lunch-groups/' + lunchGroup.id;
		const body = {
			users: [...lunchGroup.users.map((user: any) => user.id), user.id],
		};
		const request = await fetch(apiURL, {
			headers: {
				'Authorization': 'Bearer ' + user?.token,
				'Content-Type': 'application/json',
			},
			method: 'PUT',
			body: JSON.stringify(body),
		}).then((res) => res.json());
	}

	if (restaurant.name) {
		return (
			<div className={c('wrapper', className)}>
				<div className={c('top-section')}>
					<a
						href={`https://www.google.com/maps/place/?q=place_id:${restaurant.id}`}
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
							<li className={c('item')} key={i}>
								<div className={c('schedule')}>
									<span>Horaire : {lunchGroup.fake_schedule}</span>
								</div>
								<div className={c('users')}>
									<span className={c('users-title')}> Participants</span>
									<ul className={c('user-list')}>
										{lunchGroup.users.map((user: any, y: number) => (
											<li className={c('user')} key={y}>
												{user.firstname + ' ' + user.name}
											</li>
										))}
									</ul>
								</div>
								<button
									className={c('button')}
									onClick={() => joinClick(lunchGroup)}
								>
									Rejoindre
								</button>
							</li>
						))}
				</ul>
			</div>
		);
	} else {
		return null;
	}
}
