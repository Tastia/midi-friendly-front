import classNames from 'classnames/bind';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
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

	const [name, setName] = useState('');
	const [id, setId] = useState('');

	return (
		<div className={c('wrapper')}>
			<Header />
			{orga && (
				<div className={c('map-wrapper')}>
					<Map
						coords={orga.coords}
						setName={setName}
						setId={setId}
						restaurants={restaurants}
					/>
					<Details
						closeDetails={() => {
							setName('');
						}}
						name={name}
						id={id}
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
