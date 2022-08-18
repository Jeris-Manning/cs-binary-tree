import React from 'react';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Router} from 'stores/RootStore';
import Loading from '../../Bridge/misc/Loading';
import {PageTitleStandard} from '../../Bridge/misc/NavPage';
import ButtLink from '../../components/ButtLink';
import {GiMimicChest} from 'react-icons/gi';
import {JobTable} from '../../components/JobTable';
import ToggleButton from '../../components/ToggleButton';
import {HUE} from '../../Bridge/HUE';
import {SaveControls} from '../../components/SaveControls';
import {DeafEdit} from './DeafEdit';
import {ClipTxt} from '../../Bridge/misc/Clip';

@observer
class DeafUpdate extends React.Component {
	render() {
		const vDeaf = Jewels().vDeaf;
		const oJobs = Jewels().jobs;
		
		const deafId = this.props.deafId;
		
		if (vDeaf.loader.isLoading || deafId !== vDeaf.deafId) return <Loading/>;
		
		if (vDeaf.error) return (
			<Txt
				hue={HUE.error}
				size={24}
				mar={20}
			>
				{vDeaf.error}
			</Txt>
		);
		
		return (
			<>
				
				<DeafHeader/>
				
				<DeafEdit/>
				
				<JobTable
					getAllJobs={(params) => oJobs.GetJobsBy({
						by: 'deaf',
						deafId: deafId,
						...params,
					})}
				/>
			
			</>
		);
	}
}

@observer
export class DeafHeader extends React.Component {
	render() {
		const vDeaf = Jewels().vDeaf;
		const updata = vDeaf.updata;
		
		const fullName = `${updata.firstName.value} ${updata.lastName.value}`;
		
		return (
			<>
				<PageTitleStandard name={fullName} id={updata.deafId.value}/>
				
				<Row marH={24} marT={8} childV>
					
					
					<ClipTxt id copy={updata.deafId.value}/>
					
					<Col w={32}/>
					
					<ClipTxt title copy={fullName}/>
					
					<Col grow/>
					
					<ButtLink
						a={`https://portal.aslis.com/#/admin/${updata.email.value}`}
						label={'Portal'}
						tooltip={'Mimic on Portal'}
						icon={GiMimicChest}
						secondary
						// w={300}
					/>
					
					<Col grow/>
					
					<ToggleButton
						primary
						label={'Active'}
						isChecked={updata.active.value}
						on={updata.active.Toggle}
						subtle
						marR={24}
					/>
					
					<SaveControls store={vDeaf}/>
				
				</Row>
				
				{vDeaf.saveError && (
					<Txt
						hue={HUE.error}
						size={24}
						mar={20}
					>
						{vDeaf.saveError}
					</Txt>
				)}
			</>
		
		);
	}
}

@observer
class Overview extends React.Component {
	render() {
		return (
			<Txt>TODO: No deafId given (use the Finder on the right to find a specific person)</Txt>
		);
	}
}


@observer
export class DeafPage extends React.Component {
	render() {
		const params = Router().params;
		
		if (params.deafId === 'overview') return <Overview/>;
		
		return (
			<DeafUpdate {...params}/>
		);
	}
}