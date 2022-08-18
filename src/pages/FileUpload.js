import {observer} from 'mobx-react';
import {Jewels} from 'stores/RootStore';
import React from 'react';
import {SimCard} from '../Bridge/misc/Card';
import Butt from '../Bridge/Bricks/Butt';
import {action, observable, runInAction} from 'mobx';
import Formula from '../Bridge/Bricks/Formula/Formula';
import Fieldula from '../Bridge/Bricks/Formula/Fieldula';
import {MdContentCopy, MdFileUpload} from 'react-icons/md';
import MiniField from '../components/MiniField';
import {Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {Clip} from '../Bridge/misc/Clip';

@observer
export class FileUpload extends React.Component {
	
	@observable file = null;
	@observable error = '';
	@observable resultFileUrl = '';
	@observable resultCred = '';
	@observable form = new Formula({
		fields: {
			credId: new Fieldula({
				label: 'Cred ID (optional)',
			}),
		}
	});
	
	
	@action Upload = async () => {
		const oFileUpload = Jewels().fileUpload;
		
		this.error = '';
		this.resultFileUrl = '';
		this.resultCred = '';
		
		const result = await oFileUpload.Upload({
			file: this.file,
			fileName: this.file.name,
			credId: this.form.fields.credId.value,
		});
		
		runInAction(() => {
			if (!result.fileUrl) {
				this.error = JSON.stringify(result);
			} else {
				this.resultFileUrl = result.fileUrl;
				this.resultCred = result.addedToCred;
				this.file = null;
			}
		});
	};
	
	@action OnFileSelected = (evt) => {
		this.file = (evt && evt.target.files && evt.target.files.length) ? evt.target.files[0] : null;
	};
	
	render() {
		return (
			<>
				<SimCard header={'Cred Form Upload'} padH={12}>
					
					<Row>
						<input
							id={'fileUpload'}
							type='file'
							onChange={this.OnFileSelected}
						/>
					</Row>
					
					<MiniField
						$={this.form.fields.credId}
						w={200}
						marT={20}
					/>
					<Butt
						on={this.Upload}
						icon={MdFileUpload}
						label={'Upload'}
						primary
						disabled={!this.file}
						marT={20}
						w={200}
					/>
					
					{this.resultFileUrl && (
						<Row marT={20}>
							<Txt marR={4}>{this.resultFileUrl}</Txt>
							<Clip copy={this.resultFileUrl}>
								<Butt mini subtle icon={MdContentCopy}/>
							</Clip>
						</Row>
					)}
					
					{this.resultCred && (
						<Txt marT={20}>Added to cred: {this.resultCred}</Txt>
					)}
					
					{this.error && (
						<Txt marT={20} hue={'#ff2100'}>Error: {this.error}</Txt>
					)}
				</SimCard>
				
				<StaffPhotoUpload/>
				
				<UploadMisc/>
				
			</>
		);
	}
}

@observer
class StaffPhotoUpload extends React.Component {
	
	@observable file = null;
	@observable error = '';
	@observable resultFileUrl = '';
	@observable form = new Formula({
		fields: {
			email: new Fieldula({
				label: 'Staff Email (optional)',
			}),
		}
	});
	
	
	@action Upload = async () => {
		const oFileUpload = Jewels().fileUpload;
		
		this.error = '';
		this.resultFileUrl = '';
		this.resultCred = '';
		
		const result = await oFileUpload.UploadStaffPhoto({
			file: this.file,
			fileName: this.file.name,
			email: this.form.fields.email.value,
		});
		
		runInAction(() => {
			if (!result.fileUrl) {
				this.error = JSON.stringify(result);
			} else {
				this.resultFileUrl = result.fileUrl;
				this.file = null;
			}
		});
	};
	
	@action OnFileSelected = (evt) => {
		this.file = (evt && evt.target.files && evt.target.files.length) ? evt.target.files[0] : null;
	};
	
	render() {
		return (
			<>
				<SimCard header='Staff Photo Upload' padH={12}>
					
					<Row>
						<input
							id={'staffPhotoUpload'}
							type='file'
							onChange={this.OnFileSelected}
						/>
					</Row>
					
					<MiniField
						$={this.form.fields.email}
						w={200}
						marT={20}
					/>
					<Butt
						on={this.Upload}
						icon={MdFileUpload}
						label={'Upload'}
						primary
						disabled={!this.file}
						marT={20}
						w={200}
					/>
					
					{this.resultFileUrl && (
						<Row marT={20}>
							<Txt marR={4}>{this.resultFileUrl}</Txt>
							<Clip copy={this.resultFileUrl}>
								<Butt mini subtle icon={MdContentCopy}/>
							</Clip>
						</Row>
					)}
					
					{this.error && (
						<Txt marT={20} hue={'#ff2100'}>Error: {this.error}</Txt>
					)}
				</SimCard>
			</>
		);
	}
}

@observer
class UploadMisc extends React.Component {
	
	@observable file = null;
	@observable error = '';
	@observable resultFileUrl = '';
	
	@action Upload = async () => {
		const oFileUpload = Jewels().fileUpload;
		
		this.error = '';
		this.resultFileUrl = '';
		this.resultCred = '';
		
		const result = await oFileUpload.UploadMisc({
			file: this.file,
			fileName: this.file.name,
		});
		
		runInAction(() => {
			if (!result.fileUrl) {
				this.error = JSON.stringify(result);
			} else {
				this.resultFileUrl = result.fileUrl;
				this.file = null;
			}
		});
	};
	
	@action OnFileSelected = (evt) => {
		this.file = (evt && evt.target.files && evt.target.files.length) ? evt.target.files[0] : null;
	};
	
	render() {
		return (
			<>
				<SimCard header='Miscellaneous File Upload' padH={12}>
					
					<Txt marT={4} i>Can be used for storing misc ASLIS files, such as for marketing or workshops. Try not to go too crazy with file sizes.</Txt>
					<Txt marT={4} b>File name should be unique. A file with the same name WILL OVERWRITE any existing file with the same name.</Txt>
					
					<Row h={16}/>
					
					<Row>
						<input
							id={'uploadMisc'}
							type='file'
							onChange={this.OnFileSelected}
						/>
					</Row>
					
					<Butt
						on={this.Upload}
						icon={MdFileUpload}
						label={'Upload'}
						primary
						disabled={!this.file}
						marT={20}
						w={200}
					/>
					
					{this.resultFileUrl && (
						<Row marT={20}>
							<Txt marR={4}>{this.resultFileUrl}</Txt>
							<Clip copy={this.resultFileUrl}>
								<Butt mini subtle icon={MdContentCopy}/>
							</Clip>
						</Row>
					)}
					
					{this.error && (
						<Txt marT={20} hue={'#ff2100'}>Error: {this.error}</Txt>
					)}
				</SimCard>
			</>
		);
	}
}