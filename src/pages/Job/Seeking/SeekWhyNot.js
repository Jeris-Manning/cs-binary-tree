import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {action, computed, observable} from 'mobx';
import PopModal from '../../../components/PopModal';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import Butt from '../../../Bridge/Bricks/Butt';
import {SimCard} from '../../../Bridge/misc/Card';
import {SelectorField} from '../../../Bridge/misc/SelectorField';
import type {C_JobView} from '../JobUpdate/JobBasics';
import type {C_TerpDat} from '../../../datum/stache/TerpDat';
import {TerpDat} from '../../../datum/stache/TerpDat';
import {SeekTerpInfo} from '../../../datum/SeekTerpInfo';

@observer
export class SeekWhyNot extends React.Component<C_JobView> {
	
	@observable showModal = false;
	@action Open = () => this.showModal = true;
	@action Close = () => this.showModal = false;
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		return (
			<>
				<Butt
					on={this.Open}
					// icon={MdPersonPin}
					label={`?!?!`}
					danger
					subtle
					tooltip={'Check why an interpreter is not on this list.'}
				/>
				
				<WhyNotModal
					isOpen={this.showModal}
					onClose={this.Close}
					jobRef={jobRef}
				/>
			</>
		);
	}
}

@observer
class WhyNotModal extends React.Component<C_JobView> {
	
	// @observable unmet = {
	// 	prefs: [],
	// 	demands: [],
	// 	tags: [],
	// 	regions: [],
	// 	specialties: [],
	// 	misc: [],
	// };
	
	@computed get terpDat(): TerpDat {
		const jobRef: JobRef = this.props.jobRef;
		return jobRef.seekUp.whyNotTerp.value;
	}
	
	@computed get seekTerpInfo(): SeekTerpInfo {
		if (!this.terpDat) return null;
		const jobRef: JobRef = this.props.jobRef;
		return jobRef.seekInfo.get(this.terpDat.key);
	}
	
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seekUp: SeekUpdata = jobRef.seekUp;
		
		// const terpDat: TerpDat = seekUp.whyNotTerp.value || {};
		// const seekInfo: SeekTerpInfo = terpDat.key
		// 	? jobRef.seekInfo.get(terpDat.key)
		// 	: null;
		
		const label = (this.terpDat || {}).label;
		
		return (
			<PopModal
				isOpen={this.props.isOpen}
				onClose={this.props.onClose}
			>
				<Col marH={20} h={400} w={600} padT={8}>
					
					<SelectorField
						state={seekUp.whyNotTerp}
						choices={jobRef.allTerps}
						placeholder={'Find Terp'}
						w={280}
						hideOutline
					/>
					
					<Row
						marT={16}
						marB={16}
					>
						<Txt
							size={20}
						>Why not:</Txt>
						
						<Txt
							marL={8}
							b
							size={20}
						>{label}</Txt>
					</Row>
					
					<SeekTerpInfoSummary
						info={this.seekTerpInfo}
					/>
				
				</Col>
			</PopModal>
		);
	}
}

@observer
export class SeekTerpInfoSummary extends React.Component {
	render() {
		const info: SeekTerpInfo = this.props.info;
		
		if (!info) return <></>;
		
		return (
			<>
				<UnmetRow label={'Deaf Prefs'} array={info.prefFails}/>
				<UnmetRow label={'Demands'} array={info.demandFails}/>
				<UnmetRow label={'Tags required'} array={info.requiredTagFails}/>
				<UnmetRow label={'Tags banned'} array={info.bannedTagFails}/>
				<UnmetRow label={'Regions'} array={info.regionFails}/>
				<UnmetRow label={'Specialties'} array={info.specialtyFails}/>
				<UnmetRow label={'Seeker Criteria required'} array={info.requiredSeekerCriteriaFails}/>
				<UnmetRow label={'Seeker Criteria banned'} array={info.bannedSeekerCriteriaFails}/>
				<UnmetRow label={'NowTerp'} array={info.nowTerpFails}/>
			</>
		);
	}
}

@observer
export class UnmetRow extends React.Component {
	render() {
		const {
			label,
			array,
		} = this.props;
		
		const text = array && array.length
			? array.join(', ')
			: 'met';
		
		return (
			<Row marB={4} wrap>
				<Txt b marR={6} hue={'#000'}>{label}: </Txt>
				<Txt hue={text === 'met' ? '#02651d' : '#720b19'}>{text}</Txt>
			</Row>
		);
	}
}

// @observer
// export class WhyNotTooltip extends React.Component<C_TerpDat> {
// 	render() {
// 		const terpDat: TerpDat = this.props.terpDat;
// 		const unmet = Jewels().vJobSeek.CheckWhyTerpFails(terpDat);
//
// 		return (
// 			<SimCard header={'Unmet Requirements'}>
// 				{terpDat.label && (
// 					<Txt
// 						size={18}
// 						marB={8}
// 						hue={'#000'}
// 					>{terpDat.label}</Txt>
// 				)}
// 				<SeekTerpInfoSummary unmet={unmet}/>
// 			</SimCard>
// 		);
// 	}
// }