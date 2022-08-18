import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Root, Staches} from 'stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import {PaperHeader} from '../../Bridge/misc/Paper';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import Butt from '../../Bridge/Bricks/Butt';
import {UpField} from '../../Bridge/misc/UpField';

@observer
export class UserPage extends React.Component {
	render() {
		const root = Root();
		const staches = Staches();
		const oAccount = Jewels().account;
		
		return (
			<>
				<PaperHeader header={'User Prefs'}/>
				
				<SimCard header={'Caches'}>
					
					<UpField
						state={oAccount.upDatKey}
						placeholder={'Optional Dat Key'}
						w={300}
						marB={16}
					/>
					
					{Object.values(staches).map(stache => (
						<Row
							key={stache.key}
							childV
							marB={6}
						>
							<Butt
								on={() => oAccount.SendInvalidateStache(stache.name)}
								label={'Invalidate'}
								danger
								mini
								tooltip={`DANGER: Please don't press this unless you've been asked to!`}
							/>
							
							<Txt
								marL={16}
								w={200}
							>{stache.name}</Txt>
							
						</Row>
					))}
				</SimCard>
				
				<Butt
					on={() => root.Notification('Test notification!')}
					label={'Test Local Notification'}
					w={300}
					marT={24}
				/>
			</>
		);
	}
}