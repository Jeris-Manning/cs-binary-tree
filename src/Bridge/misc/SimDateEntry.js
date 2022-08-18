import {observer} from 'mobx-react';
import React from 'react';
import {action, observable} from 'mobx';
import Formula from '../Bricks/Formula/Formula';
import Fieldula from '../Bricks/Formula/Fieldula';
import thyme from '../thyme';
import MiniField from '../../components/MiniField';
import {Txt} from '../Bricks/bricksShaper';
import {is} from './$j';

// TODO: remake this, it's getting old af

@observer
export class SimDateEntry extends React.Component {
	
	@observable form = new Formula({
		fields: {
			dateInput: new Fieldula({
				placeholder: '', // '2-09 or 11/14 or 2 22 2022',
				// description: `This field is good at parsing dates. <br/>You can do things like: <br/>2-09 <br/>2/9 <br/>1211 <br/>121121 <br/>2 22 2022`
			}),
		}
	});
	@observable error = '';
	@observable info = '';
	
	componentDidMount() {
		this.RefreshDisplay();
	}
	
	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		this.RefreshDisplay();
	}
	
	@action RefreshDisplay = () => {
		if (this.props.value) {
			this.form.fields.dateInput.value = thyme.nice.date.short(this.props.value);
			this.info = thyme.nice.date.details(this.props.value);
		} else {
			this.form.fields.dateInput.value = '';
			this.info = '';
		}
	};
	
	@action Calculate = () => {
		const raw = this.form.fields.dateInput.value;
		const yearMonthDayObj = thyme.parseDateString(raw);
		
		console.log(`Calculating date entry: `, yearMonthDayObj);
		
		if (!yearMonthDayObj) {
			this.error = 'Invalid date.';
			return;
		}
		
		if (is.string(yearMonthDayObj)) {
			this.error = yearMonthDayObj;
			return;
		}
		
		this.error = '';
		this.props.onChange(thyme.fromObject(yearMonthDayObj));
	};
	
	render() {
		const {
			value,
			onChange,
			label,
			tabIndex,
			size,
			w,
			pad,
			infoSize,
		} = this.props;
		
		return (
			<MiniField
				$={this.form.fields.dateInput}
				label={label}
				tabIndex={tabIndex}
				onBlur={this.Calculate}
				size={size || 32}
				h={'auto'}
				w={w || 300}
				// width={'100%'}
				padding={pad ? `${pad}px` : `16px`}
				selectOnFocus
				center
				error={this.error}
				infoComponent={<Txt center i marT={2} size={infoSize}>{this.info}</Txt>}
			/>
		);
	}
}