import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {computed} from 'mobx';
import {SimCard} from '../../Bridge/misc/Card';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {
	MdBusiness,
	MdDoNotDisturb,
	MdFavoriteBorder,
	MdLocalHospital,
	MdSchool
} from 'react-icons/md';
import {Dragon} from '../../Bridge/Dragon/Dragon';
import {Ico} from '../../Bridge/Bricks/Ico';
import {SaveControls} from '../../components/SaveControls';
import {SelectorField} from '../../Bridge/misc/SelectorField';
import {TerpDat} from '../../datum/stache/TerpDat';
import Loading from '../../Bridge/misc/Loading';


@observer
export class DeafPrefEditor extends React.Component {
	render() {
		const vDeaf = Jewels().vDeaf;
		
		return (
			<>
				
				<SimCard header={'Preference of Interpreter'}>
					<Dragon
						source={vDeaf.prefsSource}
						trayBottom={<TerpAdder/>}
					/>
				
				</SimCard>
				
				<Row marH={24} marT={8} childE>
					<SaveControls store={vDeaf}/>
				</Row>
				
				
			</>
		);
	}
}

@observer
class TerpAdder extends React.Component {
	render() {
		const vDeaf = Jewels().vDeaf;
		
		return (
			<SelectorField
				state={{}}
				Change={(terpDat: TerpDat) => vDeaf.AddRecentTerp(terpDat.terpId)}
				choices={Jewels().vTerpLists.activeTerpDats}
				placeholder={'Add Terp'}
				// multiple
				hideOutline
			/>
		);
		
		// return (
		// 	<UpFieldSelect_DEPRECATED
		// 		// state={this.upstate.locationId}
		// 		choices={vDeaf.terpChoices}
		// 		choiceLabelKey={'fullName'}
		// 		sorter={$j.sort.alphabetic('lastName')}
		// 		placeholder={'Add Terp'}
		// 		onChange={vDeaf.AddRecentTerp}
		// 		grow
		// 		size={16}
		// 		marT={12}
		// 	/>
		// )
	}
}

@observer
export class PrefListTitle extends React.Component {
	render() {
		const {
			list,
		} = this.props;
		
		return (
			
			<Row
				childV
				marB={8}
			>
				{list.def.icon && (
					<Ico
						icon={list.def.icon}
						marR={6}
					/>
				)}
				
				<Txt
					size={18}
					// hue={'#646464'}
					noSelect
					smallCaps
					b
				>{list.def.label}</Txt>
			</Row>
		)
	}
}

@observer
export class PrefTerpItem extends React.Component {
	@computed get terpDat(): TerpDat {
		return Staches().cTerp.GetOrStub(this.props.value, true, 'PrefTerpItem').dat;
	}
	
	render() {
		const {
			value,
			isDragging,
		} = this.props;
		
		const terpDat = this.terpDat;
		const name = terpDat.label || `?${value}`;
		
		return (
			<Row>
				<Txt
					size={14}
					noHoliday
				>{name}</Txt>
			</Row>
		)
	}
}

const PREF_TYPES = [
	'general',
	'business',
	'medical',
	'educational',
	'no',
];

export const PREF_TYPES_GOOD = [
	'general',
	'business',
	'medical',
	'educational',
];

const PREF_ICON = {
	no: MdDoNotDisturb,
	general: MdFavoriteBorder,
	business: MdBusiness,
	medical: MdLocalHospital,
	educational: MdSchool,
};

function PrefSorter(terpIdA, terpIdB, prefs, terps) {
	if (terpIdA === terpIdB) return 0;
	const aIsNo = prefs[terpIdA].includes('no');
	const bIsNo = prefs[terpIdB].includes('no');
	
	if (aIsNo && !bIsNo) return +1;
	if (!aIsNo && bIsNo) return -1;
	
	const aName = (terps[terpIdA] || {}).lastName || '';
	const bName = (terps[terpIdB] || {}).lastName || '';
	
	return aName < bName ? -1 : +1;
}

// @observer
// class PrefsOLD extends React.Component {
//
// 	@computed get prefs() {
// 		const deaf = this.props.deaf;
//
// 		let prefs = {};
//
// 		PREF_TYPES.forEach(prefType => {
// 			deaf[prefType].forEach(terpId => {
// 				if (!prefs.hasOwnProperty(terpId)) {
// 					prefs[terpId] = [];
// 				}
// 				prefs[terpId].push(prefType);
// 			});
// 		});
//
// 		return prefs;
// 	}
//
// 	render() {
// 		const {
// 			deaf
// 		} = this.props;
// 		const oSeek = Jewels().seek;
//
// 		return (
// 			<>
// 				{Object.keys(this.prefs)
// 					.sort((a, b) => PrefSorter(a, b, this.prefs, oSeek.allTerps))
// 					.map((terpId, dex) => (
// 						<PrefRowOLD
// 							key={`${terpId}_prefRow_${dex}`}
// 							prefTypes={this.prefs[terpId]}
// 							terp={oSeek.allTerps[terpId]}
// 							isPickable={!!oSeek.validTerpLookup[terpId]}
// 							onSelect={oSeek.AddSelect}
// 						/>
// 					))}
// 			</>
// 		);
// 	}
// }
//
// @observer
// class PrefRowOLD extends React.Component {
//
// 	render() {
// 		const {
// 			terp,
// 			prefTypes,
// 			isPickable,
// 			onSelect,
// 		} = this.props;
//
// 		if (!terp) return <Row/>;
//
// 		const containsNo = prefTypes.includes('no');
//
// 		const hue = containsNo
// 			? HUE.labelRed
// 			: isPickable ? '#33843d' : '#464646';
//
// 		return (
// 			<Row
// 				marB={3}
// 				childCenterV
// 				onClick={isPickable && !containsNo ? () => onSelect(terp) : undefined}
// 			>
// 				{containsNo && <PrefIconOLD prefType={'no'} hue={hue}/>}
//
// 				<Tip text={isPickable ? undefined : (
// 					<WhyNotTooltip
// 						terpId={terp.terpId}
// 						label={`${terp.firstName} ${terp.lastName}`}
// 					/>
// 				)}>
// 					<Txt
// 						marH={6}
// 						padB={2}
// 						b={isPickable}
// 						i={containsNo}
// 						hue={hue}
// 						size={'0.8rem'}
// 					>{terp.firstName} {terp.lastName}</Txt>
// 				</Tip>
//
// 				{prefTypes.map((prefType, dex) => (
// 					<PrefIconOLD key={`${terp.terpId}_${prefType}_${dex}`} prefType={prefType} hue={hue}/>
// 				))}
// 			</Row>
// 		);
// 	}
// }
//
// @observer
// class PrefIconOLD extends React.Component {
// 	render() {
// 		const {
// 			prefType,
// 			hue,
// 		} = this.props;
//
// 		const Icon = PREF_ICON[prefType];
//
// 		return (
// 			<Icon color={hue} size={'0.8rem'}/>
// 		);
// 	}
// }