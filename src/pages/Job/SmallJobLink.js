import {observer} from 'mobx-react';
import React from 'react';
import {Col, Row, Span, Txt} from '../../Bridge/Bricks/bricksShaper';
import ButtLink from '../../components/ButtLink';
import {MdCancel, MdSearch} from 'react-icons/md';
import {Ico} from '../../Bridge/Bricks/Ico';

@observer
export class SmallJobLink extends React.Component {
	render() {
		const jobId = `${this.props.jobId}`;
		
		return (
			<Col {...this.props}>
				<Row childV>
					<Txt>
						<Span size={16} marR={3}>{jobId.slice(0, 3)}</Span>
						<Span size={16}>{jobId.slice(3)}</Span>
					</Txt>
					
					{this.props.isCancelled && (
						<Ico
							icon={MdCancel}
							hue={'#dc4f4f'}
							iconSize={14}
							marL={2}
							tooltip={'Job is cancelled'}
						/>
					)}
					
					<ButtLink
						icon={MdSearch}
						iconSize={14}
						iconHue={'#7c7c7c'}
						toKey={'job'}
						mini
						subtle
						params={{
							jobId: jobId,
							tab: 'linked',
						}}
						marT={2}
						marL={2}
						tooltip={`Go to job ${jobId}`}
					/>
				</Row>
			</Col>
		);
	}
}