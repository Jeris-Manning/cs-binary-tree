import {observer} from 'mobx-react';
import React from 'react';
import {action, observable, runInAction} from 'mobx';
import {Jewels} from '../../stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import Butt from '../../Bridge/Bricks/Butt';
import {MdClose, MdContentCopy, MdFileUpload} from 'react-icons/md';


// TODO: update these

@observer
export class CompanyFiles extends React.Component {
	render() {
		const vCompany = Jewels().vCompany;
		const updata = vCompany.updata;
		
		return (
			<SimCard header={'Reference Files'}>
				{updata.files.value.map(fileUrl => (
					<CompanyFileRow
						key={fileUrl}
						fileUrl={fileUrl}
					/>
				))}
				
				<CompanyFileUploader/>
			</SimCard>
		);
	}
}

@observer
class CompanyFileRow extends React.Component {
	
	@action Download = async () => {
		const oCreds = Jewels().credentials;
		const fileKey = this.props.fileUrl.split('.com/aslis-terp/').pop();
		
		const result =
			await oCreds.GetFileUrl(fileKey);
		
		window.open(result.fileUrl, '_blank');
	};
	
	render() {
		const {
			fileUrl,
		} = this.props;
		
		const vCompany = Jewels().vCompany;
		const updata = vCompany.updata;
		
		const fileName = this.props.fileUrl.split('/').pop();
		
		return (
			<Row
				marB={8}
			>
				<Butt
					on={this.Download}
					secondary
					label={'Download'}
					mini
				/>
				
				<Txt
					marL={16}
				>{fileName}
				</Txt>
				
				<Col grow/>
				
				<Butt
					on={() => updata.files.Remove(fileUrl)}
					icon={MdClose}
					mini
					suble
					danger
				/>
			</Row>
		);
	}
}

@observer
class CompanyFileUploader extends React.Component {
	
	@observable file = null;
	@observable error = '';
	
	@action Upload = async () => {
		const oFileUpload = Jewels().fileUpload;
		const vCompany = Jewels().vCompany;
		const updata = vCompany.updata;
		
		this.error = '';
		this.resultFileUrl = '';
		this.resultCred = '';
		
		const result = await oFileUpload.UploadCompanyFile(
			this.file,
			this.file.name,
		);
		
		runInAction(() => {
			if (!result.fileUrl) {
				this.error = JSON.stringify(result);
				return;
			}
			
			this.file = null;
			updata.files.Add(result.fileUrl);
			vCompany.Save();
		});
	};
	
	@action OnFileSelected = (evt) => {
		this.file = (evt && evt.target.files && evt.target.files.length) ? evt.target.files[0] : null;
	};
	
	render() {
		return (
			<>
				{this.error && (
					<Txt marT={20} hue={'#ff2100'}>Error: {this.error}</Txt>
				)}
				
				<Row childV>
					
					<Butt
						on={this.Upload}
						// icon={MdFileUpload}
						label={'Upload File'}
						primary
						disabled={!this.file}
						// mini
						marR={16}
						tooltip={[
							`THIS IS FOR INTERNAL REFERENCE ONLY`,
							`Please back this up elsewhere. This should NOT be the main place the file lives. :)`,
							`File name should be unique to a company, otherwise it will overwrite.`,
							`Meaning, contractFinal_final3.pdf will overwrite any existing contractFinal_final3.pdf but only for this company.`
						]}
					/>
					
					<input
						id={'uploadMisc'}
						type="file"
						onChange={this.OnFileSelected}
					/>
				</Row>
			</>
		);
	}
}


// <Txt marT={4} i>Can be used for storing misc ASLIS files, such as for marketing
// 	or workshops. Try not to go too crazy with file sizes.</Txt>
// <Txt marT={4} b>File name should be unique. A file with the same name WILL
// 	OVERWRITE any existing file with the same name.</Txt>