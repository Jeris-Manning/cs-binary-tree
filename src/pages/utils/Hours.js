import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {action, observable} from 'mobx';
import {MdSave} from 'react-icons/md';
import {SimCard} from '../../Bridge/misc/Card';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import thyme from '../../Bridge/thyme';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import MiniField from '../../components/MiniField';
import Butt from '../../Bridge/Bricks/Butt';

@observer
export class Hours extends React.Component {
	@observable form = new Formula({
		fields: {
			date: new Fieldula({
				label: 'Date',
				type: 'date',
				required: true,
			}),
			start: new Fieldula({
				label: 'Start Time',
				type: 'time',
				required: true,
			}),
			end: new Fieldula({
				label: 'End Time',
				type: 'time',
				required: true,
			}),
			reason: new Fieldula({
				label: 'Reason',
				description: 'e.g.: a company picnic',
				required: true,
			}),
		}
	});
	
	@action SetSpecial = () => {
		const oHours = Jewels().oHours;
		const fields = this.form.fields;
		
		return oHours.SetSpecial({
			date: fields.date.value,
			start: fields.start.value,
			end: fields.end.value,
			reason: fields.reason.value,
		});
	};
	
	render() {
		const oHours = Jewels().oHours;
		const fields = this.form.fields;
		
		return (
			<>
				<Row wrap>
					
					<SimCard header='' padH={12}>
						
						{oHours.status === 'open' && (
							<Col>
								<Txt>ASLIS is: OPEN</Txt>
								<Txt>Open: {thyme.nice.time.short(oHours.start)}</Txt>
								<Txt>Close: {thyme.nice.time.short(oHours.end)}</Txt>
								<Txt>Due to: {oHours.reason}</Txt>
							</Col>
						)}
						{oHours.status === 'closed' && (
							<Col>
								<Txt>ASLIS is: CLOSED</Txt>
								<Txt>Due to: {oHours.reason}</Txt>
								<Txt>Next open: {thyme.nice.time.short(oHours.start)}</Txt>
							</Col>
						)}
					
					</SimCard>
					
					<SimCard header={'Set Special Hours'} padH={20} maxWidth={300}>
						<MiniField $={fields.date}/>
						<MiniField $={fields.start}/>
						<MiniField $={fields.end}/>
						<MiniField $={fields.reason}/>
						<Butt
							on={this.SetSpecial}
							label={'Set'}
							icon={MdSave}
							primary
							form={this.form}
						/>
					</SimCard>
					<SimCard header={'Current Special Hours'} padH={20} maxWidth={300}>
						<Txt size={'.75rem'} marB={10}>(only one support at a time for now)</Txt>
						<Txt>Date: {oHours.special.date}</Txt>
						<Txt>Start: {oHours.special.start}</Txt>
						<Txt>End: {oHours.special.end}</Txt>
						<Txt>Reason: {oHours.special.reason}</Txt>
					</SimCard>
					
				</Row>
			</>
		);
	}
}