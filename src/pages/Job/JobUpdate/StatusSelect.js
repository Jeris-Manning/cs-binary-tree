// import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
// import React, {Component} from 'react';
// import {Col, Row} from '../../../Bridge/Bricks/bricksShaper';
// import Butt from '../../../Bridge/Bricks/Butt';
// import ListPicker from '../../../Bridge/Bricks/ListPicker';
// import {MdSave} from 'react-icons/md';
//
// // @observer
// export default class StatusSelect extends React.Component {
// 	render() {
// 		const oJobs = Jewels().jobs;
// 		const field = oJobs.jobForm.fields.statusId;
//
// 		return (
// 			<ListPicker
// 				$={field}
// 				w={250}
// 				marV={'0'}
// 				marB={'0'}
// 				marR={'0'}
// 				h={60}
// 				size={22}
// 			/>
// 		);
//
// 		return (
// 			<Row>
// 				<Col>
// 					<ListPicker
// 						$={field}
// 						w={250}
// 					/>
// 				</Col>
//
// 				<Col w={40}>
// 					<Butt
// 						on={oJobs.SaveStatus}
// 						icon={MdSave}
// 						primary
// 						mini
// 						grow
// 						marT={16}
// 						marB={10}
// 						square
// 						disabled={!field.hasChanged}
// 					/>
// 				</Col>
// 			</Row>
// 		);
// 	}
// }