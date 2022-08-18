import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Root, Staches} from 'stores/RootStore';
import GoogleMapReact from 'google-map-react';

@observer
export class Goomap extends React.Component {
	render() {
		const {
			lat,
			lng,
			zoom,
			children, // needs lat & lng
		} = this.props;
		
		return (
			<GoogleMapReact
				bootstrapURLKeys={{key: Root().mapKey}}
				defaultCenter={{
					lat: 44.998495,
					lng: -93.353776,
				}}
				defaultZoom={10}
				
				center={{
					lat: typeof lat === 'number' ? lat : parseFloat(lat),
					lng: typeof lng === 'number' ? lng : parseFloat(lng),
				}}
				
				zoom={zoom}
			>
				{children}
			</GoogleMapReact>
		)
	}
}

@observer
export class SearchBox extends React.Component {
	
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();
	}
	
	event;
	autoComplete;
	
	componentDidMount() {
		
		const biasBounds = new window.google.maps.Circle({
			center: {
				lat: this.props.biasLat || 44.977288,
				lng: this.props.biasLng || -93.265449,
			},
			radius: this.props.biasRadius || 10000,
		}).getBounds();
		
		const options = {
			bounds: biasBounds,
			location: biasBounds.center,
			radius: this.props.biasRadius,
		};
		
		
		this.autocomplete = new window.google.maps.places.Autocomplete(this.inputRef.current, options);
		this.autocomplete.setFields([
			'formatted_address',
			'address_components',
			'place_id',
			'geometry',
		]);
		this.event = this.autocomplete.addListener('place_changed', this.onSelected);
		
		
		this.inputRef.current.value = this.props.defaultValue || '';
		this.inputRef.current.focus();
	}
	
	componentWillUnmount() {
		this.event.remove();
	}
	
	onSelected = () => {
		const place = this.autocomplete.getPlace();
		if (place.formatted_address) {
			this.props.onSelected(place);
		} else {
			this.props.onSelected({
				formatted_address: this.inputRef.value
			});
		}
	};
	
	render() {
		const {
			id,
		} = this.props;
		
		return (
			<input
				id={id}
				ref={this.inputRef}
				style={{
					height: 40,
					padding: 16,
					backgroundColor: '#f7f8fb',
					borderStyle: 'solid',
					borderWidth: 1,
					borderColor: '#c6c9cb',
					fontSize: 18,
					fontWeight: 'bold',
					boxSizing: 'border-box',
				}}
			/>
		);
	}
}