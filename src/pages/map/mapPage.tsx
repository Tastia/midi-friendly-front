import classNames from 'classnames/bind';
import { useState } from 'react';
import Details from '../../components/Details/Details';
import Header from '../../components/Header/Header';
import Map from '../../components/Map/Map';
import styles from './organization.module.scss';

const c = classNames.bind(styles);

type OrgaInfos = {
	coords: {
		lat: number;
		lng: number;
	};
	restaurants: any[];
	id: string;
};

type PageProps = {
	orga: OrgaInfos;
	restaurants: any;
};

export default function MapPage({ orga, restaurants }: PageProps) {
	const [restaurant, setRestaurant] = useState<any>({});
	const [groupList, setGroupList] = useState<any>([]);

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
