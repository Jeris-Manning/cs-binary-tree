import {observer} from 'mobx-react';
import React from 'react';
import {computed} from 'mobx';
import {TerpNextJobDat} from '../../datum/stache/TerpNextJobDat';
import type {TerpKey} from '../../datum/stache/TerpDat';
import {Staches} from '../../stores/RootStore';
import thyme from '../../Bridge/thyme';
import {Row, Txt} from '../../Bridge/Bricks/bricksShaper';
import {LinkFragile} from '../../Bridge/Nav/Linker';
import {HoverContainer} from '../../Bridge/misc/HoverContainer';

@observer
export class NextJob extends React.Component {
	
	@computed get terpNextJobDat(): TerpNextJobDat {
		const terpKey: TerpKey = this.props.terpKey;
		return Staches().cTerpNextJob.GetOrStub(terpKey, true).dat;
	}
	
	render() {
		if (!this.terpNextJobDat.jobId) return <></>;
		
		const jobId = this.terpNextJobDat.jobId;
		const start = this.terpNextJobDat.start;
		const end = this.terpNextJobDat.end;
		
		
		const nextJobIsNow = thyme.isBetween(thyme.now(), start, end);
		
		return (
			<Row>
				<LinkFragile toKey={'job'} params={{jobId: jobId, tab: 'details'}}>
					<HoverContainer childS>
						{(hover) => (
							<>
								
								{nextJobIsNow ? (
									<Txt
										b
										size={12}
										hue={hover ? '#6360ff' : '#4d4bb5'}
										u={hover}
									>
										on #{jobId} until {thyme.nice.time.short(end)}
									</Txt>
								) : (
									<Txt
										size={11}
										hue={hover ? '#404099' : '#000'}
										u={hover}
									>
										next
										job: {jobId} {thyme.nice.dateTime.minimal(start)}
									</Txt>
								)}
							</>
						)}
					</HoverContainer>
				</LinkFragile>
			</Row>
		);
	}
}