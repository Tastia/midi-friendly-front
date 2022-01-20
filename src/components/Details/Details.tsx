import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import React, { useContext, useState } from 'react';
import { apiUrl } from '../../utils/env';
import Field from '../Forms/Field/Field';
import { NotificationContext } from '../Notification/Notification';
import styles from './Details.module.scss';

const c = classNames.bind(styles);

type DetailsProps = {
	className?: string;
	name: string;
	id: string;
};

export default function Details({ className, name, id }: DetailsProps) {
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
			restaurant_id: id,
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

	if (name) {
		return (
			<div className={c('wrapper', className)}>
				<div className={c('image')}></div>
				<div className={c('infos')}>
					<span className={c('title')}>{name}</span>
					<span>{id}</span>
					{/* GROUPS */}
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
							/>
							<button className={c('button')} onClick={validate}>
								Valider
							</button>
						</div>
					)}
				</div>
			</div>
		);
	} else {
		return null;
	}
}
