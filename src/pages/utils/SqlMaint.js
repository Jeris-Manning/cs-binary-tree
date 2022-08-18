import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {action, observable, runInAction} from 'mobx';
import {SimCard} from '../../Bridge/misc/Card';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import Butt from '../../Bridge/Bricks/Butt';

@observer
export class SqlMaint extends React.Component {
	
	@observable result = '';
	
	@action Run1 = async () => {
		const result =
			await Jewels().sqlMaint.gems.run1.Post();
		console.log(`oSqlMaint run1 result: `, result);
		runInAction(() => {
			this.result = JSON.stringify(result);
		});
		return result;
	};
	
	@action Run2 = async () => {
		const result =
			await Jewels().sqlMaint.gems.run2.Post();
		console.log(`oSqlMaint run2 result: `, result);
		runInAction(() => {
			this.result = JSON.stringify(result);
		});
		return result;
	};
	
	render() {
		const oSqlMaint = Jewels().sqlMaint;
		
		return (
			<>
				<Row wrap>
					
					<SimCard header='' padH={12}>
						<Txt marB={20}>Hey maybe don't mess around in here 😅</Txt>
						
						<Butt
							on={this.Run1}
							label={'Run 1'}
							secondary
						/>
						
						<Butt
							on={this.Run2}
							label={'Run 2'}
							primary
							marT={20}
						/>
					</SimCard>
					
					<SimCard grow shrink header={'Result'} padH={12}>
						{this.result}
					</SimCard>
				
				</Row>
			</>
		);
	}
}