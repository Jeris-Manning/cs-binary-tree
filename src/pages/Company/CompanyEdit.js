import React from 'react';
import {observer} from 'mobx-react';
import {Row} from '../../Bridge/Bricks/bricksShaper';
import {UpCard, UpFieldFit, UpRow, UpTog} from '../../Bridge/misc/UpField';
import thyme from '../../Bridge/thyme';
import {CompanyDemands} from './CompanyDemands';
import {CompanyContacts} from './CompanyContacts';
import {CompanyLocations} from './CompanyLocations';
import {JobTable} from '../../components/JobTable';
import {Jewels} from '../../stores/RootStore';
import {CompanyFiles} from './CompanyFiles';
import {SelectorField} from '../../Bridge/misc/SelectorField';

@observer
export class CompanyEdit extends React.Component {
	
	render() {
		const vCompany = Jewels().vCompany;
		const oJobs = Jewels().jobs;
		
		const updata = vCompany.updata;
		const companyId = this.props.companyId;
		
		return (
			<>
				
				<Row wrap>
					
					<UpCard grow maxHalf>
						
						<UpFieldFit
							label={'Organization Name'}
							state={updata.name}
						/>
						
						<UpFieldFit
							label={'Street'}
							state={updata.address}
						/>
						<UpFieldFit
							label={'Street 2'}
							state={updata.address2}
						/>
						
						<UpRow>
							<UpFieldFit
								label={'City'}
								state={updata.city}
							/>
							
							<UpFieldFit
								label={'State'}
								state={updata.state}
							/>
							
							<UpFieldFit
								label={'Zip'}
								state={updata.zip}
							/>
						</UpRow>
						
						<UpFieldFit
							label={'DefaultLoc'}
							state={updata.defaultLoc}
						/>
						
						
						<UpRow>
							<UpFieldFit
								label={'Class'}
								state={updata.class}
							/>
							
							<UpFieldFit
								label={'Medical Record Company ID'}
								state={updata.medicalRecordId}
								description={MEDICAL_RECORD_COMPANY_TIP}
							/>
						</UpRow>
						
						<UpRow marT={2}>
							<UpFieldFit
								label={'Contract Expiration'}
								state={updata.contractExpire}
							/>
							
							<SelectorField
								// label={'Contract Type'}
								state={updata.contractType}
								grow
								hideOutline
								placeholder={'Contract Type'}
							/>
						</UpRow>
					
					</UpCard>
					
					
					<UpCard grow>
						
						<Row childSpread>
							<UpFieldFit
								label={'Phone'}
								state={updata.phone}
							/>
							<UpFieldFit
								label={'Fax'}
								state={updata.fax}
							/>
							<UpTog
								label={'Has Attachment 📎'}
								tooltip={'Terps will see a paperclip icon on the app and must send in paperwork after a job.'}
								state={updata.hasAttachment}
							/>
						</Row>
						
						<UpRow>
							<UpFieldFit
								label={'Rate'}
								state={updata.rate}
							/>
							<UpFieldFit
								label={'Cap'}
								state={updata.cap}
							/>
							<UpFieldFit
								label={'Cap VRI'}
								state={updata.capVri}
							/>
						</UpRow>
						
						<UpFieldFit
							label={'Notes for Staff'}
							state={updata.note}
							multiline
							h={120}
						/>
						
						<UpFieldFit
							label={'Notes for Interpreter'}
							state={updata.notesForTerp}
							multiline
							h={90}
						/>
						
						<Row grow/>
						
						<UpRow marT={24}>
							<UpFieldFit
								label={'Updated On'}
								value={thyme.nice.dateTime.short(updata.updatedOn.value)}
								readonly
							/>
							<UpFieldFit
								label={'Last User'}
								state={updata.lastUser}
								marL={8}
								readonly
							/>
						</UpRow>
					
					</UpCard>
				
				
				</Row>
				
				<CompanyFiles/>
				
				<Row childN>
					
					<CompanyDemands w={'66%'}/>
					
					<CompanyContacts marL={8} grow/>
				
				</Row>
				
				
				<Row>
					<CompanyLocations companyId={companyId}/>
				</Row>
				
				<JobTable
					getAllJobs={(params) => oJobs.GetJobsBy({
						by: 'company',
						companyId: companyId,
						...params,
					})}
				/>
			</>
		);
	}
}

// TODO pull from database
const MEDICAL_RECORD_COMPANY_TIP = [
	'TODO: add dropdown, for now put number:',
	' 1  -  Allina',
	' 4  -  Park',
	' 6  -  FUMC',
	' 8  -  HCMC',
	' 9  -  Medica',
	'11  -  UCARE',
	'15  -  MHC-Allina',
	'17  -  MHC-Fairview',
	'18  -  MHC-HCMC',
	'22  -  MHC-Park Nicollet',
	'23  -  Mayo',
	'24  -  Mayo Austin',
	'26  -  CentraCare',
	'27  -  Sanford',
	'28  -  Essentia',
];