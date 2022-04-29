import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Details from '../../components/Details/Details';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import styles from './organization.module.scss';

const c = classNames.bind(styles);

const LAT_LIMIT = 0.01;
const LONG_LIMIT = 0.02;

type OrgaInfos = {
	coords: {
		lat: number;
		lng: number;
	};
};

type PageProps = {
	orga: OrgaInfos;
	restaurants: any;
};

export default function Home({ orga, restaurants }: PageProps) {
	const { data: session } = useSession();
	const [restaurant, setRestaurant] = useState({});
	const [restaurantsCopy, setRestaurantsCopy] = useState(restaurants);

	const user: any = session?.user;

	const { data, error } = useSWR(
		process.env.NEXT_PUBLIC_API_URL + '/lunch-groups/organization/85',
		(apiURL: string) =>
			fetch(apiURL, {
				headers: { Authorization: 'Bearer ' + user?.token },
			}).then((res) => res.json()),
		{ refreshInterval: 1000 },
	);

	useEffect(() => {
		if (data && !data.error) {
			setRestaurantsCopy((restaurantsCopy: any) => {
				restaurantsCopy.forEach((restaurant: any) => {
					if (restaurant.lunchGroups) {
						restaurant.lunchGroups = [];
					}
				});
				data.forEach((lunchGroup: any) => {
					const current = restaurantsCopy.find(
						(element: any) => element.id === lunchGroup.restaurant.id,
					);
					if (current && !current.lunchGroups) {
						current.lunchGroups = [];
					}
					current?.lunchGroups.push(lunchGroup);
				});
				return [...restaurantsCopy];
			});
		}
	}, [data, restaurantsCopy.lunchGroups]);

	return (
		<div className={c('wrapper')}>
			<Header />
			{orga && (
				<div className={c('map-wrapper')}>
					<Map
						coords={orga.coords}
						setRestaurant={setRestaurant}
						restaurants={restaurantsCopy}
					/>
					<Details
						closeDetails={() => {
							setRestaurant('');
						}}
						restaurant={restaurant}
					/>
				</div>
			)}
		</div>
	);
}

export async function getStaticPaths() {
	const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/organizations', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});

	const orgas = await res.json();

	return {
		paths: orgas.map((orga: any) => ({
			params: { organization: orga.id.toString() },
		})),
		fallback: true, // false or 'blocking'
	};
}

export async function getStaticProps(context: any) {
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			'/organizations/' +
			context.params.organization,
		{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		},
	);

	const response = await res.json();

	const coords = {
		lat: response.Place.latitude,
		lng: response.Place.longitude,
	};

	const orga: OrgaInfos = {
		coords: coords,
	};

	return {
		props: { orga: orga, restaurants: response.restaurants }, // will be passed to the page component as props
	};
}
