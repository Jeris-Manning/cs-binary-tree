import {disposeOnUnmount, observer} from 'mobx-react';
import React, {Component} from 'react';
import {action, autorun, computed, observable} from 'mobx';
import {Jewels} from '../../stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import $j from '../../Bridge/misc/$j';
import {ToggleCategory} from '../../components/ToggleRow';
import {Col} from '../../Bridge/Bricks/bricksShaper';

@observer
export class CompanyDemands extends React.Component {
	
	@observable demandIdLup = {};
	
	@disposeOnUnmount
	onDemandIdLup = autorun(() => {
		const state = Jewels().vCompany.updata.demandIds;
		
		let lup = {};
		state.value.forEach(d => lup[d] = true);
		this.demandIdLup = lup;
	});
	
	@computed get categories() {
		const categories = Jewels().demands.categories;
		
		return Object.keys(categories)
			.sort($j.sort.alphabetic())
			.map(catKey => ({
				key: catKey,
				title: catKey,
				rows: categories[catKey].map(demand => ({
					key: demand.demandId,
					rowId: demand.demandId,
					label: demand.name,
					tooltip: demand.notes,
					isChecked: this.demandIdLup[demand.demandId],
				})),
			}));
	}
	
	@action Set = (demandId, isChecked) => {
		Jewels().vCompany.updata.demandIds
			.AddOrRemove(isChecked, demandId);
	};
	
	render() {
		return (
			<SimCard
				header={'Demands'}
				{...this.props}
				overflowX={'hidden'}
			>
				<Col wrap maxHeight={550}>
					{this.categories
						.map(category => (
							<ToggleCategory
								key={category.key}
								title={category.title}
								rows={category.rows}
								onChange={this.Set}
							/>
						))}
				</Col>
			</SimCard>
		);
	}
}