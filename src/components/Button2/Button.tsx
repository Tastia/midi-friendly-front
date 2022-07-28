import classNames from 'classnames/bind';
import React from 'react';
import styles from './Button.module.scss';

const c = classNames.bind(styles);

type ButtonProps = {
	name: string;
	type: string;
};

export default function Button({type, name}: ButtonProps) {
	return (
		<button className={c('button', type)}>
			{name}
		</button>
	);
}
