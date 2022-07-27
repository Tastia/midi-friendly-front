import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { NotificationContext } from '../Notification/Notification';
import styles from './LunchGroup.module.scss';

const c = classNames.bind(styles);

interface LunchGroupProps {
	className?: string;
	lunchGroup: any;
	key?: number;
}

function LunchGroup({ className, lunchGroup, key }: LunchGroupProps) {
	const { data: session } = useSession();
	const { notify } = useContext(NotificationContext);
	const user: any = session?.user;

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
		});

		const response = await request.json();

		if (response.statusCode === 400) {
			notify({ type: 'error', message: response.message });
		} else {
			notify({
				type: 'success',
				message: 'Vous avez bien rejoint le groupe.',
			});
		}
	}

	async function leaveClick(lunchGroup: any) {
		const apiURL =
			process.env.NEXT_PUBLIC_API_URL +
			'/lunch-groups-leaving/' +
			lunchGroup.id;
		const body = {
			users: [
				...lunchGroup.users
					.filter((userLunch: any) => userLunch.id !== user.id)
					.map((user: any) => user.id),
			],
			isLeaving: true,
		};
		const request = await fetch(apiURL, {
			headers: {
				'Authorization': 'Bearer ' + user?.token,
				'Content-Type': 'application/json',
			},
			method: 'PUT',
			body: JSON.stringify(body),
		});

		const response = await request.json();

		if (!response) {
			notify({ type: 'error', message: 'Il y a eu une erreur' });
		} else {
			notify({
				type: 'success',
				message: 'Vous avez bien quitté le groupe.',
			});
		}
	}

	return (
		<li className={c('wrapper', className)} key={key}>
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
			{lunchGroup.users.some((userLunch: any) => userLunch.id === user.id) ? (
				<button className={c('button')} onClick={() => leaveClick(lunchGroup)}>
					Quitter
				</button>
			) : (
				<button className={c('button')} onClick={() => joinClick(lunchGroup)}>
					Rejoindre
				</button>
			)}
		</li>
	);
}

export default LunchGroup;
