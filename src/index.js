import React from 'react';
import ReactDOM from 'react-dom';
import {RootStore} from './stores/RootStore';
import {Provider} from 'mobx-react';
import ReactModal from 'react-modal';
import AppLayout from './pages/structure/AppLayout';
import 'normalize.css';
import './lib/fonts.css';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
// import LuxonUtils from '@date-io/luxon';
import {RootHokeyInitializer} from './Bridge/Hokey';
import {HOTKEY_MAP} from './misc/Hotkeys';

import locale from 'date-fns/locale/en-US';

ReactModal.setAppElement('#root');

const root = new RootStore();

ReactDOM.render((
	<Provider root={root}>
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
			<RootHokeyInitializer keyMap={HOTKEY_MAP}/>
			<AppLayout/>
		</MuiPickersUtilsProvider>
	</Provider>
), document.getElementById('root'));


function unregister() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister();
		});
	}
}

unregister();
// registerServiceWorker();