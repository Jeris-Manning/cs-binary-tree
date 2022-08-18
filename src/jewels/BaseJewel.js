import {AllJewels} from './jewels';
import {RootStore} from '../stores/RootStore';
import {RouterX} from '../Bridge/RouterX/RouterX';
import {AllStaches} from '../staches/staches';

export type JewelKey = string;
export type GemKey = string;

export class BaseJewel {
	
	jewelKey: JewelKey;
	jewels: AllJewels;
	
	root: RootStore;
	router: RouterX;
	staches: AllStaches;
	
}