import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import Loading from '../../Bridge/misc/Loading';
import {action, computed, observable} from 'mobx';
import {Tip} from '../../Bridge/misc/Tooltip';
import thyme from '../../Bridge/thyme';
import {
	MdArchive as Ico_archive,
	MdCheck as Ico_met,
	MdClose as Ico_unmet,
	MdEdit as Ico_edit,
	MdErrorOutline,
	MdLayersClear,
	MdPageview,
	MdSave,
	MdWarning as Ico_pending,
} from 'react-icons/md';
import Butt from '../../Bridge/Bricks/Butt';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import MiniField from '../../components/MiniField';
import {
	SubmittedAck,
	SubmittedFile,
	SubmittedFillable,
	SubmittedRid
} from './credentialing/SubmittedCred';
import ReviewModal from './credentialing/ReviewModal';
import $j from '../../Bridge/misc/$j';
import {Ico, IcoToggle} from '../../Bridge/Bricks/Ico';
import {FaRegArrowAltCircleUp} from 'react-icons/fa';
import {HoverRow} from '../../Bridge/misc/HoverContainer';
import {HUE} from '../../Bridge/HUE';
import SimpleEnterField from '../../components/SimpleEnterField';
import {GetDemandStatusDef} from '../../jewels/oTerpChecklist';


@observer
export class TerpCredentials extends React.Component {
	
	render() {
		const oChecklist = Jewels().terpChecklist;
		const vTerp = Jewels().vTerp;
		const oCreds = Jewels().credentials;
		
		return (
			<>
				{oChecklist.loader.isLoading && <Loading/>}
				
				<Row wrap childH>
					
					<DemandsChecklist/>
					
					{/*<TerpCreds/>*/}
					
					<Controls/>
				
				</Row>
				
				<ReviewModal/>
				
				<Row h={24}/>
				<Row wrap childH>
					{oCreds.credsByCategory.map(cat => (
						<Category
							key={cat.categoryName}
							category={cat}
							terpId={vTerp.terpId}
						/>
					))}
				</Row>
			</>
		);
	}
}

@observer
class DemandsChecklist extends React.Component {
	render() {
		const oChecklist = Jewels().terpChecklist;
		
		return (
			<SimCard>
				<Row marB={8}>
					<Txt
						size={14}
						smallCaps
						hue={HUE.blueDeep}
					>Demand Checklist</Txt>
					
					<Col grow/>
					
					<Butt
						on={oChecklist.ClearDemands}
						icon={MdLayersClear}
						iconHue={'#575757'}
						iconSize={14}
						subtle
						mini
						tooltip={'Clear Selection'}
					/>
				</Row>
				
				<Row wrap>
					{oChecklist.demandCategories.map(cat => (
						<Col
							key={`demandCat_${cat.name}`}
							marR={32}
						>
							<Txt
								size={16}
								marL={8}
								marB={8}
							>{cat.name}</Txt>
							
							{cat.demands.map(demand => (
									<DemandRow
										key={`demand_${demand.demandId}`}
										demand={demand}
										onToggle={() => oChecklist.ToggleDemand(demand)}
									/>
								)
							)}
						</Col>
					))}
				</Row>
			
			</SimCard>
		);
	}
}

@observer
class Controls extends React.Component {
	render() {
		const oChecklist = Jewels().terpChecklist;
		
		return (
			<SimCard selfStart>
				<Butt
					on={oChecklist.SaveChecklist}
					icon={MdSave}
					label={'Save Checklist'}
					secondary
					mini
					square
					disabled={!oChecklist.canSave}
					alertAfter={'Saved!'}
					h={50}
				/>
				
				<Row h={64}/>
				
				<SimpleEnterField
					on={oChecklist.CopyFromCompanyDemands}
					icon={FaRegArrowAltCircleUp}
					label={'Copy from Company ID'}
					description={`This will lookup the demands from a Company ID and select them.`}
				/>
				
				<Row h={32}/>
				
				<SimpleEnterField
					on={oChecklist.CopyFromTerpChecklist}
					icon={FaRegArrowAltCircleUp}
					label={'Copy from Terp ID'}
					description={`This will copy another terp's checklist and paste it here.`}
				/>
			</SimCard>
		);
	}
}

@observer
class DemandRow extends React.Component {
	render() {
		const {
			demand,
			onToggle,
		} = this.props;
		
		const {
			name,
			checklisted,
			notes,
		} = demand;
		
		return (
			<Row
				marB={3}
				childV
			>
				<DemandStatus statusDef={GetDemandStatusDef(demand.status)}/>
				
				<HoverRow
					marL={8}
					onClick={onToggle}
					hueOn={'#eaeaea'}
				>
					<IcoToggle
						isSet={checklisted}
						size={12}
						marT={1}
					/>
					
					<Txt
						marL={4}
						hue={checklisted ? '#000000' : '#7c7c7c'}
						b={checklisted}
						size={12}
					>{name}</Txt>
				</HoverRow>
			</Row>
		);
	}
}

@observer
class DemandStatus extends React.Component {
	render() {
		const {statusDef} = this.props;
		
		if (!statusDef.icon) return <Col w={16}/>;
		
		return (
			<Ico
				icon={statusDef.icon}
				size={12}
				hueBg={statusDef.hueBg}
				pad={2}
				tooltip={statusDef.tooltip}
			/>
		);
	}
}


/* OLD */


@observer
class Category extends React.Component {
	render() {
		const category = this.props.category;
		const name = category.categoryName.replace(/^[-\d\s]*/, '');
		
		return (
			<SimCard header={name} grow minWidth={200}>
				{category.creds.map(cred => (
					<Cred
						key={cred.credId}
						cred={cred}
						terpId={this.props.terpId}
					/>
				))}
			</SimCard>
		);
	}
}


@observer
class Cred extends React.Component {
	
	@observable addingArchive = false;
	@observable form = new Formula({
		fields: {
			expiresOn: new Fieldula({
				label: 'Expires',
				type: 'date',
			}),
		}
	});
	
	@action AddArchive = () => {
		this.addingArchive = !this.addingArchive;
	};
	
	@action SubmitArchive = () => {
		const oCreds = Jewels().credentials;
		return oCreds.SubmitArchive(
			this.props.terpId,
			this.props.cred.credId,
			thyme.fromDateInput(this.form.fields.expiresOn.value),
		);
	};
	
	@computed get hasExpiredCred() {
		if (this.props.cred.terpCreds.current) return false;
		return ($j.last(this.props.cred.terpCreds.history) || {}).expired;
		// return this.props.cred.terpCreds.history.some(c => c.expired);
	}
	
	@computed get icon() {
		const current = this.props.cred.terpCreds.current;
		if (!current) {
			return (
				<Butt
					on={this.AddArchive}
					icon={this.hasExpiredCred ? MdErrorOutline : Ico_unmet}
					iconSize={'1.6rem'}
					iconHue={this.hasExpiredCred ? '#ff3b4a' : '#969696'}
					subtle
					mini
					primary
					tooltip={this.hasExpiredCred ? 'Expired' : undefined}
				/>
			);
		}
		
		
		if (current.verified) {
			const verifiedAt = thyme.nice.dateTime.short(thyme.fromFastJson(current.verifiedAt));
			
			if (current.fileLocation === 'ARCHIVE') {
				return (
					<Tip
						text={`This file is in the Archive. Verified at ${verifiedAt} by ${current.verifiedBy}`}
					>
						<Ico_archive size={'1.6rem'} color={'#d329c5'}/>
					</Tip>
				);
			}
			
			return (
				<Tip text={`Verified at ${verifiedAt} by ${current.verifiedBy}`}>
					<Ico_met size={'1.6rem'} color={'#00d32d'}/>
				</Tip>
			);
		}
		
		return <Ico_pending size={'1.6rem'} color={'#dab531'}/>;
	}
	
	render() {
		const oCreds = Jewels().credentials;
		const terpId = this.props.terpId;
		const cred = this.props.cred;
		const current = cred.terpCreds.current;
		const needVerify = current && !current.verified;
		
		return (
			<Row>
				<Col w={needVerify && 5 || 0} hue={'#fff08c'}/>
				
					<Row
						// marL={10}
						childCenterV
					>
						{this.icon}
						<Txt
							marL={6}
							// size={'1.25rem'}
							hue={current ? '#000' : (this.hasExpiredCred ? '#ff3b4a' : '#a5a5a5')}
						>{cred.name}</Txt>
						
						{current && current.verified && (
							<Butt
								on={() => oCreds.Review(cred, current)}
								icon={MdPageview}
								// iconSize={'1.5rem'}
								subtle
								mini
								marL={6}
								tooltip={'Review'}
							/>
						)}
						
						{current && !current.verified && (
							<Butt
								on={() => oCreds.Review(cred, current)}
								label={'Review'}
								icon={MdPageview}
								// iconSize={'2rem'}
								primary
								marL={12}
							/>
						)}
						
						{this.addingArchive && cred.expires && (
							<MiniField $={this.form.fields.expiresOn} marL={12}/>
						)}
						
						{this.addingArchive && (
							<Butt
								on={this.SubmitArchive}
								label={'Add'}
								icon={Ico_archive}
								// iconSize={'1.5rem'}
								primary
								mini
								tooltip={'Designate this file as living in the old archive'}
								marL={12}
							/>
						)}
					
					</Row>
					
			
			</Row>
		);
	}
}

@observer
class CredCurrentOLD extends React.Component {
	
	@observable expiresOn = '';
	@observable canVerify = false;
	
	componentDidMount() {
		this.Initialize();
	}
	
	@action Initialize = () => {
		const terpCred = this.props.terpCred;
		this.form.fields.expiresOn.Import({
			expiresOn: terpCred.expiresOn ? thyme.toDateInput(thyme.fromFastJson(terpCred.expiresOn)) : ''
		});
		if (!terpCred.verified) {
			this.canVerify = true;
		}
	};
	
	@observable form = new Formula({
		fields: {
			expiresOn: new Fieldula({
				label: 'Expires',
				type: 'date',
			}),
		}
	});
	
	@action VerifyCred = () => {
		const oCreds = Jewels().credentials;
		const terpCred = this.props.terpCred;
		return oCreds.VerifyCred(terpCred, thyme.fromDateInput(this.expiresOn));
	};
	
	@action RemoveCred = () => {
		const oCreds = Jewels().credentials;
		const terpCred = this.props.terpCred;
		return oCreds.RemoveCred(terpCred);
	};
	
	@action EditExpiresOn = () => {
		this.canVerify = true;
	};
	
	render() {
		const oCreds = Jewels().credentials;
		const cred = this.props.cred;
		const terpCred = this.props.terpCred;
		
		return (
			<Row marB={20} childCenterV>
				
				<Butt
					on={() => oCreds.Review(cred, terpCred)}
					label={'Review'}
					icon={MdPageview}
					iconSize={'2rem'}
					primary
				/>
				
				{cred.requires === 'file' && <SubmittedFile terpCred={terpCred} subtle={!this.canVerify}/>}
				{cred.requires === 'fillable' && <SubmittedFillable terpCred={terpCred}/>}
				{cred.requires === 'acknowledgement' && <SubmittedAck terpCred={terpCred}/>}
				{cred.requires === 'rid' && <SubmittedRid terpCred={terpCred} subtle={!this.canVerify}/>}
				{cred.requires === 'rid_cert' &&
				<SubmittedFile terpCred={terpCred} subtle={!this.canVerify} tooltip={'Same as RID Card'}/>}
				
				
				{cred.expires && (
					<Row marL={20} marR={8} childCenterV>
						{this.canVerify && (
							<MiniField $={this.form.fields.expiresOn}/>
						)}
						{!this.canVerify && (
							<>
								<Txt>Expires: {this.form.fields.expiresOn.value}</Txt>
								<Butt
									on={this.EditExpiresOn}
									icon={Ico_edit}
									subtle
									mini
								/>
							</>
						)}
					</Row>
				)}
				
				{this.canVerify && (
					<Butt
						on={this.VerifyCred}
						icon={Ico_met}
						iconSize={'2rem'}
						green
						tooltip={'Verify'}
						mini
						marL={20}
					/>
				)}
				
				{!this.canVerify && (
					<Row marL={20} marR={8} childCenterV>
						<Txt marR={8} size={'.75em'} b>Verified: </Txt>
						<Tip
							text={thyme.nice.dateTime.short(thyme.fromFastJson(terpCred.verifiedAt))}
						>
							<Txt>{terpCred.verifiedBy}</Txt>
						</Tip>
					</Row>
				)}
				
				
				<Col minWidth={50} grow/>
				
				<Butt
					on={this.RemoveCred}
					icon={Ico_unmet}
					danger
					subtle
					tooltip={'Remove'}
					mini
				/>
			</Row>
		);
	}
}
