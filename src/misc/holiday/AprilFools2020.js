import React from 'react';
import {observer} from 'mobx-react';
import {Jewels, Staches} from 'stores/RootStore';
import {Img, Row} from '../../Bridge/Bricks/bricksShaper';
import Sound from 'react-sound';
import hamster1 from './hamster1.gif';
import hamster2 from './hamster2.gif';
import hamster3 from './hamster3.gif';
import hamster4 from './hamster4.gif';
import song from './hamster_dance_full.mp3'


@observer
export class AprilFools2020 extends React.Component {
	render() {
		
		
		return (
			
			<Row wrap>
				<Img src={hamster1} w={144} h={48}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster1} w={144} h={48}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster1} w={144} h={48}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster1} w={144} h={48}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster1} w={144} h={48}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster4}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster3}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				<Img src={hamster2}/>
				
				<Sound
					url={song}
					playStatus={Sound.status.PLAYING}
					// onFinishedPlaying={$mapper.StopFinishSound}
				/>
			</Row>
		)
	}
}