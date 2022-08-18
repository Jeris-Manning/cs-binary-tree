import React from 'react';
import {observer} from 'mobx-react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Txt} from '../Bricks/bricksShaper';
import $j from '../misc/$j';
import {DragonListState, DragonSource} from './DragonSource';
import styled from 'styled-components';

@observer
export class Dragon extends React.Component {
	render() {
		const {
			source,
			trayTop,
			trayBottom,
		} = this.props;
		
		if (!source)
			throw new Error(`Dragon requires DragonSource`);
		
		return (
			<DragDropContext
				onDragEnd={source.OnDragEnd}
			>
				<DragonDiv>
					
					<Lists
						source={source}
					/>
					
					<Tray
						source={source}
						trayTop={trayTop}
						trayBottom={trayBottom}
					/>
				
				</DragonDiv>
			</DragDropContext>
		);
	}
}

const DragonDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

@observer
class Lists extends React.Component {
	render() {
		const {
			source,
		} = this.props;
		
		return (
			<>
				{source.listsArray.map(list => (
					<List
						key={list.key}
						list={list}
						source={source}
					/>
				))}
			</>
		);
	}
}

type ListTypes = {
	list: DragonListState,
	source: DragonSource,
}

@observer
class List extends React.Component<ListTypes> {
	render() {
		const {
			list,
			source,
		} = this.props;
		
		const TitleComponent = list.def.titleComponent || DefaultTitleComponent;
		
		return (
			<Droppable droppableId={list.key}>
				{(provided, snapshot) => (
					<ListDiv
						{...provided.droppableProps}
						ref={provided.innerRef}
						isDraggingOver={snapshot.isDraggingOver}
						{...LIST_STYLE_DEFAULT}
						{...source.spec.listStyle}
						{...list.def.listStyle}
					>
						
						<TitleComponent list={list}/>
						
						<Items
							list={list}
							source={source}
						/>
						
						<PlaceholderDiv>
							{provided.placeholder}
						</PlaceholderDiv>
					
					</ListDiv>
				)}
			</Droppable>
		);
	}
}

const LIST_STYLE_DEFAULT = {
	hue: '#fff',
	hueOver: '#deedee',
	// w: 150,
	minWidth: 120,
	pad: 4,
	marH: 8,
};

const ListDiv = styled.div`
  background: ${p => p.isDraggingOver ? p.hueOver : p.hue};
  width: ${$j.prop('w')};
  min-width: ${$j.prop('minWidth')};
  padding: ${$j.prop('pad')};
  margin-left: ${$j.prop('marH')};
  margin-right: ${$j.prop('marH')};

  flex: 1 1 auto;
`;

const PlaceholderDiv = styled.div`
  width: 50px;
`;


@observer
class Items extends React.Component {
	render() {
		const {
			list,
			source,
		} = this.props;
		
		return (
			<>
				{[...list.keyToValue.keys()].map((key, index) => (
					<Item
						key={key}
						itemKey={key}
						index={index}
						list={list}
						source={source}
					/>
				))}
			</>
		);
	}
}

@observer
class Item extends React.Component {
	render() {
		const {
			itemKey,
			index,
			list,
			source,
		} = this.props;
		
		const value = list.GetValueFromKey(itemKey);
		const ItemComponent = list.def.itemComponent || DefaultItemComponent;
		
		return (
			<Draggable draggableId={itemKey} index={index}>
				{(provided, snapshot) => (
					<ItemDiv
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						isDragging={snapshot.isDragging}
						{...ITEM_STYLE_DEFAULT}
						{...source.spec.itemStyle}
						{...list.def.itemStyle}
					>
						
						<ItemComponent
							value={value}
							isDragging={snapshot.isDragging}
							list={list}
							source={source}
						/>
					
					</ItemDiv>
				)}
			</Draggable>
		);
	}
}

const ITEM_STYLE_DEFAULT = {
	hue: '',
	hueDrag: '#bed7c8',
	pad: 1,
	marT: 2,
	marB: 2,
};

const ItemDiv = styled.div`
  user-select: none;
  background: ${p => p.isDragging ? p.hueDrag : p.hue};
  margin-top: ${$j.prop('marT')};
  margin-bottom: ${$j.prop('marB')};
  padding: ${$j.prop('pad')};
`;

@observer
class DefaultTitleComponent extends React.Component {
	render() {
		const {
			list,
		} = this.props;
		
		return (
			<Txt
				b
				size={18}
				hue={'#646464'}
				marB={8}
				noSelect
				noHoliday
			>{list.def.label}</Txt>
		);
	}
}

@observer
class DefaultItemComponent extends React.Component {
	render() {
		const {
			value,
		} = this.props;
		
		return (
			<Txt
				size={14}
			>{value}</Txt>
		);
	}
}

@observer
class Tray extends React.Component {
	render() {
		const {
			source,
			trayTop,
			trayBottom,
		} = this.props;
		
		return (
			<TrayDiv>
				
				{trayTop}
				
				<List
					list={source.tray}
					source={source}
				/>
				
				{trayBottom}
			
			</TrayDiv>
		);
	}
}

const TrayDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;