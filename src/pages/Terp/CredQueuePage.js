import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Router, Staches} from 'stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import ButtLink from '../../components/ButtLink';
import {MdBusiness, MdEdit, MdPoll} from 'react-icons/md';
import {computed} from 'mobx';
import type {TerpCredEntry} from '../../datum/stache/TerpCredsDat';
import {TERP_CRED_LISTS, TerpCredListDat} from '../../datum/stache/TerpCredListDat';
import {TerpDat} from '../../datum/stache/TerpDat';
import {CredentialEntry} from '../../datum/stache/CredentialDat';
import thyme from '../../Bridge/thyme';
import {LinkFragile} from '../../Bridge/Nav/Linker';
import {HUE} from '../../Bridge/HUE';


@observer
export class CredQueuePage extends React.Component {
	render() {
		const router = Router();
		
		return (
			<>
				<Row childCenterH marV={12}>
					<ButtLink
						marH={8}
						route={router.routes.credReport}
						label={'Credential Report'}
						icon={MdPoll}
						secondary
					/>
					<ButtLink
						marH={8}
						route={router.routes.companyDemands}
						label={'Company Demands'}
						icon={MdBusiness}
						danger
					/>
					<ButtLink
						marH={8}
						route={router.routes.credEditor}
						label={'Cred Editor'}
						icon={MdEdit}
						primary
					/>
				</Row>
				
				<CredQueueList
					label={'Need Verification'}
					listKey={TERP_CRED_LISTS.needVerify}
					dateKey={'submittedAt'}
				/>
				
				<CredQueueList
					label={'Expiring Soon'}
					listKey={TERP_CRED_LISTS.expiringSoon}
					dateKey={'expiresOn'}
				/>
				
				<CredQueueList
					label={'Expired Recently'}
					listKey={TERP_CRED_LISTS.expiredRecently}
					dateKey={'expiresOn'}
				/>
			</>
		);
	}
}

@observer
class CredQueueList extends React.Component {
	@computed get listDat(): TerpCredListDat {
		const listKey = this.props.listKey;
		return Staches().cTerpCredList.GetOrStub(listKey, true).dat;
	}
	
	render() {
		const label = this.props.label;
		const dateKey = this.props.dateKey;
		
		return (
			<SimCard header={label}>
				
				{this.listDat.terpCreds.length === 0 && (
					<Txt>none</Txt>
				)}
				
				{this.listDat.terpCreds.map((terpCred) => (
					<CredQueueRow
						key={terpCred.key}
						terpCred={terpCred}
						dateKey={dateKey}
					/>
				))}
			
			</SimCard>
		);
	}
}

@observer
class CredQueueRow extends React.Component {
	
	@computed get terpDat(): TerpDat {
		const terpCred: TerpCredEntry = this.props.terpCred;
		return Staches().cTerp.GetOrStub(terpCred.terpId, true, 'CredQueueRow').dat;
	}
	
	@computed get credEntry(): CredentialEntry {
		const terpCred: TerpCredEntry = this.props.terpCred;
		const credentialDat = Staches().cCredential.GetEnumClutch().dat;
		if (!credentialDat.entryLup) return {}; // not loaded yet
		
		return credentialDat.entryLup[terpCred.credentialId];
	}
	
	render() {
		const terpCred: TerpCredEntry = this.props.terpCred;
		const dateKey: string = this.props.dateKey;
		
		return (
			<Row
				marV={3}
			>
				
				<Txt
					w={100}
				>{thyme.nice.date.short(terpCred[dateKey])}</Txt>
				
				<Col w={24}/>
				
				<Row
					w={200}
				>
					<LinkFragile
						toKey={'terp'}
						params={{terpId: terpCred.terpId}}
					>
						<Txt
							w={170}
							// u
							// b
							ellipsis
						>{this.terpDat.label}</Txt>
					</LinkFragile>
				</Row>
				
				<Col w={24}/>
				
				<Txt>{this.credEntry.label}</Txt>
			</Row>
		);
	}
}

@observer
export class CredQueueNavNotes extends React.Component {
	@computed get count(): number {
		return Staches().cTerpCredList.GetOrStub(TERP_CRED_LISTS.needVerify, true)
			.dat.terpCreds.length;
	}
	
	render() {
		if (!this.count) return <></>;
		
		const nav = this.props.nav;
		
		const noteHue = nav.important ? HUE.blueLight : HUE.grey;
		
		return (
			<Col
				childC
				hue={noteHue}
				// h={22}
				padH={4}
				marL={4}
				padT={4}
				padB={2}
			>
				<Txt
					size={14}
					// b
					hue={HUE.navMenu.noteCount}
					noHoliday
					lineH={1}
					center
				>{this.count}</Txt>
			</Col>
		);
	}
}