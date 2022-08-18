import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Root, Router} from 'stores/RootStore';
import {Col, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {HUE} from '../../Bridge/HUE';
import MiniField from '../../components/MiniField';
import {computed, observable} from 'mobx';
import Formula from '../../Bridge/Bricks/Formula/Formula';
import Fieldula from '../../Bridge/Bricks/Formula/Fieldula';
import thyme from '../../Bridge/thyme';
import {ChatSummary} from '../../components/chat/ChatSummary';
import {NavMenuItem} from './NavMenu';
import ButtLink from '../../components/ButtLink';

const fullWidth = 150;
const collapsedWidth = 0;


@observer
export class StatusMenu extends React.Component {
	
	
	@observable form = new Formula({
		fields: {
			input: new Fieldula({
				label: '',
				formatter: v => `${v}`.trim(),
			}),
		}
	});
	
	render() {
		const root = Root();
		const nav = root.routes;
		const router = root.router;
		
		const oJobs = Jewels().jobs;
		
		if (nav.hidden) {
			return <Col/>;
		}
		
		return (
			<Col
				STATUS_MENU_COLUMN
				hView
				w={fullWidth}
				hue={HUE.statusMenuBg}
				sticky
				overflow
			>
				
				<NowClock marV={12}/>
				
				<Row h={80}/>
				
				<Col marH={18}>
					<MiniField
						$={oJobs.gotoJobForm.fields.input}
						onEnterKey={() => oJobs.SubmitGotoJobForm(false, false)}
						name={'Job ID'}
					/>
				</Col>
				
				<NavMenuItem
					nav={router.routes.finder}
					selected={router.routes.finder.rootPath === router.currentRootPath}
				/>
				
				{root.IS_DEBUG && (
					<DebugNavRow/>
				)}
				
				<Col grow/>
				
				<ChatSummary/>
				
				<Row h={8}/>
			
			</Col>
		);
	}
}

@observer
class NowClock extends React.Component {
	
	render() {
		return (
			<Col {...this.props} childCenterH>
				<NowClockRow formatter={thyme.nice.date.short}/>
				<NowClockRow formatter={thyme.nice.date.dayOfWeek}/>
				<NowClockRow formatter={thyme.nice.time.short}/>
			</Col>
		);
	}
}

@observer
class NowClockRow extends React.Component {
	
	@computed get value() {
		return this.props.formatter(Root().now);
	}
	
	render() {
		return (
			<Txt
				hue={'#fff'}
				size={21}
				marV={1}
			>
				{this.value}
			</Txt>
		);
	}
}

@observer
export class GotoId extends React.Component {
	
	@observable form = new Formula({
		fields: {
			input: new Fieldula({
				label: '',
				// formatter: v => `${v}`.trim(),
				placeholder: this.props.placeholder,
			}),
		}
	});
	
	Submit = () => {
		this.props.on(this.form.fields.input.value);
	};
	
	render() {
		const fields = this.form.fields;
		
		return (
			<>
				<MiniField
					$={fields.input}
					onEnterKey={this.Submit}
					name={this.props.name}
				/>
			</>
		);
	}
}

@observer
export class DebugNavRow extends React.Component {
	render() {
		return (
			<>
				<Row childSpread marT={8} marH={6}>
					
					<ButtLink
						toKey={'job'}
						params={{jobId: 88888, tab: 'details'}}
						label={'Jd'}
						mini
						custom={HUE.button.purple}
						textTransform={'none'}
					/>
					
					<ButtLink
						toKey={'job'}
						params={{jobId: 88888, tab: 'seek'}}
						label={'Js'}
						mini
						custom={HUE.button.purple}
						textTransform={'none'}
					/>
					
					<ButtLink
						toKey={'job'}
						params={{jobId: 88888, tab: 'billing'}}
						label={'Jb'}
						mini
						custom={HUE.button.purple}
						textTransform={'none'}
					/>
					
					<ButtLink
						toKey={'job'}
						params={{jobId: 88888, tab: 'linked'}}
						label={'Jl'}
						mini
						custom={HUE.button.purple}
						textTransform={'none'}
					/>
				
				</Row>
				
				<Row childSpread marT={8} marH={6}>
					
					<ButtLink
						toKey={'terp'}
						params={{terpId: 1273}}
						label={'T'}
						mini
						custom={HUE.button.terp}
					/>
					
					<ButtLink
						toKey={'deaf'}
						params={{deafId: 11445}}
						label={'D'}
						mini
						custom={HUE.button.deaf}
					/>
					
					<ButtLink
						toKey={'company'}
						params={{companyId: 366, tab: 'edit'}}
						label={'C'}
						mini
						custom={HUE.button.company}
					/>
					
					<ButtLink
						toKey={'contact'}
						params={{contactId: 10109}}
						label={'c'}
						mini
						custom={HUE.button.blueDark}
						textTransform={'none'}
					/>
				</Row>
				
				<Row marT={12} childH>
					<LinkToLiveSite/>
				</Row>
				
				<Row h={12}/>
			
			</>
		);
	}
}

@observer
class LinkToLiveSite extends React.Component {
	
	render() {
		const link = `https://starfish.aslis.com/${Router().currentPath}`;
		
		return (
			<ButtLink
				a={link}
				label={`Live`}
				mini
				primary
			/>
		);
	}
}

