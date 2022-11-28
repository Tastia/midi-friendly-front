import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import socket from '../../utils/socket';
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

	function handleClick(lunchGroup: any, status: 'LeaveGroup' | 'JoinGroup') {
		socket.then((socket) => {
			const params = {
				groupId: lunchGroup._id,
			};
			console.log(params);
			socket?.emit(status, params);
		});
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
							{user.firstName + ' ' + user.lastName}
						</li>
					))}
				</ul>
			</div>
			{lunchGroup.users.some(
				(userLunch: any) => userLunch._id === user.account._id,
			) ? (
				<button
					className={c('button')}
					onClick={() => handleClick(lunchGroup, 'LeaveGroup')}
				>
					Quitter
				</button>
			) : (
				<button
					className={c('button')}
					onClick={() => handleClick(lunchGroup, 'JoinGroup')}
				>
					Rejoindre
				</button>
			)}
		</li>
	);
}

export default LunchGroup;
