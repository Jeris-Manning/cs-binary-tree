import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Router} from '../../stores/RootStore';
import {PageTitle} from '../../Bridge/misc/NavPage';
import Butt from '../../Bridge/Bricks/Butt';
import {MdCheckBox, MdCheckBoxOutlineBlank, MdRefresh} from 'react-icons/md';
import {Entabler} from '../../Bridge/Entabler/Entabler';
import {SimCard} from '../../Bridge/misc/Card';
import {action, observable} from 'mobx';
import {EntablerSource} from '../../Bridge/Entabler/EntablerSource';
import {EntablerSpec} from '../../Bridge/Entabler/EntablerSpec';
import Cell_TextStyler from '../../Bridge/Griddle/Cells/Cell_TextStyler';
import {Cell_TimeHistory} from '../../Bridge/Griddle/Cells/Cell_TimeHistory';
import {Cell_StaffAvatar} from '../../Bridge/Griddle/Cells/Cell_StaffAvatar';
import {Cell_IconTooltip} from '../../Bridge/Griddle/Cells/Cell_IconTooltip';
import {SimField} from '../../components/SimField';
import Cell_Phone from '../../Bridge/Griddle/Cells/Cell_Phone';

const spec = new EntablerSpec({
	companyId: {
		label: 'Company ID',
		cell: Cell_TextStyler,
		linker: {
			key: 'company',
			params: (v, r) => ({companyId: r.companyId, tab: 'billing'}),
		},
	},
	name: {
		label: 'Name',
	},
	active: {
		label: 'Active',
		cell: Cell_IconTooltip,
		GetIcon: (v) => v ? MdCheckBox : MdCheckBoxOutlineBlank,
		showBlank: true,
	},
	phone: {
		label: 'Phone',
		cell: Cell_Phone,
	},
	updatedOn: {
		label: 'Updated',
		cell: Cell_TimeHistory,
		size: 12,
		w: 62,
	},
	lastUser: {
		label: '',
		cell: Cell_StaffAvatar,
	},
});


@observer
export class CompanyList extends React.Component {
	render() {
		const params = Router().params || {};
		const companyIds = (params.companyIds || '')
			.split('-');
		
		return (
			<>
				<PageTitle title={`Job IDs`}/>
				
				<CompanyListPage companyIds={companyIds}/>
			</>
		);
	}
}

@observer
export class CompanyListPage extends React.Component {
	
	componentDidMount() {
		this.Mount();
	}
	
	@action Mount = () => {
		this.Refresh().then();
	};
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		this.Refresh().then();
	}
	
	@observable source = new EntablerSource({
		label: 'Company List',
		spec: spec,
		keyer: 'companyId',
	});
	
	@action Refresh = async () => {
		this.source.Clear();
		
		const companies =
			await Jewels().company.GetCompaniesByIds(this.props.companyIds);
		
		await this.source.Add(companies);
	};
	
	render() {
		
		
		return (
			<SimCard header={'Companies'}>
				
				<Butt
					on={this.Refresh}
					icon={MdRefresh}
					label={`Refresh`}
					primary
					subtle
					marL={24}
					marB={12}
				/>
				
				<Entabler
					source={this.source}
				/>
			
			</SimCard>
		);
	}
}

@observer
export class CompanyListMaker extends React.Component {
	render() {
		return (
			<SimCard
				{...this.props}
			>
				<SimField
					label={'Create List of Companies'}
					info={[
						'Enter Company IDs',
						'Delimited by comma or space (or most anything)',
						'110, 111, 112, etc.'
					]}
					onEnterKey={val => Jewels().company.MakeCompanyList(val)}
				/>
			</SimCard>
		);
	}
}