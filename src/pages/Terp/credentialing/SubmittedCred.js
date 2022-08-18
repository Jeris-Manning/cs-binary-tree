import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {action, computed} from 'mobx';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdFileDownload} from 'react-icons/md';
import {Col, Txt} from '../../../Bridge/Bricks/bricksShaper';

@observer
export class SubmittedFile extends React.Component {
	
	@action Download = async () => {
		const oCreds = Jewels().credentials;
		const fileKey = this.props.terpCred.fileLocation.split('.com/aslis-terp/').pop(); // TODO: seems hacky;
		
		const result =
			await oCreds.GetFileUrl(fileKey);
		
		window.open(result.fileUrl, '_blank');
	};
	
	@computed get extension() {
		return this.props.terpCred.fileLocation.split('.').pop();
	};
	
	render() {
		return (
			<Butt
				on={this.Download}
				icon={MdFileDownload}
				label={this.extension}
				mini
				primary
				subtle={this.props.subtle}
				tooltip={this.props.tooltip}
			/>
		);
	}
}


@observer
export class SubmittedFillable extends React.Component {
	
	render() {
		const answers = this.props.terpCred.submission.split('\n');
		
		return (
			<Col>
				{answers.map(answer => (
					<Col key={answer} marB={8}>
						<Txt>{answer.split(':')[0]}</Txt>
						<Txt b>{answer.split(':').pop()}</Txt>
					</Col>
				))}
			</Col>
		);
	}
}


@observer
export class SubmittedAck extends React.Component {
	
	render() {
		return (
			<Col>
				<Txt>Acknowledged!</Txt>
			</Col>
		);
	}
}

@observer
export class SubmittedRid extends React.Component {
	
	@action Download = async () => {
		const oCreds = Jewels().credentials;
		const fileKey = this.props.terpCred.fileLocation.split('.com/aslis-terp/').pop(); // TODO: seems hacky;
		
		const result =
			await oCreds.GetFileUrl(fileKey);
		
		window.open(result.fileUrl, '_blank');
	};
	
	@computed get extension() {
		return this.props.terpCred.fileLocation.split('.').pop();
	};
	
	render() {
		const submission =  this.props.terpCred.submission || 'MISSING RID#';
		
		return (
			<Col>
				<Txt b marB={6}>{submission}</Txt>
				
				<Butt
					on={this.Download}
					icon={MdFileDownload}
					label={this.extension}
					mini
					primary
					subtle={this.props.subtle}
				/>
			</Col>
		);
	}
}
