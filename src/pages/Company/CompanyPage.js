import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {SimCard} from '../../Bridge/misc/Card';
import {action, computed} from 'mobx';
import Loading from '../../Bridge/misc/Loading';
import {HUE} from '../../Bridge/HUE';
import {PageTitle, PageTitleStandard} from '../../Bridge/misc/NavPage';
import {Jewels, Router} from '../../stores/RootStore';
import SimpleEnterField from '../../components/SimpleEnterField';
import ToggleButton from '../../components/ToggleButton';
import {TabPaper} from '../../Bridge/misc/TabPaper';
import {CompanyEdit} from './CompanyEdit';
import {CompanyBilling} from './CompanyBilling';
import {MdAddCircleOutline, MdPayment} from 'react-icons/md';
import {FiEdit} from 'react-icons/fi';
import {CompanyListMaker} from './CompanyList';
import {SaveControls} from '../../components/SaveControls';
import {ClipTxt} from '../../Bridge/misc/Clip';

const TABS = {
	edit: {
		label: 'EDIT', icon: FiEdit, wrap: true
	},
	billing: {
		label: 'BILLING', icon: MdPayment, wrap: true
	},
};

const TAB_ARRAY = Object.keys(TABS).map(key => ({key: key, ...TABS[key]}));

@observer
class CompanyUpdate extends React.Component {
	
	@computed get content() {
		const {
			companyId,
			tab,
		} = this.props;
		
		const vCompany = Jewels().vCompany;
		
		if (vCompany.loader.isLoading || companyId !== vCompany.companyId) return <Loading/>;
		
		if (vCompany.error) return (
			<Txt
				hue={HUE.error}
				size={24}
				mar={20}
			>
				{vCompany.error}
			</Txt>
		);
		
		switch (tab) {
			default:
			case 'edit':
				return <CompanyEdit companyId={companyId}/>;
			case 'billing':
				return <CompanyBilling companyId={companyId}/>;
		}
	}
	
	@computed get tab() {
		return TABS[this.props.tab] || {};
	}
	
	@action SelectTab = (tabKey) => {
		return Router().Navigate('company', {
			companyId: this.props.companyId,
			tab: tabKey,
		});
	};
	
	render() {
		const companyId = this.props.companyId;
		const tabKey = this.props.tab;
		const tab = TABS[tabKey] || {};
		
		
		return (
			<TabPaper
				tabs={TAB_ARRAY}
				activeTab={tabKey}
				onTabSelect={this.SelectTab}
				tabWidth={220}
				border={this.pageBorder}
				
				// leftComps={<LeftOfTabs/>}
				// rightComps={<RightOfTabs/>}
			>
				
				<CompanyHeader/>
				
				{this.content}
			
			</TabPaper>
		);
	}
}


@observer
export class CompanyHeader extends React.Component {
	
	render() {
		const vCompany = Jewels().vCompany;
		const updata = vCompany.updata;
		
		return (
			<>
				<PageTitleStandard name={updata.name.value} id={updata.companyId.value}/>
				
				<Row
					marT={8}
					marH={24}
					childV
				>
					
					<ClipTxt id copy={updata.companyId.value}/>
					
					<Col w={32}/>
					
					<ClipTxt title copy={updata.name.value}/>
					
					<Col grow/>
					
					<ToggleButton
						primary
						label={'Active'}
						isChecked={updata.active.value}
						on={updata.active.Toggle}
						subtle
						marR={24}
					/>
					
					<SaveControls store={vCompany}/>
					
				</Row>
				
				{vCompany.saveError && (
					<Txt
						hue={HUE.error}
						size={24}
						mar={20}
					>
						{vCompany.saveError}
					</Txt>
				)}
			</>
		
		);
	}
}

@observer
class Overview extends React.Component {
	
	@action CreateCompany = async (companyName) => {
		const companyId =
			await Jewels().company.CreateCompany(companyName);
		
		return Router().Navigate('company', {companyId: companyId, tab: 'edit'});
	};
	
	render() {
		return (
			<>
				<PageTitle title={`Company`}/>
				
				<SimCard
					header={'Create a New Company'}
					w={400}
				>
					
					<SimpleEnterField
						on={this.CreateCompany}
						icon={MdAddCircleOutline}
						label={'New Company Name'}
						description={`This will create a new company (and let you edit it)`}
					/>
				
				</SimCard>
				
				<CompanyListMaker
					maxWidth={800}
				/>
			</>
		);
	}
}

@observer
export class CompanyPage extends React.Component {
	render() {
		const params = Router().params;
		
		if (params.companyId === 'overview') return <Overview/>;
		
		return (
			<CompanyUpdate {...params}/>
		);
	}
}