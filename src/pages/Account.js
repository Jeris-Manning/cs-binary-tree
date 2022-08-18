import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {SimCard} from '../Bridge/misc/Card';
import {Row, Txt} from '../Bridge/Bricks/bricksShaper';
import SimpleEnterField from '../components/SimpleEnterField';
import {action, observable, runInAction} from 'mobx';
import ErrorRow from '../components/ErrorRow';
import {MdAdd, MdClose, MdSave} from 'react-icons/md';
import Butt from '../Bridge/Bricks/Butt';
import thyme from '../Bridge/thyme';
import {TiKey} from 'react-icons/ti';

const BLANK_ACCOUNT = {
	email: '',
	permissions: [],
	identity: {
		customers: [],
		companies: [],
		terps: [],
		deafs: [],
	},
	loginAt: thyme.epoch,
	resetAt: thyme.epoch,
};

const PERMISSION_CHOICES = [
	{value: 'ADMIN', label: 'ADMIN'},
	{value: 'STAFF', label: 'STAFF'},
	{value: 'TERP', label: 'TERP'},
	{value: 'COMPANY', label: 'COMPANY'},
	{value: 'DEAF', label: 'DEAF'},
];

@observer
export default class Account extends React.Component {
	
	@observable isLoading = false;
	@observable email = '';
	@observable account = BLANK_ACCOUNT;
	@observable hasChanged = false;
	@observable showCreate = false;
	@observable creationResult = {};
	
	@action LoadAccount = async (email, clearAccount = true) => {
		this.isLoading = true;
		this.hasChanged = false;
		this.showCreate = false;
		this.creationResult = {};
		this.email = email;
		if (clearAccount) this.account = BLANK_ACCOUNT;
		
		const account =
			await Jewels().account.GetAccountDetails(email);
		
		console.log(account);
		
		runInAction(() => {
			this.account = account;
			this.isLoading = false;
			
			this.showCreate = !!this.account.error; // && this.account.error.includes(`can't find`);
		});
	};
	
	@action OnAdd = (identity, key) => {
		this.hasChanged = true;
		this.account.identity[identity].push({
			key: key,
			text: 'ADDED',
		});
	};
	
	@action OnRemove = (identity, key) => {
		this.hasChanged = true;
		this.account.identity[identity] = this.account.identity[identity].filter(e => e.key !== key);
	};
	
	// @action OnPermissionAdd = (perm) => {
	// 	this.hasChanged = true;
	// 	this.account.permissions.push(perm.value);
	// };
	//
	// @action OnPermissionRemove = (key) => {
	// 	this.hasChanged = true;
	// 	this.account.permissions = this.account.permissions.filter(p => p !== key);
	// };
	
	@action Save = async () => {
		await Jewels().account.UpdateAccountDetails(this.account);
		return this.LoadAccount(this.email, false);
	};
	
	@action ResetPassword = async () => {
		await Jewels().account.ResetPassword(this.email);
		return this.LoadAccount(this.email, false);
	};
	
	@action CreateAccount = async () => {
		this.showCreate = false;
		
		const result =
			await Jewels().account.CreateAccount(this.email);
		
		if (result.error) {
			this.account.error = result.error;
			return;
		}
		
		await this.LoadAccount(this.email, false);
		
		runInAction(() => {
			this.creationResult = result;
		})
	};
	
	render() {
		return (
			<>
				
				<SimCard padding w={350}>
					<SimpleEnterField
						on={this.LoadAccount}
						label={'Email'}
					/>
					<ErrorRow error={this.account.error}/>
					
					{this.showCreate && (
						<Butt
							on={this.CreateAccount}
							label={'Create Account'}
							icon={MdAdd}
							subtle
							primary
							marT={12}
						/>
					)}
					
					{this.creationResult && this.creationResult.email && (
						<>
							<Txt>Account Created!</Txt>
							<Txt>{this.creationResult.email}</Txt>
							<Txt>Temp password: {this.creationResult.tempPw}</Txt>
							<Txt>Please reset their password after IDs have been added.</Txt>
						</>
					)}
				</SimCard>
				
				{/*<Card header={'Details'} padding loading={this.isLoading}>*/}
				{/*	<Txt>{JSON.stringify(this.account)}</Txt>*/}
				{/*</Card>*/}
				
				{!this.account.error && this.account.email && (
					<>
						<SimCard padding w={500} header={this.account.email}>
							
							<Row>
								<Txt>Last Auth:</Txt>
								<Txt marL={4} b>{thyme.nice.dateTime.minimal(this.account.loginAt)}</Txt>
							</Row>
							<Row marT={4}>
								<Txt>Last Successful Password Reset:</Txt>
								<Txt marL={4} b>{thyme.nice.dateTime.minimal(this.account.resetAt)}</Txt>
							</Row>
							<Butt
								on={this.ResetPassword}
								label={'Reset Password'}
								icon={TiKey}
								marT={12}
								danger
								alert={'Sending!'}
							/>
						</SimCard>
						
						<Row wrap>
							
							{/*<KeysEditor*/}
							{/*	header={'Permissions'}*/}
							{/*	entries={this.account.permissions.map(p => ({key: p}))}*/}
							{/*	onAdd={this.OnPermissionAdd}*/}
							{/*	onRemove={this.OnPermissionRemove}*/}
							{/*	choices={PERMISSION_CHOICES}*/}
							{/*	noTrim*/}
							{/*/>*/}
							
							<KeysEditor
								header={'Customer IDs (aka Contacts)'}
								entries={this.account.identity.customers}
								onAdd={key => this.OnAdd('customers', key)}
								onRemove={key => this.OnRemove('customers', key)}
								w={500}
							/>
							<KeysEditor
								header={'Company IDs'}
								entries={this.account.identity.companies}
								onAdd={key => this.OnAdd('companies', key)}
								onRemove={key => this.OnRemove('companies', key)}
								w={500}
							/>
							<KeysEditor
								header={'Interpreter IDs'}
								entries={this.account.identity.terps}
								onAdd={key => this.OnAdd('terps', key)}
								onRemove={key => this.OnRemove('terps', key)}
								w={500}
							/>
							<KeysEditor
								header={'Deaf IDs'}
								entries={this.account.identity.deafs}
								onAdd={key => this.OnAdd('deafs', key)}
								onRemove={key => this.OnRemove('deafs', key)}
								w={500}
							/>
						</Row>
					</>
				)}
				
				<Butt
					on={this.Save}
					icon={MdSave}
					primary
					disabled={!this.hasChanged}
					marH={16}
					marV={20}
					w={500}
				/>
			
			</>
		);
	}
}


@observer
class KeysEditor extends React.Component {
	
	render() {
		const {
			header,
			entries,
			onAdd,
			onRemove,
			choices,
		} = this.props;
		
		return (
			<>
				<SimCard header={header} padding w={this.props.w}>
					{entries.map(entry => (
						<KeysEntryRow
							key={entry.key}
							entry={entry}
							onRemove={() => onRemove(entry.key)}
						/>
					))}
					
					<SimpleEnterField
						on={onAdd}
						label={''}
						icon={MdAdd}
						clearAfter
						// usePicker={!!choices}
						// choices={choices}
						type={'number'}
					/>
				</SimCard>
			</>
		);
	}
}

@observer
class KeysEntryRow extends React.Component {
	render() {
		const {
			entry,
			onRemove
		} = this.props;
		
		return (
			<Row childCenterV marB={4}>
				<Butt
					on={onRemove}
					icon={MdClose}
					iconSize={'1rem'}
					mini
					subtle
					danger
				/>
				
				<Txt w={60} b>{entry.key}</Txt>
				<Txt>{entry.text}</Txt>
			</Row>
		);
	}
}


/*

app_metadata
{
	"permissions": [
		"ADMIN",
		"STAFF",
		"CUST",
		"DEAF",
		"TERP",
		"STAFF"
	],
	
	"customerIds": [
		8814,
		6236
	],
	
	"deafIds": [
		11445
	],
	
	"terpIds": [
		1270
	],
	
	"companyIds": [
		366
	]
}


 */