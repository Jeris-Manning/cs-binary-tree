import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {action, computed, observable} from 'mobx';
import {Col, Row, Txt} from '../Bridge/Bricks/bricksShaper';
import {HUE} from '../Bridge/HUE';
import Foldable from '../Bridge/misc/Foldable';
import Butt from '../Bridge/Bricks/Butt';
import {MdEdit, MdSave} from 'react-icons/md';
import ReactLoading from 'react-loading';
import $j from '../Bridge/misc/$j';

const MODES = {
	loading: 'LOADING', // TODO
	viewing: 'VIEWING',
	editing: 'EDITING',
};

@observer
export default class EditCard extends React.Component {
	
	@observable foldable = '';
	@action SetFoldable = foldable => this.foldable = foldable;
	@action ToggleFoldable = () => {
		this.foldable = this.foldable === 'shown' ? 'hidden' : 'shown';
	};
	
	@observable mode = MODES.viewing;
	
	@action SetMode = mode => this.mode = mode;
	
	@computed get rightButton() {
		switch (this.mode) {
			case MODES.loading:
				return (
					<Col grow>
						<ReactLoading
							type={'spin'} //spinningBubbles
							color={'#ff9f46'}
							width={'100%'}
							height={'100%'}
						/>
					</Col>
				);
			
			case MODES.viewing:
				return (
					<Butt
						on={this.Edit}
						icon={MdEdit}
						subtle
						mini
						grow
						square
					/>
				);
			case MODES.editing:
				return (
					<Butt
						on={this.Save}
						icon={MdSave}
						primary
						mini
						grow
						square
						alert={'Saving'}
					/>
				);
		}
	}
	
	@action Edit = () => {
		this.SetMode(MODES.editing);
	};
	
	@action Save = async () => {
		const [result, error] = await $j.split(
			this.props.onSave()
		);
		
		if (error) {
			this.error = error; // TODO
			return;
		}
		
		this.SetMode(MODES.viewing);
	};
	
	componentDidMount() {
		this.SetFoldable(this.props.foldable);
	}
	
	render() {
		const props = this.props;
		const outline = props.danger ? `${HUE.labelRed} 1px solid` : null;
		
		return (
			<Row
				hue={'white'}
				shadowPage
				marV={props.marV || 12}
				marH={props.marH || 12}
				className={'edit-card'}
				outline={this.mode === MODES.editing ? `#01b6d1 1px solid` : undefined}
				{...props}
			>
				<Col w={props.leftWidth || 20}/>
				
				<Col grow shrink padV={props.innerPadV || 20}>
					<CardHeader
						header={props.header}
						hue={props.hueHeader}
						foldable={this.foldable}
						foldableOnClick={() => this.ToggleFoldable()}
					/>
					{this.foldable !== 'hidden' && props.children(this.mode === MODES.editing)}
				</Col>
				
				<Col w={props.rightWidth || 40}>
					{this.rightButton}
				</Col>
			</Row>
		);
	}
}


@observer
class CardHeader extends React.Component {
	
	render() {
		const props = this.props;
		if (!props.header) return <Row/>;
		
		return (
			<Row marH={16} marB={12} childCenterH>
				<Txt size={22} hue={props.hue || HUE.blueDeep}>{props.header}</Txt>
				{props.foldable && (
					<Col marL={10} marT={3}>
						<Foldable
							onClick={props.foldableOnClick}
							shown={props.foldable === 'shown'}
							size={20}
						/>
					</Col>
				)}
			</Row>
		);
	}
}
