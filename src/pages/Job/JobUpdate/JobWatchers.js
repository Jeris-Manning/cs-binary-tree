import React from 'react';
import {observer} from 'mobx-react';
import {Staches} from 'stores/RootStore';
import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
import {StaffAvatar} from '../../../components/Avatar';
import {Ico} from '../../../Bridge/Bricks/Ico';
import {computed} from 'mobx';
import {MdAccessibility, MdEdit, MdVisibility} from 'react-icons/md';
import thyme from '../../../Bridge/thyme';
import {Tip} from '../../../Bridge/misc/Tooltip';
import styled, {css, keyframes} from 'styled-components';
import type {C_JobView} from './JobBasics';
import {WatcherStaff} from '../../../datum/stache/WatcherDat';
import {StaffDat} from '../../../datum/stache/StaffDat';
import {IconType} from 'react-icons';

@observer
export class JobWatchers extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		
		const watchers = jobRef.watcherDat.watchers || [];
		
		// if (watchers.length === 0) {
		// 	return <Txt>none</Txt>;
		// }
		
		return (
			<Row grow childH>
				{watchers.map(watcher => (
					<StaffWatcher
						key={watcher.key}
						watcher={watcher}
					/>
				))}
			</Row>
		);
	}
}

@observer
class StaffWatcher extends React.Component {
	
	@computed get staffDat(): StaffDat {
		const staffEmail = this.props.watcher.staffEmail;
		return Staches().cStaffByEmail.GetOrStub(staffEmail, true, 'StaffWatcher').dat;
	}
	
	@computed get isEditing(): boolean {
		const watcher: WatcherStaff = this.props.watcher;
		return watcher.status.includes('editing');
	}
	
	@computed get isSeeking(): boolean {
		const watcher: WatcherStaff = this.props.watcher;
		return watcher.status.includes('seek');
	}
	
	@computed get animation() {
		if (this.isEditing) {
			return css`${editingKeyframes} 3s linear infinite`;
		}
		
		return undefined;
	}
	
	@computed get icon(): IconType {
		if (this.isEditing) return MdEdit;
		return this.isSeeking
			? MdAccessibility
			: MdVisibility;
	}
	
	@computed get tip(): string {
		const watcher: WatcherStaff = this.props.watcher;
		const name = this.staffDat.internalName || this.staffDat.key;
		
		let tip = `${name}`;
		
		if (this.isEditing) tip += ' has unsaved changes!';
		else if (this.isSeeking) tip += ' is on the Seek page';
		else tip += ' is on the Details page';
		
		// tip += `<br/>[${watcher.key}]`;
		
		return tip;
	}
	
	render() {
		const watcher: WatcherStaff = this.props.watcher;
		
		if (watcher.isLocal) return <></>;
		
		return (
			<Tip text={this.tip}>
				<WatcherContainer
					animation={this.animation}
				>
					<StaffAvatar
						noTooltip
						staff={this.staffDat}
						size={42}
					/>
					
					<Row
						position={'relative'}
						bottom={9}
						childCenterH
					>
						<Col
							circle
							hue={'rgba(0,0,0,0.23)'}
						>
							<Ico
								icon={this.icon}
								childC
								hue={'#fff'}
							/>
						</Col>
					</Row>
				</WatcherContainer>
			</Tip>
		);
	}
}

const WatcherContainer = styled.div`
  animation: ${p => p.animation};
  margin-right: 8px;
  height: 40px;
`;

const editingKeyframes = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;