import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {Jewels} from '../../stores/RootStore';
import $j from '../../Bridge/misc/$j';
import {SimCard} from '../../Bridge/misc/Card';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import Butt from '../../Bridge/Bricks/Butt';
import {MdAdd, MdDeleteForever, MdEdit, MdRefresh, MdSearch} from 'react-icons/md';
import {LocationEditor} from '../Job/JobUpdate/LocationEditor';
import {Tip} from '../../Bridge/misc/Tooltip';
import thyme from '../../Bridge/thyme';
import IconLinker from '../../Bridge/Bricks/IconLinker';

@observer
export class CompanyLocations extends React.Component {
	
	@computed get rows() {
		const oCompany = Jewels().company;
		
		return oCompany.companyLocations.slice().sort($j.sort.alphabetic('label'));
	}
	
	render() {
		const {
			companyId
		} = this.props;
		
		const vCompany = Jewels().vCompany;
		const oLocation = Jewels().location;
		
		const rows = vCompany.locations;
		
		return (
			<>
				
				<SimCard header={'Locations'}>
					<Row marH={24}>
						<Butt
							on={() => vCompany.LoadLocations(companyId)}
							icon={MdRefresh}
							label={rows.length ? 'Refresh' : 'Load All'}
							secondary
						/>
						
						<Col grow minWidth={24}/>
						
						<Butt
							on={() => oLocation.OpenLocEditor(null, companyId, () => vCompany.LoadLocations(companyId))}
							icon={MdAdd}
							label={'New Location'}
							primary
						/>
					</Row>
					
					<Row h={24}/>
					
					{rows.map(location => (
						<LocationRow
							key={location.locationId}
							location={location}
							companyId={companyId}
						/>
					))}
				
				</SimCard>
				
				<LocationEditor
					isOpen={oLocation.locEditorOpen}
					onClose={oLocation.CloseLocEditor}
					tabi={10}
				/>
			</>
		);
	}
}

@observer
class LocationRow extends React.Component {
	render() {
		const {
			location,
			companyId,
		} = this.props;
		
		const vCompany = Jewels().vCompany;
		const oLocation = Jewels().location;
		
		// MARK.render(this, `${companyId} ${location.locationId}`, location);

		return (
			<Row marB={12} childCenterV>
				<Butt
					on={() => oLocation.RemoveLocation(location.locationId, companyId)}
					danger
					label={`#${location.locationId}`}
					icon={MdDeleteForever}
					iconHue={'#616161'}
					tooltip={'Deactivate this location'}
					subtle
					mini
					w={120}
					afterClick={() => vCompany.LoadLocations(companyId)}
				/>
				
				
				<Col marH={12}>
					<Txt b>
						{$j.trunc(location.label, 50, '...')}
					</Txt>
					
					<Txt marT={4}>
						{$j.trunc(location.formatted, 50, '...')}
					</Txt>
				</Col>
				
				<Col grow/>
				
				{location.lastUpdate ? (
					<Tip text={`Updated on: ${thyme.nice.dateTime.short(location.lastUpdate)}`}>
						<Txt i hue={'#039200'}>{thyme.nice.dateTime.relative(location.lastUpdate)}</Txt>
					</Tip>
				) : (
					<Txt i hue={'#b41616'}>old location</Txt>
				)}
				
				<Butt
					on={() => oLocation.OpenLocEditor(location, companyId, () => vCompany.LoadLocations(companyId))}
					primary
					icon={MdEdit}
					iconHue={'#616161'}
					tooltip={'Edit Location or Directions'}
					subtle
					w={80}
					marL={12}
				/>
				
				<IconLinker
					to={'location'}
					params={{locationId: location.locationId}}
					icon={MdSearch}
					iconHue={'#7c7c7c'}
					marL={16}
					// tooltip={'Go to terp profile'}
				/>
			</Row>
		);
	}
}

