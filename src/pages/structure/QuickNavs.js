import React from 'react';
import {observer} from 'mobx-react';
import {FaAmericanSignLanguageInterpreting, FaHandHoldingHeart} from 'react-icons/fa';
import {MdBusiness} from 'react-icons/md';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {HUE} from '../../Bridge/HUE';
import ButtLink from '../../components/ButtLink';
import Linker from '../../Bridge/Nav/Linker';

const IconTerp = FaAmericanSignLanguageInterpreting;
const IconCompany = MdBusiness;
const IconDeaf = FaHandHoldingHeart;

@observer
export class QuickNavs extends React.Component {
	render() {
		
		return (
			<>
				
				<NavButt
					toKey={'company'}
					params={{companyId: 'overview'}}
					icon={IconCompany}
					name={'Company'}
					customHues={HUE.button.company}
				/>
				
				<Row h={16}/>
				
				<NavButt
					toKey={'deaf'}
					params={{deafId: 'overview'}}
					icon={IconDeaf}
					name={'Deaf'}
					customHues={HUE.button.deaf}
				/>
				
				<Row h={16}/>
				
				<NavButt
					toKey={'terp'}
					params={{terpId: 'overview'}}
					icon={IconTerp}
					name={'Interpreter'}
					customHues={HUE.button.terp}
				/>
			</>
		);
	}
}


class NavButt extends React.Component {
	render() {
		const {
			toKey,
			params,
			icon,
			name,
			customHues,
		} = this.props;
		
		return (
			<Col childH>
				<ButtLink
					toKey={toKey}
					params={params}
					icon={icon}
					iconSize={18}
					custom={customHues}
					padding={'4px 8px'}
				/>
				
				<Linker
					toKey={toKey}
					params={params}
				>
					<Txt
						marT={4}
						hue={'#9b9b9b'}
						size={12}
						caps
					>{name}</Txt>
				</Linker>
			</Col>
		);
	}
}


class NavRow extends React.Component {
	render() {
		const {
			toKey,
			params,
			icon,
			name,
			customHues,
		} = this.props;
		
		return (
			<Linker
				toKey={toKey}
				params={params}
			>
				<Row
					padR={32}
					marB={16}
					childV
					childE
				>
					<Txt
						hue={'#b4b4b4'}
						size={16}
						// caps
						// b
					>{name}</Txt>
					
					<Col w={12}/>
					
					<ButtLink
						toKey={toKey}
						icon={icon}
						custom={customHues}
						padding={'4px 8px'}
					/>
				</Row>
			</Linker>
		);
	}
}