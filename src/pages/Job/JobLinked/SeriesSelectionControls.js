import {observer} from 'mobx-react';
import React from 'react';
import {Row} from '../../../Bridge/Bricks/bricksShaper';
import Butt from '../../../Bridge/Bricks/Butt';
import {MdCheckBox, MdCheckBoxOutlineBlank, MdLayersClear, MdSwapHoriz} from 'react-icons/md';
import {LinkedSeriesUpdata} from '../../../datum/LinkedSeriesUpdata';
import type {C_JobView} from '../JobUpdate/JobBasics';
import {Jewels} from '../../../stores/RootStore';

@observer
export class SeriesSelectionControls extends React.Component<C_JobView> {
	render() {
		const jobRef: JobRef = this.props.jobRef;
		const seriesUp: LinkedSeriesUpdata = jobRef.seriesUp;
		const vJobSeries: vJobSeries = Jewels().vJobSeries;
		
		return (
			<Row
				marT={8}
				marB={8}
				shrink
				wrap
				childV
			>
				<Butt
					on={() => vJobSeries.ClearJobSelection(seriesUp)}
					subtle
					mini
					icon={MdLayersClear}
					iconSize={24}
					iconHue={'#666666'}
					tooltip={'Clear Selection'}
				/>
				<Butt
					on={() => vJobSeries.ToggleSelectAllJobs(seriesUp)}
					subtle
					marL={12}
					icon={seriesUp.hasAllJobsSelected ? MdCheckBox : MdCheckBoxOutlineBlank}
					iconSize={28}
					iconHue={'#000'}
					label={`All (${seriesUp.seriesJobCount - 1})`}
					tooltip={'Select all jobs (minus the current job)'}
				/>
				<Butt
					on={() => vJobSeries.SelectDifferentJobs(seriesUp)}
					subtle
					label={`Different (${seriesUp.jobKeysWithDiffs.length})`}
					marL={12}
					tooltip={'Select jobs that are different from current job'}
				/>
				<Butt
					on={() => vJobSeries.SelectSameJobs(seriesUp)}
					subtle
					label={`Same (${seriesUp.jobKeysWithNoDiffs.length})`}
					marL={12}
					tooltip={'Select jobs that are the same as current job'}
				/>
				<Butt
					on={() => vJobSeries.SelectJobsAfterToday(seriesUp)}
					subtle
					label={`After Today (${seriesUp.jobKeysAfterToday.length})`}
					marL={12}
				/>
				<Butt
					on={() => vJobSeries.InvertSelection(seriesUp)}
					subtle
					mini
					marL={12}
					icon={MdSwapHoriz}
					iconSize={24}
					iconHue={'#666666'}
					tooltip={'Invert Selection'}
				/>
			</Row>
		);
	}
}

