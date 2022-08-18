import {action, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {SimCard} from '../../Bridge/misc/Card';
import Butt from '../../Bridge/Bricks/Butt';
import {MdFileDownload as ico_download, MdRefresh as ico_load} from 'react-icons/md';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import MiniField from '../../components/MiniField';
import styled from 'styled-components';
import {Txt} from '../../Bridge/Bricks/bricksShaper';


@observer
export class Logs extends React.Component {
	
	@observable form = new Formula({
		fields: {
			byDate: new Fieldula({
				label: 'By Date',
				type: 'date',
				description: 'This will take awhile!',
			}),
			byKey: new Fieldula({
				label: 'By Key',
			})
		}
	});
	
	@observable logResult = '';
	
	@action RequestLogsByDate = async () => {
		const oLogs = Jewels().logs;
		
		const result =
			await oLogs.RequestLogsByDate({
				date: this.form.fields.byDate.value
			});
		
		runInAction(() => {
			this.logResult = result;
		});
		
		// Root().Logs.RequestLogsByDate(this.form.fields.byDate.value);
	};
	
	// @action RequestLogsByKey = () => {
	// 	Root().Logs.RequestLogsByKey(this.form.fields.byKey.value);
	// };
	
	@action Download = () => {
		const blob = new Blob([this.logResult], {type: 'text/plain'});
		const url = URL.createObjectURL(blob);
		const tempElement = document.createElement('a');
		tempElement.href = url;
		tempElement.download = 'buoy-log.txt';
		document.body.appendChild(tempElement); // Required for this to work in FireFox
		tempElement.click();
		console.log(`download: ${url}`);
	};
	
	
	render() {
		const oLogs = Jewels().logs;
		
		return (
			<>
				
				<SimCard padH={12} w={300}>
					
					<MiniField $={this.form.fields.byDate}/>
					<Butt
						on={this.RequestLogsByDate}
						label={'Load'}
						icon={ico_load}
						w={200}
						primary
					/>
					<Txt i hue={'#951a13'} marT={20}>Note 1: This may take a minute or two.</Txt>
					<Txt i hue={'#951a13'} marT={20}>Note 2: It can bog the server down a little!</Txt>
				
				</SimCard>
				
				<SimCard header={'Results'}>
					<Butt
						on={() => this.Download()}
						icon={ico_download}
						disabled={!this.logResult}
						secondary
					/>
				</SimCard>
			
			</>
		);
	}
}


const ErrorText = styled.div`
	color: #ff1b2f;
	font-weight: lighter;
	font-style: italic;
	font-size: .75em;
	margin-top: -2px;
	margin-bottom: 1px;
`;
