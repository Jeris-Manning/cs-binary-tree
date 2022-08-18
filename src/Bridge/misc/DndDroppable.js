import {observer} from 'mobx-react';
import React from 'react';

@observer
export default class DndDroppable extends React.Component {
	render() {
		const provided = this.props.provided;
		const Comp = this.props.Comp;
		
		const style = {
			height: '100%',
			// backgroundColor: '#fff4e8',
			minHeight: 200,
		};
		
		return (
			<div style={style} {...provided.droppableProps} ref={provided.innerRef}>
				{this.props.data.map((dat, index) => <Comp key={dat.key} data={dat} index={index}/>)}
				{provided.placeholder}
			</div>
		);
	}
}