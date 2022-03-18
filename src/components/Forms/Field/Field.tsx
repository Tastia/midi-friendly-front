import classNames from 'classnames/bind';
import React from 'react';
import styles from './Field.module.scss';

const c = classNames.bind(styles);

type FieldProps = {
	name: string;
	label: string;
	value: string;
	className?: string;
	required?: boolean;
	placeholder?: string;
	type?: string;
	setValue: (value: string) => void;
};

export default function Field({
	className,
	label,
	type,
	name,
	value,
	required,
	placeholder,
	setValue,
}: FieldProps) {
	return (
		<label className={c('wrapper', className)}>
			<span className={c('label')}>{label}</span>
			<input
				type={type}
				name={name}
				value={value}
				required={required}
				className={c('input')}
				placeholder={placeholder}
				onChange={(e) => setValue(e.target.value)}
			/>
		</label>
	);
}
