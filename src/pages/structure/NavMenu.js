import React from 'react';
import {observer} from 'mobx-react';
import {Router} from 'stores/RootStore';
import {Col, Img, Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {MdHelp} from 'react-icons/md';
import {ServerStatus} from '../../misc/ServerStatus';
import {LogoutButton} from '../../Bridge/misc/LogoutButton';
import {action, computed, observable} from 'mobx';
import {HUE} from '../../Bridge/HUE';
import {Beat} from '../../Bridge/misc/Iconic';
import Linker from '../../Bridge/Nav/Linker';
// import img_logo from '../../images/starfishBanner.png';
import img_logo from '../../images/starfishBanner_v3_0_128.png';
import {StaffAvatar} from '../../components/Avatar';
import {CreateJobButton} from '../Job/JobUpdate/CreateJobButton';
import {Ico} from '../../Bridge/Bricks/Ico';
import {QuickNavs} from './QuickNavs';
import {VERSION, VersionToString} from '../../VERSION';
import {Root} from '../../stores/RootStore';
import {FaArrowAltCircleUp} from 'react-icons/fa';
import {KromeyMode} from '../../misc/holiday/KromeyMode';

const fullWidth = 164;
const collapsedWidth = 56;


@observer
export class NavMenu extends React.Component {
	
	
	@computed get navs() {
		const routes = Root().routes;
		const currentRootPath = Router().currentRootPath;
		
		return routes.menuNavs.map(nav =>
			<NavMenuItem
				key={nav.path}
				nav={nav}
				selected={nav.rootPath === currentRootPath}
				collapsed={routes.collapsed}
			/>
		);
	}
	
	@computed get secondaryNavs() {
		const routes = Root().routes;
		const currentRootPath = Router().currentRootPath;
		
		return routes.secondaryNavs.map(nav =>
			<NavMenuItem
				key={nav.path}
				nav={nav}
				selected={nav.rootPath === currentRootPath}
				collapsed={routes.collapsed}
			/>
		);
	}
	
	render() {
		const root = Root();
		const routes = root.routes;
		
		if (routes.hidden) {
			return <Col/>;
		}
		
		
		return (
			<Col
				NAV_MENU_COLUMN
				hView
				w={fullWidth}
				hue={HUE.navMenu.bg}
				sticky
				overflow
			>
				<Row
					hue={HUE.navMenu.logoBg}
					childC
					padV={12}
				>
					<Linker toKey={'home'}>
						<Img
							src={img_logo}
							w={70}
							h={70}
						/>
					</Linker>
					
					{/*<IconButton icon={MdMenu} on={routes.ToggleCollapse} hue={'#fff'}/>*/}
				</Row>
				
				<CreateJobButton/>
				
				<Col childN>
					{this.navs}
				</Col>
				
				{/*<KromeyMode/>*/}
				
				<Col grow/>
				
				<QuickNavs/>
				
				<Col grow/>
				
				<Col childN>
					{this.secondaryNavs}
				</Col>
				
				<Col grow/>
				
				<Col marB={20} childCenterH>
					<ServerStatus/>
					<Version/>
					<StacheSummary/>
				</Col>
				
				<Linker toKey={'user'}>
					<Row marB={20} childC>
						{root.staff && (
							<StaffAvatar
								staff={root.staff}
								noTooltip
							/>
						)}
						<Txt marL={3} size={10} hue={'#9d9d9d'}>{root.user.label || '???'}</Txt>
					</Row>
				</Linker>
				
				<Col grow/>
				
				<Row childCenterH>
					<LogoutButton onClick={root.Logout}/>
				</Row>
				
				<Col h={12}/>
			</Col>
		
		);
	}
}

@observer
class Version extends React.Component {
	render() {
		const root = Root();
		
		return (
			<Row marT={8} childC>
				<Txt
					hue={'#9d9d9d'}
					size={14}
				>v{VersionToString(VERSION)}
				</Txt>
				
				{root.nextVersion && (
					<Beat>
						<Ico
							marL={6}
							icon={FaArrowAltCircleUp}
							hue={'#ffffff'}
							size={14}
							tooltip={[
								'New version detected!',
								`${VersionToString(VERSION)} --> ${VersionToString(root.nextVersion)}`,
								'Please close/refresh Starfish.',
							]}
						/>
					</Beat>
				)}
			</Row>
		);
	}
}


@observer
export class NavMenuItem extends React.Component {
	
	@observable isHovering = false;
	@action SetHover = (isHovering) => this.isHovering = isHovering;
	
	render() {
		const nav = this.props.nav;
		const selected = this.props.selected;
		
		let bgHue = HUE.bgDark;
		let borderLeftHue = HUE.bgDark;
		let textHue = HUE.bgLight;
		
		if (selected) {
			bgHue = HUE.bgLight;
			borderLeftHue = HUE.blueLight;
			textHue = HUE.bgDark;
		} else if (this.isHovering) {
			bgHue = HUE.bgDarkHover;
			borderLeftHue = HUE.bgDarkHover;
		}
		
		const Icon = nav.icon || MdHelp;
		const iconSize = nav.iconSize || 18;
		
		if (nav.customNav) {
			const CustomNav = nav.customNav;
			return (
				<Linker to={nav}>
					<CustomNav
						nav={nav}
						selected={selected}
						borderLeftHue={borderLeftHue}
						bgHue={bgHue}
						textHue={textHue}
						isHovering={this.isHovering}
						SetHover={this.SetHover}
					/>
				</Linker>
			);
		}
		
		const NotesComp = nav.notes;
		
		return (
			<Linker to={nav}>
				<Row
					h={48}
					padR={12}
					hue={bgHue}
					childV
					onMouseEnter={() => this.SetHover(true)}
					onMouseLeave={() => this.SetHover(false)}
				>
					<Col
						w={6}
						hFill
						hue={borderLeftHue}
					/>
					
					<Col
						childC
						marL={10}
						w={18}
					>
						<Ico
							icon={Icon}
							size={iconSize}
							hue={textHue}
						/>
					</Col>
					
					<Txt
						marL={10}
						hue={textHue}
						size={16}
						// semibold
					>{nav.name}</Txt>
					
					<Col grow/>
					
					{!!NotesComp && (
						<NotesComp nav={nav}/>
					)}
				</Row>
			</Linker>
		);
	}
}

@observer
class StacheSummary extends React.Component {
	render() {
		const root = Root();
		const observedCount = root.stacher.totalObservedCount;
		const pendingCount = root.stacher.totalPendingCount;
		
		return (
			<Row marT={8} childC>
				<Txt
					hue={'#9d9d9d'}
					size={14}
				>
					{observedCount - pendingCount} / {observedCount}
				</Txt>
			
			</Row>
		)
	}
}