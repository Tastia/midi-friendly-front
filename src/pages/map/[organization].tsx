import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Details from '../../components/Details/Details';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import socket from '../../utils/socket';
import styles from './organization.module.scss';

const c = classNames.bind(styles);

const LAT_LIMIT = 0.01;
const LONG_LIMIT = 0.02;

type OrgaInfos = {
	coords: {
		lat: number;
		lng: number;
	};
	restaurants: any[];
};

type PageProps = {
	orga: OrgaInfos;
	restaurants: any;
};

export default function Home({ orga, restaurants }: PageProps) {
	const { data: session } = useSession();
	const [restaurant, setRestaurant] = useState<any>({});
	const [groupList, setGroupList] = useState<any>([]);

	const user: any = session?.user;

	useEffect(() => {
		socket.then((socket) => {
			if (typeof socket === 'undefined') {
				return;
			}
			socket.on('SetGroupList', (groupList) => {
				setGroupList(groupList.groups);
			});
			socket.on('AddGroup', (group) => {
				setGroupList((groupList: any) => [...groupList, group.group]);
			});
			socket.on('AddUserToGroup', ({ groupId, user }) => {
				setGroupList((groupList: any) => {
					const groupIndex = groupList.findIndex(
						(group: any) => group._id === groupId,
					);
					groupList[groupIndex].users = [...groupList[groupIndex].users, user];
					return groupList;
				});
			});
		});
	}, []);

	return (
		<div className={c('wrapper')}>
			<Header />
			{orga && (
				<div className={c('map-wrapper')}>
					<Map
						coords={orga.coords}
						setRestaurant={setRestaurant}
						restaurants={restaurants}
						groupList={groupList}
					/>
					<Details
						closeDetails={() => {
							setRestaurant('');
						}}
						restaurant={restaurant}
						groupList={groupList.filter(
							(group: any) => group.restaurant === restaurant._id,
						)}
					/>
				</div>
			)}
		</div>
	);
}

export async function getStaticPaths() {
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL + '/api/organization',
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		},
	);

	const orgas = await res.json();

	return {
		paths: orgas.map((orga: any) => ({
			params: { organization: orga._id.toString() },
		})),
		fallback: true, // false or 'blocking'
	};
}

export async function getStaticProps(context: any) {
	const organizationInfoCall = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			'/api/organization/' +
			context.params.organization,
		{
			method: 'GET',
		},
	);
	const organizationInfo = await organizationInfoCall.json();
	const coords = {
		lat: organizationInfo.coordinates.latitude,
		lng: organizationInfo.coordinates.longitude,
	};

	const orga: OrgaInfos = {
		coords: coords,
		restaurants: organizationInfo.restaurants,
	};

	return {
		props: { orga: orga, restaurants: orga.restaurants }, // will be passed to the page component as props
	};
}
