import React from 'react';
import {observer} from 'mobx-react';
import {Col, Row, Txt} from '../Bricks/bricksShaper';
import {action, observable} from 'mobx';
import {SimField} from '../../components/SimField';
import Butt from '../Bricks/Butt';
import {UpFieldSelect_DEPRECATED} from '../misc/UpFieldSelect_DEPRECATED';
import {is} from '../misc/$j';
import {Tip} from '../misc/Tooltip';
import {MdInfoOutline, MdRemoveCircleOutline} from 'react-icons/md';
import {IoMdArrowRoundDown, IoMdArrowRoundUp} from 'react-icons/io';

@observer
export class Fielder extends React.Component {
	
	@action AddColumn = (key) => {
		this.props.source.AddColumn(key);
	};
	
	render() {
		const {
			spec,
			source,
		} = this.props;
		
		if (!spec) throw new Error(`Fielder requires FielderSpec`);
		if (!source) throw new Error(`Fielder requires FielderSource`);
		
		return (
			<Col>
				
				<CurrentColumns
					source={source}
				/>
				
				<Row h={24}/>
				
				<AddColumnSelector
					spec={spec}
					Select={this.AddColumn}
				/>
			
			</Col>
		);
	}
}


@observer
class AddColumnSelector extends React.Component {
	
	@action Select = (key) => {
		this.props.Select(key);
	};
	
	render() {
		const {
			spec,
			Select,
		} = this.props;
		
		return (
			<Row>
				<UpFieldSelect_DEPRECATED
					choices={spec.GetChoices()}
					onChange={this.Select}
					placeholder={'Add Column'}
					w={400}
				/>
			</Row>
		);
	}
	
}

@observer
class CurrentColumns extends React.Component {
	
	@action ChangeParam = (columnId, paramKey, paramVal) => {
		this.props.source.AlterColumnParam(columnId, paramKey, paramVal);
	};
	
	@action Move = (columnId, by) => this.props.source.MoveColumn(columnId, by);
	
	@action Remove = (columnId) => this.props.source.RemoveColumn(columnId);
	
	render() {
		const {
			source,
		} = this.props;
		
		const columns = [...source.columns.values()];
		const lastDex = columns.length - 1;
		
		return (
			<Col>
				{columns.map((col, dex) => (
					<ColumnEditorRow
						key={col.id}
						column={col}
						ChangeParam={(pKey, pVal) => this.ChangeParam(col.id, pKey, pVal)}
						Move={(by) => this.Move(col.id, by)}
						Remove={() => this.Remove(col.id)}
						isFirst={dex === 0}
						isLast={dex === lastDex}
					/>
				))}
			</Col>
		);
	}
}

@observer
class ColumnEditorRow extends React.Component {
	render() {
		const {
			column,
			ChangeParam,
			Move,
			Remove,
			isFirst,
			isLast,
		} = this.props;
		
		const params = column.params;
		
		const {
			label,
			info,
			link
		} = column.def;
		
		return (
			<Row
				childV
				marV={4}
			>
				<Butt
					on={Remove}
					icon={MdRemoveCircleOutline}
					iconSize={14}
					tooltip={'Remove column'}
					danger
					subtle
					mini
					marR={12}
				/>
				
				<Butt
					on={() => Move(-1)}
					icon={IoMdArrowRoundUp}
					iconSize={14}
					subtle
					mini
					marR={4}
					disabled={isFirst}
					iconHue={isFirst && '#737373'}
				/>
				
				<Butt
					on={() => Move(+1)}
					icon={IoMdArrowRoundDown}
					iconSize={14}
					subtle
					mini
					marR={12}
					disabled={isLast}
					iconHue={isLast && '#737373'}
				/>
				
				<ColumnInfo
					label={label}
					info={info}
					link={link}
				/>
				
				<Col w={16}/>
				
				
				{Object.keys(params).map(pKey => (
					<Param
						key={pKey}
						name={pKey}
						paramKey={pKey}
						value={params[pKey]}
						ChangeParam={pVal => ChangeParam(pKey, pVal)}
						marR={12}
					/>
				))}
				
			</Row>
		);
	}
}

@observer
class ColumnInfo extends React.Component {
	render() {
		const {
			label,
			info,
			link,
		} = this.props;
		
		if (!info && !link) return <></>;
		
		let tooltip = [label, '', ...info];
		
		if (link) tooltip.push('', link);
		
		const inner = (
			<Tip text={tooltip}>
				<MdInfoOutline size={12}/>
			</Tip>
		);
		
		if (!link) return inner;
		
		return (
			<a href={link}>
				{inner}
			</a>
		);
	}
	
}

@observer
class Param extends React.Component {
	render() {
		const {
			paramKey,
			value,
		} = this.props;
		
		if (is.boolean(value)) return <ParamToggle {...this.props}/>;
		if (is.color(value)) return <ParamColor {...this.props}/>;
		
		if (paramKey === 'label') return (
			<ParamInput
				{...this.props}
				name={undefined}
				valueStyle={{
					b: true,
					size: 16,
				}}
			/>
		);
		
		return <ParamInput {...this.props}/>;
	}
}

@observer
class ParamToggle extends React.Component {
	render() {
		const {
			name,
			value,
			ChangeParam,
		} = this.props;
		
		return (
			<Txt
				hue={'#8a8a8a'}
				strike={!value}
				onClick={() => ChangeParam(!value)}
				{...this.props}
			>{name}</Txt>
		);
	}
}

@observer
class ParamColor extends React.Component {
	render() {
		const {
			name,
			value,
			ChangeParam,
		} = this.props;
		
		return (
			<Tip text={name}>
				<SimField
					value={value}
					onBlur={this.ChangeParam}
					color
					
					{...this.props}
				/>
			</Tip>
		);
	}
}

@observer
class ParamInput extends React.Component {
	
	@observable isEditing = false;
	
	@action ShowEdit = () => this.isEditing = true;
	@action HideEdit = () => this.isEditing = false;
	
	@action ChangeParam = (val) => {
		this.props.ChangeParam(val);
		this.HideEdit();
	};
	
	render() {
		const {
			name,
			value,
			ChangeParam,
			nameHue = '#8a8a8a',
			valueStyle,
		} = this.props;
		
		let nameStr = name;
		if (value) nameStr += ':';
		
		
		if (!this.isEditing) return (
			<Row
				onClick={this.ShowEdit}
				cursor={'crosshair'}
				{...this.props}
			>
				{name && (
					<Txt
						hue={nameHue}
					>{nameStr}</Txt>
				)}
				
				<Txt
					marL={4}
					{...valueStyle}
				>{value}</Txt>
			</Row>
		);
		
		return (
			<SimField
				label={name}
				value={value}
				onEnterKey={this.ChangeParam}
				onBlur={this.ChangeParam}
				focus
				
				{...this.props}
			/>
		);
	}
}