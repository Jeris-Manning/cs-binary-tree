import React, {Component} from 'react';
import {observer} from 'mobx-react';
import styled from 'styled-components';
import {ClickAlert, Tip} from '../misc/Tooltip';
import Loading from '../misc/Loading';
import {Col, Row} from './bricksShaper';
import {action, computed, observable, runInAction} from 'mobx';
import $j from '../misc/$j';
import {Root} from '../../stores/RootStore';
import {AprilFools2021_Handler} from '../../misc/holiday/AprilFools2021';

export const ButtonBase = styled.button`
  height: 100%;
  padding: ${p => p.padding ? p.padding : p.mini ? '2px 4px' : '8px 16px'};
  background: ${p => p.subtle ? 'none' : '#bfbfbf'};
  border: none;
  box-shadow: ${p => p.subtle ? 'none' : `
		                0 1px 5px 0 rgba(0,0,0,0.2),
					    0 2px 2px 0 rgba(0,0,0,0.14),
					    0 3px 1px -2px rgba(0,0,0,0.12)`
  };
  border-radius: ${p => p.circle ? '360px' : p.square ? '0px' : '6px'};
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: pointer;
  user-select: none;
  outline: none;

  &:hover {
    background: #949494;
  }

  &:active {
    background: #c6c6c6;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  }
`;

const LabelBase = styled.div`
  font-size: ${p => $j.withPx(p.labelSize, '1.25rem')};
  color: #000000;
  text-transform: ${p => p.textTransform || 'uppercase'};
  font-weight: ${p => p.b ? 'bold' : 'initial'};
`;


const styles = {
	primary: {
		button: styled(ButtonBase)`
          background: ${p => p.subtle ? 'none' : '#01b6d1'};

          &:hover {
            background: #0195ab;
          }

          &:active {
            background: #65c0d1;
          }
		`,
		label: styled(LabelBase)`
		  color: ${p => p.labelHue || (p.subtle ? '#000' : '#fff')};
		`,
	},
	
	secondary: {
		button: styled(ButtonBase)`
          background: ${p => p.subtle ? 'none' : '#86ad00'};

          &:hover {
            background: #6a8c00;
          }

          &:active {
            background: #9bbf41;
          }
		`,
		label: styled(LabelBase)`
		  color: ${p => p.labelHue || (p.subtle ? '#000' : '#fff')};
		`,
	},
	
	danger: {
		button: styled(ButtonBase)`
          background: ${p => p.subtle ? 'none' : '#ff342c'};

          &:hover {
            background: #b41d19;
          }

          &:active {
            background: #ff7967;
          }
		`,
		label: styled(LabelBase)`
		  color: ${p => p.labelHue || (p.subtle ? '#000' : '#fff')};
		`,
	},
	
	disabled: {
		button: styled(ButtonBase)`
          background: ${p => p.subtle ? 'none' : '#8e9b9c'};
          box-shadow: none;
          cursor: default;

          &:hover {
            background: #8e9b9c;
          }

          &:active {
            box-shadow: none;
          }
		`,
		label: styled(LabelBase)`
		  color: ${p => p.labelHue || (p.subtle ? '#000' : '#fff')};
		`,
	},
	
	custom: {
		button: styled(ButtonBase)`
          background: ${p => p.custom.background};

          &:hover {
            background: ${p => p.custom.hover};
          }

          &:active {
            background: ${p => p.custom.active};
          }
		`,
		label: styled(LabelBase)`
          color: ${p => p.labelHue || (p.subtle ? '#000' : '#fff')};
		`,
	},
};

/**
 * on, label, icon
 * primary, secondary, danger
 * disabled, loading
 * mini, subtle
 * tooltip, alert
 * all Bricks styling shortcuts
 */
@observer
export default class Butt extends React.Component {
	
	@computed get isLoading() {
		return this.props.loading
			|| this.isWaitingForPromise
			|| (this.props.loader && this.props.loader.isLoading);
	}
	
	@computed get isEnabled() {
		const props = this.props;
		
		if (props.disabled) return false;
		if (this.isLoading) return false;
		if (props.form && !props.form.isValid) return false;
		return props.hasOwnProperty('enabled')
			? props.enabled
			: true;
	}
	
	getClickHandler = (evt) => {
		if (this.props.onShift && evt.shiftKey) return this.props.onShift;
		if (this.props.onCtrl && evt.ctrlKey) return this.props.onCtrl;
		if (this.props.onAlt && evt.altKey) return this.props.onAlt;
		return this.props.on || (() => ({}));
	};
	
	@observable isWaitingForPromise = false;
	
	@action Click = async (evt) => {
		this.isWaitingForPromise = true;
		await this.getClickHandler(evt)(evt);
		runInAction(() => this.isWaitingForPromise = false);
		if (this.props.afterClick) this.props.afterClick(evt);
	};
	
	@computed get alertText() {
		if (!this.props.alertAfter) return this.props.alert;
		return this.isWaitingForPromise ? this.props.alert : this.props.alertAfter;
	}
	
	@computed get ButtonComponent() {
		const props = this.props;
		if (!this.isEnabled) return styles.disabled.button;
		if (props.primary || props.blue) return styles.primary.button;
		if (props.secondary || props.green) return styles.secondary.button;
		if (props.danger) return styles.danger.button;
		if (props.custom) return styles.custom.button;
		return ButtonBase;
	}
	
	@computed get LabelComponent() {
		const props = this.props;
		if (!this.isEnabled) return styles.disabled.label;
		if (props.primary || props.blue) return styles.primary.label;
		if (props.secondary || props.green) return styles.secondary.label;
		if (props.danger) return styles.danger.label;
		if (props.custom) return styles.custom.label;
		return LabelBase;
	}
	
	@computed get TooltipComponent() {
		const props = this.props;
		if (props.tooltip) return Tip;
		if (props.alert) return ClickAlert;
		return null;
	}
	
	render() {
		const props = this.props;
		
		const ButtonComponent = this.ButtonComponent;
		const LabelComponent = this.LabelComponent;
		const TooltipComponent = this.TooltipComponent;
		const Icon = props.icon;
		
		let label = props.label;
		
		// if (Root().aprilFools && !props.noHoliday) {
		// 	label = AprilFools2021_Handler.Convert(label);
		// }
		
		const innerButton = (
			<ButtonComponent
				onClick={(evt) => this.Click(evt)}
				// disabled={this.isDisabled}
				disabled={!this.isEnabled}
				mini={props.mini}
				subtle={props.subtle}
				circle={props.circle}
				square={props.square}
				custom={props.custom}
				// tabindex={props.hasOwnProperty('tabi') ? props.tabi : -1}
				tabIndex={props.hasOwnProperty('tabi') ? props.tabi : -1}
				padding={props.padding}
			>
				{this.isLoading && !props.hideLoading ? (
					<Loading size={props.loadingSize || 20}/>
				) : (
					<Row childC>
						
						{Icon && (
							<Icon
								size={props.iconSize || 26}
								color={props.iconHue || (props.subtle ? '#000' : '#fff')}
							/>
						)}
						
						{Icon && label && (
							<Col w={12}/>
						)}
						
						{label && (
							<LabelComponent
								subtle={props.subtle}
								labelSize={props.labelSize}
								labelHue={props.labelHue}
								textTransform={props.textTransform}
								b={props.b}
								custom={props.custom}
							>{label}</LabelComponent>
						)}
						
						{props.inner}
					
					</Row>
				)}
			</ButtonComponent>
		);
		
		if (TooltipComponent) return (
			<TooltipComponent
				text={props.tooltip || this.alertText || props.alert}
				// placement={props.tooltipPlacement}
				// offset={props.tooltipOffset}
			>
				<Col
					{...props}
					className={'butt_tooltip'}
				>
					{innerButton}
				</Col>
			</TooltipComponent>
		);
		
		return (
			<Col
				{...props}
				className={'butt'}
				tabindex={-1}
			>
				{innerButton}
			</Col>
		);
	}
}