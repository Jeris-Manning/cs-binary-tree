import {observer} from 'mobx-react';
import FieldLabel from './FieldLabel';
import React from 'react';
import {Col, Txt} from './bricksShaper';

function ReadOnlyField(props) {
	if (!props.data && !props.forceShow) return null;
	
	const label = props.label;
	const type = props.type || 'default';
	const value = ValueComponent[type](props.data);
	
	return (
		<Col
			marT={props.marV || props.marT || 8}
			marB={props.marV || props.marB || 10}
			grow
			w={props.w}
			padH={20}
		>
			{label && <FieldLabel>{label}</FieldLabel>}
			{value}
		</Col>
	);
}

export default observer(ReadOnlyField);


const ValueComponent = {
	
	default: data => {
		if (!data) return <Txt hue={'#6f6f6f'}>n/a</Txt>;
		return <Txt pad={0} size={18}>{data}</Txt>},
	
	phone: data => {
		// TODO: formatting
		data = data.replace(/[^\d]+/g, '') .replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
		
		return <Txt pad={0} size={18}>{data}</Txt>
	},
	
	address: data => {
		// TODO
		return <Txt pad={0} size={15}>{data.street} {data.street2} {data.city}, {data.state} {data.zip}</Txt>
	},
	
	dateTime: data => {
		if (!data) return <Txt hue={'#6f6f6f'}>n/a</Txt>;
		return <Txt pad={0} size={15}>{data.format('M/D/YYYY h:mm a')}</Txt>
	},
	
	date: data => {
		if (!data) return <Txt hue={'#6f6f6f'}>n/a</Txt>;
		return <Txt pad={0} size={15}>{data.format('M/D/YYYY')}</Txt>
	},
	
	time: data => {
		if (!data) return <Txt hue={'#6f6f6f'}>n/a</Txt>;
		return <Txt pad={0} size={15}>{data.format('h:mm a')}</Txt>
	},
};