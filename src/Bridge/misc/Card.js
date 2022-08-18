import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {HUE} from '../HUE';
import {action, observable} from 'mobx';
import Foldable from './Foldable';
import Butt from '../Bricks/Butt';
import {MdEdit} from 'react-icons/md';

@observer
export class SimCard extends React.Component {
	
	@observable isFolded = false;
	@action ToggleFolded = () => this.isFolded = !this.isFolded;
	
	componentDidMount() {
		if (this.props.foldable) this.ToggleFolded();
	}
	
	render() {
		const {
			children,
			header,
			foldable,
		} = this.props;
		
		return (
			<Col
				hue={HUE.simCardBg}
				shadowPage
				pad={12}
				mar={10}
				{...this.props}
				SimCard
			>
				{foldable ? (
					<Row
						childC
						marB={8}
					>
						<Col>
							<SimHeader
								header={header}
								marB={1}
							/>
						</Col>
						<Col marL={6} marT={2}>
							<Foldable
								onClick={this.ToggleFolded}
								shown={!this.isFolded}
								size={20}
							/>
						</Col>
					</Row>
				) : (
					<SimHeader header={header}/>
				)}
				
				{!this.isFolded && children}
			</Col>
		);
	}
}

@observer
export class SimHeader extends React.Component {
	render() {
		const {
			header,
			marB,
		} = this.props;
		
		if (!header) return <></>;
		
		return (
			<Txt
				size={12}
				// smallCaps
				caps
				hue={HUE.fieldLabel}
				marB={marB || 8}
			>
				{header}
			</Txt>
		);
	}
}

@observer
export class SimCardEdit extends React.Component {
	
	@observable isEditing = false;
	@action ToggleEditing = () => this.isEditing = !this.isEditing;
	
	render() {
		const {
			icon,
			// children,
			contentEdit,
			contentView,
			addRowWrap,
			blankText,
			innerPadV,
			editTooltip,
		} = this.props;
		
		let inner = this.isEditing ? contentEdit : contentView;
		
		if (!inner && blankText) {
			inner = <Txt hue={'#636363'}>{blankText}</Txt>;
		}
		
		const outer = addRowWrap ? (
			<Row wrap>{inner}</Row>
		) : (
			<>{inner}</>
		);
		
		return (
			<SimCard
				pad={0}
				{...this.props}
			>
				<Row>
					<Col w={20}/>
					
					<Col grow shrink padV={innerPadV || 20}>
						{outer}
					</Col>
					
					{this.isEditing ? (
						<Col w={20}/>
					) : (
						<Butt
							on={this.ToggleEditing}
							icon={icon || MdEdit}
							subtle
							mini
							square
							w={40}
							tooltip={editTooltip}
						/>
					)}
				</Row>
			</SimCard>
		);
	}
}