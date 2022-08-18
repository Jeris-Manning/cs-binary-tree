import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Router} from 'stores/RootStore';
import {SimCard} from '../../Bridge/misc/Card';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import {action, observable} from 'mobx';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import MiniField from '../../components/MiniField';
import {MdClose, MdSearch} from 'react-icons/md';
import Butt from '../../Bridge/Bricks/Butt';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {Entabler} from '../../Bridge/Entabler/Entabler';
import Loading from '../../Bridge/misc/Loading';
import ToggleButton from '../../components/ToggleButton';
import {JobTable} from '../../components/JobTable';
import thyme from '../../Bridge/thyme';
import {MiniConfig} from '../../components/ToggleRow';
import {HUE} from '../../Bridge/HUE';

@observer
export class FinderPage extends React.Component {
	
	render() {
		const oJobs = Jewels().jobs;
		const router = Router();
		
		return (
			<>
				
				<SearchLayout/>
				
				<Row wrap childH marT={24}>
					
					<FindById
						header={'Job ID'}
						on={(id) => router.Navigate(
							router.routes.job,
							{
								jobId: id,
								tab: 'details',
							}
						)}
					/>
					
					<FindById
						header={'Account (email)'}
						on={(email) => router.Navigate(
							router.routes.account,
							{
								email: email,
							}
						)}
					/>
				</Row>
				
				
				<JobTable
					header={'Jobs By Date'}
					getAllJobs={(params) => oJobs.GetJobsBy({
						by: 'date',
						...params,
					})}
					end={thyme.now()}
					hideEndDate
				/>
				
			</>
		);
	}
}

@observer
export class FindById extends React.Component {
	
	@observable form = new Formula({
		fields: {
			input: new Fieldula({
				label: '',
				formatter: v => `${v}`.trim(),
			}),
		}
	});
	
	Submit = () => {
		this.props.on(this.form.fields.input.value);
	};
	
	render() {
		const {
			header,
			focus,
		} = this.props;
		
		const fields = this.form.fields;
		
		return (
			<>
				<SimCard
					padH={12}
					w={220}
				>
					<Row marH={16} marB={12} childCenterH>
						<Txt size={22} hue={HUE.blueDeep}>{header}</Txt>
					</Row>
					
					<MiniField
						id={this.props.header}
						$={fields.input}
						onEnterKey={this.Submit}
						name={this.props.header}
						focus={focus}
					/>
					
					<Butt
						on={this.Submit}
						icon={MdSearch}
						disabled={!fields.input.value}
						secondary
					/>
				</SimCard>
			</>
		);
	}
}


@observer
class SearchLayout extends React.Component {
	render() {
		return (
			<SimCard>
				<SearchComps/>
				<Row h={16}/>
				<SearchDataSummary/>
			</SimCard>
		);
	}
}

@observer
class SearchDataSummary extends React.Component {
	// NOTE: this is required to render so that the stache data is marked as 'observed'
	render() {
		const vFinder = Jewels().vFinder;
		
		return (
			<Row childH>
				<Txt
					marR={16}
					b
					hue={'#aaaaaa'}
				>Counts:</Txt>
				
				{vFinder.catClutches.map(clutch => (
					<Txt
						key={clutch.key}
						marR={16}
						i
						hue={'#aaaaaa'}
					>{clutch.dat.entries.length} {clutch.key}</Txt>
				))}
			</Row>
		)
	}
}

@observer
class SearchComps extends React.Component {
	render() {
		const vFinder = Jewels().vFinder;
		
		if (vFinder.isLoadingSearchData) {
			return <></>;
		}
		
		return (
			<>
				<SearchControls/>
				<Row h={12}/>
				<SearchBox/>
				
				<Counts/>
				
				<ResultsTable/>
			</>
		)
	}
}

@observer
class SearchControls extends React.Component {
	render() {
		const vFinder = Jewels().vFinder;
		
		return (
			<Row childH>
				{Object.values(vFinder.categories).map(category => (
					<ToggleButton
						key={category.key}
						marR={20}
						label={category.label}
						isChecked={category.enabled}
						on={() => vFinder.ToggleCategory(category)}
						custom={category.buttonStyle}
						subtle={!category.enabled}
						tabi={1}
					/>
				))}
			</Row>
		);
	}
}

@observer
class SearchBox extends React.Component {
	
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
	}
	
	@action Reset = () => {
		const vFinder = Jewels().vFinder;
		
		this.inputRef.current.focus();
		vFinder.Reset();
	}
	
	render() {
		const vFinder = Jewels().vFinder;
		
		return (
			<Row>
				<Col grow/>
				
				<Butt
					on={this.Reset}
					danger
					icon={MdClose}
					marT={17}
					marR={12}
					marB={12}
				/>
				
				<MiniField
					$={vFinder.form.fields.search}
					// h={50}
					size={26}
					padding={'12px'}
					focus
					grow
					maxWidth={480}
					error={vFinder.searchError}
					inputRef={this.inputRef}
					logAll={vFinder.logAllInput}
				/>
				
				<Col
					grow
					padL={24}
					childV
				>
					<MiniConfig
						onToggle={vFinder.ToggleShowActiveOnly}
						isChecked={vFinder.showActiveOnly}
						label={'Show Active Only'}
					/>
					
					<MiniConfig
						onToggle={vFinder.ToggleLogAllInput}
						isChecked={vFinder.logAllInput}
						label={'Log Input (debugging)'}
					/>
				</Col>
			</Row>
		);
	}
}

@observer
class ResultsTable extends React.Component {
	
	render() {
		const vFinder = Jewels().vFinder;
		
		return (
			<Entabler
				source={vFinder.source}
				sort={'category'}
			/>
		);
	}
}

@observer
class Counts extends React.Component {
	render() {
		const vFinder = Jewels().vFinder;
		
		const counts = vFinder.source.counts;
		
		return (
			<Row childC>
				<Txt
					size={'1.2rem'}
					marT={6}
					marR={12}
				>
					Found {counts.full} results
				</Txt>
				
				{vFinder.isSearching && (
					<Loading size={16}/>
				)}
			</Row>
		);
	}
}