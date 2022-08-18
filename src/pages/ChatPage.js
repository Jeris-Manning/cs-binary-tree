import React from 'react';
import {observer} from 'mobx-react';
import {Router, Staches} from 'stores/RootStore';
import {SimCard} from '../Bridge/misc/Card';
import {PaperHeader} from '../Bridge/misc/Paper';
import {FullHistory} from '../components/chat/ChatHistory';


@observer
export class ChatPage extends React.Component {
	render() {
		const params = Router().params;
		const terpId = params.terpId;
		
		if (!terpId || terpId === 'overview') {
			return (
				<SimCard>
					TODO
				</SimCard>
			);
		}
		
		return (
			<>
				<PaperHeader header={`Chat History with ${terpId}`}/>
				
				<SimCard
					maxH={800}
				>
					<FullHistory
						chatClutch={Staches().cTerpChatHistory.GetOrStub(terpId)}
						containerHeight={1000}
					/>
				</SimCard>
				
			</>
		);
	}
}
