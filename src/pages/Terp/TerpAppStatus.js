import React from 'react';
import {observer} from 'mobx-react';
import {SimCard} from '../../Bridge/misc/Card';
import {Col, Txt} from '../../Bridge/Bricks/bricksShaper';
import thyme from '../../Bridge/thyme';
import {Jewels} from '../../stores/RootStore';

@observer
export class TerpAppStatus extends React.Component {
	
	render() {
		const updata = Jewels().vTerp.updata;
		
		const appLoginAt = updata.appLoginAt.value;
		const appVersion = updata.appVersion.value;
		const appInfo = updata.appInfo.value;
		
		if (!appVersion) return (
			<SimCard pad={'0'}>
				<Col bgDanger pad={12}>
					<Txt b>Has not yet used version 4+ of the app.</Txt>
				</Col>
			</SimCard>
		);
		
		return (
			<SimCard header={'Last App Login'}>
				<Txt
					size={12}
					b
				>{thyme.nice.dateTime.minimal(appLoginAt)}</Txt>
				
				<Txt
					size={12}
					b
				>v{appVersion}</Txt>
				
				<Txt
					size={12}
					b
				>{appInfo}</Txt>
			</SimCard>
		);
	}
}