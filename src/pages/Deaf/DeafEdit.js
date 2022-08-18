import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {UpCard, UpFieldFit, UpRow, UpTog} from '../../Bridge/misc/UpField';
import thyme from '../../Bridge/thyme';
import {Jewels} from '../../stores/RootStore';
import {DeafMedicalRecords} from './DeafMedicalRecords';
import {DeafPrefEditor} from './DeafPrefEditor';

@observer
export class DeafEdit extends React.Component {
	render() {
		const vDeaf = Jewels().vDeaf;
		const updata = vDeaf.updata;
		
		return (
			<>
				
				<Row>
					<Col fit>
						<UpCard>
							<UpRow>
								<UpFieldFit
									label={'First Name'}
									state={updata.firstName}
									grow
								/>
								
								<UpFieldFit
									label={'Last Name'}
									state={updata.lastName}
									marL={8}
									grow
								/>
							</UpRow>
							
							<UpRow>
								<UpFieldFit
									label={'Email'}
									state={updata.email}
									grow
								/>
								
								<UpFieldFit
									label={'Dob'}
									state={updata.dob}
									marL={8}
									grow
								/>
								
								<UpFieldFit
									label={'Preferred Pronoun'}
									state={updata.pronoun}
									marL={8}
									grow
								/>
							</UpRow>
							
							<UpRow>
								
								<UpFieldFit
									label={'Phone'}
									state={updata.phone}
									grow
								/>
								
								<UpFieldFit
									label={'TTY'}
									state={updata.tty}
									marL={8}
									grow
								/>
							
							</UpRow>
							
							<UpRow>
								
								<UpFieldFit
									label={'Video Phone'}
									state={updata.videoPhone}
									grow
								/>
								
								<UpFieldFit
									label={'Pager'}
									state={updata.pager}
									marL={8}
									grow
								/>
							
							</UpRow>
						
						</UpCard>
						
						<UpCard>
							
							<Row childH marB={12}>
								<UpTog
									state={updata.isDb}
									label={'DB'}
								/>
								
								<Col w={16}/>
								
								<UpTog
									state={updata.isMls}
									label={'MLS'}
								/>
								
								<Col w={16}/>
								
								<UpTog
									state={updata.isLv}
									label={'LV'}
								/>
							
							</Row>
							
							
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
							
							<Txt marT={80} size={18} i>
								TODO: prefs, category
							</Txt>
							
							<UpRow marT={24}>
								<UpFieldFit
									label={'Created On'}
									value={thyme.nice.dateTime.short(updata.createdOn.value)}
									readonly
								/>
								
								<UpFieldFit
									label={'Updated On'}
									value={thyme.nice.dateTime.short(updata.updatedOn.value)}
									readonly
								/>
								
								<UpFieldFit
									label={'Last User'}
									state={updata.lastUser}
									readonly
								/>
							</UpRow>
						
						</UpCard>
					</Col>
					
					<Col>
						<DeafMedicalRecords/>
					</Col>
				
				</Row>
				
				<Row>
					
					<UpFieldFit
						label={'Notes For Terp'}
						state={updata.notesForTerp}
						multiline
						h={160}
						card={{grow: true}}
					/>
					
					<UpFieldFit
						label={'Notes Deaf Profile'}
						state={updata.notesDeafProfile}
						multiline
						h={160}
						card={{grow: true}}
					/>
					
					<UpFieldFit
						label={'Notes For Staff'}
						state={updata.notesForStaff}
						multiline
						h={200}
						card={{grow: true}}
					/>
				
				</Row>
				
				<DeafPrefEditor/>
			
			</>
		);
	}
}