// import React, {Component} from 'react';
// import {observer} from 'mobx-react';
// import {Jewels, Staches} from 'stores/RootStore';
// import {action, computed, observable} from 'mobx';
// import {SimCard} from '../../../Bridge/misc/Card';
// import {Col, Row, Txt} from '../../../Bridge/Bricks/bricksShaper';
// import ReactSpeedometer from 'react-d3-speedometer';
// import './dash.css';
// import thyme from '../../../Bridge/thyme';
// import $j from '../../../Bridge/misc/$j';
//
// @observer
// export default class DashTv extends React.Component {
// 	render() {
// 		// TODO: update this
// 		return <Txt>TODO: update this if still using?</Txt>;
//
// 		const oDash = Jewels().dash;
// 		const oChat = Jewels().staffChat;
//
// 		return (
// 			<>
// 				<Col fillView hue={'#607074'} overflow={'hidden'}>
//
// 					<Row padT={10} padH={10}>
// 						<Col w={'25%'}>
// 							<FillVelocity data={oDash.fillVelocity}/>
// 							<Stat label={'Filled Today'} stat={oDash.stats.jobsFilledToday}/>
// 							<Stat label={'Jobs To Fill'} stat={oDash.stats.jobsToFill}/>
// 						</Col>
//
// 						<Col w={'50%'}>
// 							<NowTerp data={oDash.nowTerp}/>
// 						</Col>
//
// 						<Col w={'25%'}>
// 							<DateAndTime/>
// 							<Stat label={'Created Today'} stat={oDash.stats.jobsCreatedToday}/>
// 							<Stat label={'Unread Chats'} stat={oChat.unreadChatCount}/>
// 							<Col grow/>
// 							<Stat label={'💡 idea?'} stat={`aslis.com/idea`}/>
// 						</Col>
// 					</Row>
//
//
// 					{/*{oDash.isRefreshing && <Loading/>}*/}
//
// 					<Row grow/>
//
// 					<Row h={100} hue={'#566468'} >
// 						<Weather/>
// 					</Row>
// 				</Col>
//
//
// 			</>
// 		);
// 	}
// }
//
// @observer
// class Widget extends React.Component {
// 	render() {
//
//
// 		return (
// 			<Col
// 				hue={'#607074'}
// 				{...this.props}
// 			/>
// 		);
// 	}
// }
//
//
// @observer
// class FillVelocity extends React.Component {
// 	render() {
// 		const data = this.props.data;
//
// 		if (!data.max) return <Col/>;
//
// 		const max = data.max;
// 		const current = Math.min(data.current, max);
//
// 		const shake = current >= max;
//
// 		LOG(`current: ${current}, max: ${max}`);
//
// 		return (
// 			<SimCard h={200} w={300}>
// 				<Row childCenterH>
// 					<Txt size={'1rem'} hue={'#028fab'} marB={10}>Filled Per Hour</Txt>
// 				</Row>
// 				<Row childCenterH>
// 					<Txt
// 						size={'1rem'}
// 						hue={'#62606a'}
// 						b
// 					>{current} FPH</Txt>
// 				</Row>
// 				<Col marH={20} grow>
// 					<Speedometer
// 						fluidWidth
// 						minValue={0}
// 						maxValue={max}
// 						value={current}
// 						// value={30}
// 						segments={3}
// 						segmentColors={[
// 							'#e88e00',
// 							'#00b6d1',
// 							'#86ad00',
// 						]}
// 						needleColor={'#000000'}
// 						shake={shake}
// 						needleTransitionDuration={4000}
// 						needleTransition="easeElastic"
// 						currentValueText={''}
// 						// currentValueText={'${value} FPH'}
// 						ringWidth={90}
// 					/>
// 				</Col>
//
// 			</SimCard>
// 		);
// 	}
// }
//
// @observer
// class Speedometer extends React.Component {
//
// 	render() {
// 		if (this.props.shake) {
// 			return (
// 				<Row grow className={'shake'}>
// 					<ReactSpeedometer {...this.props} />
// 				</Row>
// 			);
// 		}
//
// 		return (
// 			<ReactSpeedometer {...this.props} />
// 		);
// 	}
// }
//
// @observer
// class Weather extends React.Component {
// 	render() {
// 		return (
// 			<Col grow>
// 				<a
// 					className="weatherwidget-io"
// 					href="https://forecast7.com/en/44d99n93d36/golden-valley/?unit=us"
// 					data-label_1="ASLIS"
// 					data-label_2="WEATHER"
// 					data-theme="original">
// 					ASLIS WEATHER
// 				</a>
// 			</Col>
// 		);
// 	}
// }
//
//
// @observer
// class DateAndTime extends React.Component {
//
// 	ticker;
//
// 	componentDidMount() {
// 		this.ticker = setInterval(this.Tick);
// 	}
//
// 	componentWillUnmount() {
// 		if (this.ticker) clearInterval(this.ticker);
// 	}
//
// 	@observable now = thyme.now();
//
// 	@action Tick = () => {
// 		this.now = thyme.now();
// 	};
//
// 	render() {
// 		return (
// 			<SimCard childCenterH padH={50}>
// 				<Txt size={'2rem'} hue={'#62606a'}>
// 					{this.now.toFormat('cccc')}
// 				</Txt>
// 				<Txt size={'2rem'} hue={'#62606a'}>
// 					{this.now.toFormat('M/dd')}
// 				</Txt>
// 				<Txt size={'2.4rem'}>
// 					{thyme.nice.time.short(this.now)}
// 				</Txt>
// 			</SimCard>
// 		);
// 	}
// }
//
// @observer
// class Stat extends React.Component {
// 	render() {
// 		return (
// 			<SimCard childCenterH padH={10}>
// 				<Txt size={'1.2rem'} hue={'#028fab'} marB={10} {...this.props.labelProps}>
// 					{this.props.label}
// 				</Txt>
// 				<Txt size={'2rem'} marB={10} {...this.props.statProps}>
// 					{this.props.stat}
// 				</Txt>
// 			</SimCard>
// 		);
// 	}
// }
//
// @observer
// class NowTerp extends React.Component {
//
// 	@computed get todayShifts() {
// 		LOG(`calculating today shifts ${this.props.data.today.length}`);
// 		return this.props.data.today.map(shift => (
// 			<NowTerpRow
// 				{...shift}
// 			/>
// 		));
// 	}
//
// 	@computed get tomorrowShifts() {
// 		LOG(`calculating tomorrow shifts ${this.props.data.tomorrow.length}`);
// 		return this.props.data.tomorrow.map(shift => (
// 			<NowTerpRow
// 				{...shift}
// 			/>
// 		));
// 	}
//
// 	render() {
// 		return (
// 			<>
// 				<SimCard center padH={10} minHeight={'20vh'}>
// 					<Txt size={'1.2rem'} hue={'#028fab'} marB={12}>Today</Txt>
// 					{this.todayShifts.length
// 						? this.todayShifts
// 						: <Txt size={'1rem'}>None</Txt>}
// 				</SimCard>
//
// 				<SimCard center padH={10} minHeight={'20vh'}>
// 					<Txt size={'1.2rem'} hue={'#028fab'} marB={12}>Tomorrow</Txt>
// 					{this.tomorrowShifts.length
// 						? this.tomorrowShifts
// 						: <Txt size={'1rem'}>None</Txt>}
// 				</SimCard>
// 			</>
// 		);
// 	}
// }
//
// @observer
// class NowTerpRow extends React.Component {
//
// 	@computed get phone() {
// 		const phone = this.props.phone;
// 		return (!phone || phone.length !== 10)
// 			? `? ${phone}`
// 			: `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
// 	}
//
// 	@computed get isNow() {
// 		return thyme.isBetween(thyme.now, this.props.start, this.props.end);
// 	}
//
// 	@computed get note() {
// 		return $j.trunc(this.props.note, 20);
// 	}
//
// 	render() {
//
// 		return (
// 			<Row wFill>
// 				<Col w={'40%'} childW>
// 					<Txt size={'1.4rem'} b={this.isNow} hue={this.isNow ? '#3f3777' : '#505050'}>
// 						{thyme.nice.time.short(this.props.start)}
// 						-
// 						{thyme.nice.time.short(this.props.end)}
// 					</Txt>
// 				</Col>
// 				<Col w={'30%'}>
// 					<Txt size={'1.4rem'}>{this.props.firstName} {this.props.lastName}</Txt>
// 				</Col>
// 				<Col w={'30%'} childCenterV>
// 					<Txt size={'1.0rem'} i>{this.note}</Txt>
// 				</Col>
// 			</Row>
// 		);
// 	}
// }
//
// /*
//
//
// 3840 x 2160
//
// hide menu
// assume full screen (F11)
//
// NowTerp
// unfilled jobs (in next 2 days?)
//
//
//
//  */
//
// const LOG = (str) => console.log('📺  ' + str);
// const LOGO = (str, obj) => console.log('📺  ' + str, obj);