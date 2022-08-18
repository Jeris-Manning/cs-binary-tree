import React, {Component} from 'react';
import {Row, Txt} from '../../Bricks/bricksShaper';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {computed} from 'mobx';
import {Tip} from '../../misc/Tooltip';
import Linker from '../../Nav/Linker';
import {isFunc} from '../../misc/$j';

@observer
export default class Cell_TextStyler_DEP extends React.Component {
	
	@computed get style() {
		const column = this.props.column;
		
		if (!column.style) return {};
		
		if (isFunc(column.style)) {
			return column.style(this.props.value);
		}
		
		return column.style;
	}
	
	@computed get tooltip() {
		if (isFunc(this.props.column.tooltip)) {
			return this.props.column.tooltip(this.props.value);
		}
		return this.props.column.tooltip;
	}
	
	@computed get linkParams() {
		const {linker} = this.props.column;
		if (!linker) return undefined;
		
		if (isFunc(linker.params)) {
			return linker.params(this.props.value, this.props.row);
		}
		return linker.params;
	}
	
	@computed get formatted() {
		if (isFunc(this.props.column.format)) {
			return this.props.column.format(this.props.value);
		}
		return this.props.value;
	}
	
	render() {
		if (this.props.column.linker) {
			return (
				<Linker
					toKey={this.props.column.linker.key}
					params={this.linkParams}
				>
					<Tip text={this.tooltip}>
						<Row fill childCenterV>
							<Txt {...this.style}>{this.formatted}</Txt>
						</Row>
					</Tip>
				</Linker>
			);
		}
		
		return (
			<Tip text={this.tooltip}>
				<Row fill childCenterV>
					<Txt {...this.style}>{this.formatted}</Txt>
				</Row>
			</Tip>
		);
	}
}