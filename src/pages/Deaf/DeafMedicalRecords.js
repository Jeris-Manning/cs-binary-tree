import {observer} from 'mobx-react';
import React from 'react';
import {action, observable} from 'mobx';
import {Jewels} from '../../stores/RootStore';
import $j from '../../Bridge/misc/$j';
import {SimCard} from '../../Bridge/misc/Card';
import Butt from '../../Bridge/Bricks/Butt';
import {MdAdd} from 'react-icons/md';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {SimField} from '../../components/SimField';
import {Clip} from '../../Bridge/misc/Clip';


@observer
export class DeafMedicalRecords extends React.Component {
	
	@observable showAll = false;
	@action Show = () => this.showAll = true;
	
// TODO: optimize
	
	render() {
		const {
			companyRecordDefs,
			medicalIds,
		} = Jewels().vDeaf.updata;
		
		let rows = Object.values(companyRecordDefs.value)
			.sort($j.sort.default('name'))
			.map(row => ({
				...row,
				current: medicalIds.value[row.medicalRecordId]
			}));
		
		if (!this.showAll) {
			rows = rows.filter(r => !!r.current);
		}
		
		return (
			<SimCard header={'Medical Record IDs'}>
				{rows.map(row => (
					<RecordRow
						key={row.medicalRecordId}
						{...row}
						onChange={(val) => medicalIds.Add(row.medicalRecordId, val)}
					/>
				))}
				
				{!this.showAll && (
					<Butt
						on={this.Show}
						icon={MdAdd}
						primary
						marT={12}
						w={120}
					/>
				)}
			
			</SimCard>
		);
	}
}

@observer
class RecordRow extends React.Component {
	render() {
		const {
			name,
			current,
			abbrev,
			onChange,
		} = this.props;
		
		return (
			<Row
				childV
				marB={4}
			>
				<Clip copy={current}>
					
					<Txt
						w={150}
						marR={12}
					>{name}</Txt>
				
				</Clip>
				
				<SimField
					value={current || ''}
					onChange={onChange}
					w={240}
				/>
			</Row>
		);
	}
}