import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Router} from 'stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import {TerpSchedule} from '../../components/TerpSchedule';
import Loading from '../../Bridge/misc/Loading';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import PopModal from '../../Bridge/misc/PopModal';
import Butt from '../../Bridge/Bricks/Butt';
import {computed} from 'mobx';
import {MdArrowDownward, MdLocalHospital, MdLocationCity, MdPersonAdd} from 'react-icons/md';
import MiniField from '../../components/MiniField';
import {FiVideo} from 'react-icons/fi';
import EditCard from '../../components/EditCard';

// TODO: make this database driven
const regions = [
	{key: 'Metro', label: 'Metro', icon: MdLocationCity},
	{key: 'VRI', label: 'VRI', icon: FiVideo},
	{key: 'Moorhead', label: 'Moorhead', icon: MdPersonAdd},
	{key: 'Southern', label: 'Southern', icon: MdArrowDownward},
	{key: 'Mayo', label: 'Mayo', icon: MdLocalHospital},
	{key: 'MHC', label: 'MHC', icon: MdLocalHospital},
];


@observer
export class TerpScheds extends React.Component {
	
	@computed get tabs() {
		const router = Router();
		
		const regionButts = regions.map(region => (
			<Butt
				key={region.key}
				on={() => router.Navigate(router.routes.terpScheds, {region: region.key})}
				label={region.label}
				icon={region.icon}
				disabled={router.params.region === region.key}
				secondary
			/>
		));
		
		return (
			<Row childCenterH>
				{regionButts}
			</Row>
		);
	}
	
	render() {
		return (
			<>
				
				{this.tabs}
				
				<TerpSchedRegion region={Router().params.region}/>
			
			
			</>
		);
	}
}


@observer
class TerpSchedRegion extends React.Component {
	render() {
		const {
			region
		} = this.props;
		
		const vTerpSched = Jewels().vTerpSched;
		
		if (vTerpSched.isLoadingLists) return <Loading/>;
		else if (vTerpSched.isLoadingListTerps) return <Loading/>;
		
		const terps = vTerpSched.regionListLup[region] || [];
		
		const schedules = terps.map(terpId => (
			<SimCard
				key={terpId}
			>
				<TerpSchedule
					terpId={terpId}
					openBusyModal={vTerpSched.OpenBusyModal}
				/>
			</SimCard>
		));
		
		return (
			<>
				
				{terps.length === 0 && <Txt>No terp IDs found for Region: {region}</Txt>}
				
				{schedules}
				
				<BusyModal/>
				
				<EditCard
					onSave={vTerpSched.PostListChange}
					innerPadV={'0px'}
				>
					{editing => (
						<MiniField
							$={vTerpSched.terpListForm.fields.terpIds}
							disabled={!editing}
							// h={200}
							marT={4}
						/>
					)}
				</EditCard>
			
			</>
		);
	}
}


@observer
class BusyModal extends React.Component {
	render() {
		// TODO: update
		const vTerpSched = Jewels().vTerpSched;
		const fields = vTerpSched.busyForm.fields;
		
		return (
			<PopModal
				isOpen={vTerpSched.busyModalActive}
				onClose={vTerpSched.CloseBusyModal}
			>
				<Col w={400} h={500} pad={30}>
					<Txt b size={18} marB={30}>{`Add busy time for: ${vTerpSched.formTerpName} (${vTerpSched.formTerpId})`}</Txt>
					
					<MiniField $={fields.date}/>
					<MiniField $={fields.start}/>
					<MiniField $={fields.duration}/>
					<MiniField $={fields.comment}/>
					
					<Butt
						on={vTerpSched.SubmitBusy}
						label={'Add'}
						primary
						disabled={!vTerpSched.canSubmit}
					/>
				</Col>
			</PopModal>
		);
	}
}
