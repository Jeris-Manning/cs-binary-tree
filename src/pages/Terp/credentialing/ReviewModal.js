import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import PopModal from '../../../Bridge/misc/PopModal';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import MiniField from '../../../components/MiniField';
import Butt from '../../../Bridge/Bricks/Butt';
import Formula from '../../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../../Bridge/Bricks/Formula/Fieldula';
import {action, computed, observable} from 'mobx';
import {Tip} from '../../../Bridge/misc/Tooltip';
import thyme from '../../../Bridge/thyme';
import {SubmittedAck, SubmittedFillable} from './SubmittedCred';
import styled from 'styled-components';
import Loading from '../../../Bridge/misc/Loading';
import {MdCheck, MdFileDownload, MdRotateRight, MdThumbDown, MdVolumeOff} from 'react-icons/md';

const cannedRejectionTrunc = 30;

@observer
export default class ReviewModal extends React.Component {
	
	
	@observable form = new Formula({
		fields: {
			expiresOn: new Fieldula({
				label: 'Expires',
				type: 'date',
			}),
			reason: new Fieldula({
				label: 'Reason',
				multiline: true,
			}),
		}
	});
	
	@computed get cannedRejections() {
		const cred = Jewels().credentials.reviewCred;
		if (!cred || !cred.cannedRejections) return [];
		return cred.cannedRejections.split('\n').map(rej => ({
			full: rej,
			label: rej.length > cannedRejectionTrunc ? `${rej.slice(0, cannedRejectionTrunc)}...` : rej,
		}));
	}
	
	@action SetCannedRejection = (text) => {
		this.form.fields.reason.value = text;
	};
	
	
	@action VerifyCred = (terpCred, sendAlert) => {
		const oCreds = Jewels().credentials;
		return oCreds.VerifyCred(
			oCreds.reviewCred,
			terpCred,
			this.form.fields.expiresOn.value,
			sendAlert,
		);
	};
	
	@action RejectCred = (terpCred, sendAlert) => {
		const oCreds = Jewels().credentials;
		return oCreds.RemoveCred(
			oCreds.reviewCred,
			terpCred,
			this.form.fields.reason.value,
			sendAlert,
		);
	};
	
	@action UnverifyCred = (terpCred) => {
		const oCreds = Jewels().credentials;
		return oCreds.Unverify(terpCred);
	};
	
	
	render() {
		const oCreds = Jewels().credentials;
		const cred = oCreds.reviewCred;
		const terpCred = oCreds.reviewTerpCred;
		const fields = this.form.fields;
		
		if (!cred || !terpCred || !cred.credId || !terpCred.terpCredId) {
			return <Col/>;
		}
		
		return (
			<PopModal
				isOpen={oCreds.showReviewModal}
				onClose={oCreds.HideReview}
			>
				<Col fillView maxWidth={1200} maxHeight={900} pad={30}>
					
					<Row fill>
						<Col grow shrink>
							{cred.requires === 'file' && <PreviewFrame terpCred={terpCred}/>}
							{cred.requires === 'fillable' && <SubmittedFillable terpCred={terpCred}/>}
							{cred.requires === 'acknowledgement' && <SubmittedAck terpCred={terpCred}/>}
							{cred.requires === 'rid' && <PreviewFrame terpCred={terpCred}/>}
							{cred.requires === 'rid_cert' && <PreviewFrame terpCred={terpCred}/>}
						</Col>
						
						<Col w={20}/>
						
						<Col w={'30%'}>
							<Summary cred={cred} terpCred={terpCred}/>
							
							<Col h={20}/>
							
							<Col borL={5} hueBorL={'#c2101d'} padV={12} padH={16}>
								<Txt size={22} marB={8}>Reject</Txt>
								
								{this.cannedRejections.map(rej => (
									<Butt
										on={() => this.SetCannedRejection(rej.full)}
										key={rej.full}
										subtle
										mini
										tooltip={rej.full}
										label={rej.label}
										// labelSize={'0.8rem'}
										marB={4}
									/>
								))}
								
								<MiniField $={fields.reason} h={300}/>
								
								<Row>
									<Butt
										on={() => this.RejectCred(terpCred, true)}
										label={'Reject'}
										icon={MdThumbDown}
										danger
										grow
									/>
									<Butt
										on={() => this.RejectCred(terpCred, false)}
										// label={'Reject Silently'}
										icon={MdVolumeOff}
										danger
										w={50}
										marL={12}
										tooltip={'REJECT SILENTLY: Reject but do NOT send email alert to interpreter. The reason will NOT be sent.'}
									/>
								</Row>
							</Col>
							
							<Col grow/>
							
							{cred.expires && (
								<Expiration field={fields.expiresOn} initial={terpCred.expiresOn}
								            locked={terpCred.verified}/>
							)}
							
							<Col grow/>
							
							{terpCred.verified && (
								<Col marB={20}>
									
									<Txt b size={'1.2rem'}>Verified by: {terpCred.verifiedBy}</Txt>
									<Txt b size={'1.2rem'}>Verified
										at: {thyme.nice.dateTime.short(thyme.fromFastJson(terpCred.verifiedAt))}</Txt>
									
									<Butt
										on={() => this.UnverifyCred(terpCred)}
										label={'Unverify'}
										subtle
										danger
										w={140}
										marT={8}
										padH={6}
									/>
								</Col>
							)}
							
							{!terpCred.verified && (
								<Row>
									<Butt
										on={() => this.VerifyCred(terpCred, false)}
										label={'Verify'}
										icon={MdCheck}
										green
										h={80}
										grow
									/>
									{/*<Butt*/}
									{/*	on={() => this.VerifyCred(terpCred, true)}*/}
									{/*	icon={MdVolumeUp}*/}
									{/*	green*/}
									{/*	h={80}*/}
									{/*	w={50}*/}
									{/*	marL={12}*/}
									{/*	tooltip={'Verify and send email notification to interpreter.'}*/}
									{/*/>*/}
								</Row>
							)}
						</Col>
					</Row>
				
				</Col>
			</PopModal>
		);
	}
}

@observer
class Summary extends React.Component {
	render() {
		const cred = this.props.cred;
		const terpCred = this.props.terpCred;
		
		const submittedAt = thyme.fromFastJson(terpCred.submittedAt);
		
		return (
			<Col childCenterH>
				<Txt size={20} marB={6}>{cred.name}</Txt>
				<Tip text={thyme.nice.dateTime.short(submittedAt)}>
					<Row>
						<Txt marR={6}>Submitted:</Txt>
						<Txt marB={20}>
							{thyme.relative(submittedAt)}
						</Txt>
					</Row>
				</Tip>
			</Col>
		);
	}
}

@observer
class Expiration extends React.Component {
	
	componentDidMount() {
		this.Initialize();
	}
	
	@action Initialize = () => {
		const initial = this.props.initial;
		this.props.field.ImportValue(initial ? thyme.toDateInput(thyme.fromFastJson(initial)) : '');
	};
	
	render() {
		if (this.props.locked) return (
			<Txt>Expires: {this.props.field.value}</Txt>
		);
		
		return (
			<MiniField $={this.props.field}/>
		);
	}
}

@observer
class PreviewFrame extends React.Component {
	
	componentDidMount() {
		return this.LoadFileUrl();
	}
	
	@observable rotate = 0;
	@action Rotate = () => {
		this.rotate = (this.rotate + 90) % 360;
		console.log(`Rotate image = ${this.rotate}`);
	};
	
	@observable url = '';
	
	@action LoadFileUrl = async () => {
		if (this.props.terpCred.fileLocation.includes('Outside')) {
			this.SetUrl(this.props.terpCred.fileLocation);
			return;
		}
		
		const oCreds = Jewels().credentials;
		const fileKey = this.props.terpCred.fileLocation.split('.com/aslis-terp/').pop(); // TODO: seems hacky;
		
		const result =
			await oCreds.GetFileUrl(fileKey);
		
		this.SetUrl(result.fileUrl);
	};
	
	@action SetUrl = (url) => {
		this.url = url;
		console.log(`PreviewFrame: set url to ${this.url}`);
	};
	
	@action Download = async () => {
		if (this.props.terpCred.fileLocation.includes('Outside')) {
			window.open(this.props.terpCred.fileLocation, '_blank');
			return;
		}
		
		const oCreds = Jewels().credentials;
		const fileKey = this.props.terpCred.fileLocation.split('.com/aslis-terp/').pop(); // TODO: seems hacky;
		
		const result =
			await oCreds.GetFileUrl(fileKey);
		
		window.open(result.fileUrl, '_blank');
	};
	
	@computed get extensionType() {
		const fileLoc = this.props.terpCred.fileLocation;
		
		if (!fileLoc) return '';
		if (fileLoc === 'ARCHIVE') return 'ARCHIVE';
		
		const extension = fileLoc.split('.').pop().toLowerCase();
		
		switch (extension) {
			case 'pdf':
				return 'pdf';
			
			case 'png':
			case 'jpg':
			case 'jpeg':
				return 'image';
			
			default:
				return extension || 'unknown';
		}
	};
	
	render() {
		if (!this.url) {
			return (
				<Col fill hue={'#d0d3c7'}>
					<Txt>{this.url}</Txt>
					<Loading size={30}/>
				</Col>
			);
		}
		
		if (this.extensionType === 'pdf') {
			return (
				<Col fill>
					<Butt
						on={this.Download}
						icon={MdFileDownload}
						label={this.extensionType}
						primary
						w={200}
						marB={12}
					/>
					<object
						data={this.url}
						type={'application/pdf'}
						width={'100%'}
						height={'100%'}
					/>
				</Col>
			);
		}
		
		if (this.extensionType === 'image') {
			return (
				<>
					{this.props.terpCred.submission && (
						<Txt b size={'2rem'} marV={8}>{this.props.terpCred.submission}</Txt>
					)}
					
					<Butt
						on={this.Download}
						icon={MdFileDownload}
						label={this.extensionType}
						primary
						w={200}
						marB={12}
					/>
					
					<Image
						size={'100%'}
						src={this.url}
						rotate={this.rotate}
					/>
					
					<Row childE>
						<Butt
							on={this.Rotate}
							icon={MdRotateRight}
							marT={8}
							tooltip={'Rotate Image'}
						/>
					</Row>
				</>
			);
		}
		
		if (this.extensionType === 'ARCHIVE') {
			return (
				<>
					<Txt>This file has been designated as archived and is located on the file server.</Txt>
					<Txt>\Data\ASL & Dycom\Agreements\Archive</Txt>
					<Txt>If you want to remove this, use 🔇 Reject Silently</Txt>
				</>
			);
		}
		
		return (
			<>
				<Txt i>No preview available for .{this.extensionType} file type.</Txt>
				<Butt
					on={this.Download}
					icon={MdFileDownload}
					label={this.extensionType}
					primary
					w={200}
					marT={12}
				/>
			</>
		);
	}
}


const Image = styled.img`
		width: 100%;
		height: auto;
		transform: rotate(${p => p.rotate || 0}deg);
		`;


// {terpCred.note && (
// 	<Col marL={12}>
// 		<Tip text={terpCred.note}>
// 			<Txt dashed>Note</Txt>
// 		</Tip>
// 	</Col>
// )}


// <iframe
// 	title='Inline Frame Example'
// 	width={frameWidth}
// 	height={frameHeight}
// 	src={this.url}
// />