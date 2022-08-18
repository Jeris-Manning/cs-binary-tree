import {action, computed, observable, runInAction} from 'mobx';
import {Loader} from '../../Bridge/misc/Loader';
import {vow} from '../../Bridge/misc/$j';
import {Jewels, Staches} from '../../stores/RootStore';
import thyme from '../../Bridge/thyme';
import {DeafUpdata} from '../../datum/DeafUpdata';
import {DragonSource} from '../../Bridge/Dragon/DragonSource';
import {DragonSpec} from '../../Bridge/Dragon/DragonSpec';
import {PrefListTitle, PrefTerpItem} from '../../pages/Deaf/DeafPrefEditor';
import {HUE} from '../../Bridge/HUE';
import {
	MdBusiness,
	MdDoNotDisturb,
	MdFavoriteBorder,
	MdLocalHospital, MdSchool,
} from 'react-icons/md';
import {BaseJewel} from '../BaseJewel';

export class vDeaf extends BaseJewel {
	
	_GetDeaf = (deafId) => Jewels().oDeaf.GetDeaf(deafId);
	_SaveDeaf = (deafId, changes) => Jewels().oDeaf.SaveDeaf(deafId, changes);
	_GetRecentTerps = (deafId) => Jewels().oDeaf.GetRecentTerps(deafId);
	
	@observable deafId = 0;
	@observable loader = new Loader();
	@observable error = '';
	@observable saveError = '';
	@observable updata = new DeafUpdata({});
	
	@action Load = async (deafId) => {
		if (deafId === 'overview') return;
		
		this.loader.Start();
		this.deafId = deafId;
		this.error = '';
		
		const [deaf, error] = await vow(
			this._GetDeaf(deafId)
		);
		
		runInAction(() => {
			if (error) {
				this.error = `${error}`;
				this.loader.Error(error);
				return;
			}
			
			this.updata = new DeafUpdata(deaf);
		});
		
		await this.LoadPrefs();
		
		this.loader.Done();
	};
	
	@computed get canSave() {
		if (!this.updata.deafId.value) return false;
		if (this.loader.isLoading) return false;
		return this.updata.hasChanged;
	}
	
	@computed get saveTooltip() {
		if (this.canSave) return 'Save (Ctrl+S)';
		return 'No changes';
	}
	
	@action Save = async () => {
		console.log(`trying Save`);
		
		if (!this.canSave) return;
		
		this.loader.Start();
		this.saveError = '';
		
		const changes = this.updata.GetChanges();
		
		const [_, error] = await vow(
			this._SaveDeaf(this.deafId, changes),
		);
		
		if (error) {
			this.saveError = `${error}`;
			this.loader.Error(error);
			return;
		}
		
		this.updata.updatedOn.Change(thyme.now());
		this.updata.lastUser.Change('you');
		
		this.updata.Apply();
		
		this.loader.Done();
	};
	
	@action Revert = () => this.updata.Revert();
	
	
	/* Prefs */
	
	@observable prefsSpec = new DragonSpec(DRAGON_SPEC_CONFIG);
	@observable prefsSource;
	@observable recentTerps = []; // terpId[]
	
	
	@action LoadPrefs = async () => {
		this.recentTerps = [];
		this.prefsSource = new DragonSource(this.prefsSpec, this.updata.prefs);
		
		const [recent, error] = await vow(
			this._GetRecentTerps(this.deafId)
		);
		
		runInAction(() => {
			this.recentTerps = recent || [];
			this.recentTerps.forEach(this.AddRecentTerp);
		});
	};
	
	@action AddRecentTerp = (terpId) => this.prefsSource.AddToTray(terpId);
	
	// @computed get terpChoices() {
	// 	return Staches().terps.asObject;
	// }
}

const DRAGON_SPEC_CONFIG = {
	lists: {
		1: {label: 'General', icon: MdFavoriteBorder,},
		2: {label: 'Business', icon: MdBusiness,},
		3: {label: 'Medical', icon: MdLocalHospital,},
		4: {label: 'Educational', icon: MdSchool,},
		5: {
			label: 'No Thanks',
			icon: MdDoNotDisturb,
			listStyle: {
				hue: '#ecc1c5',
				hueOver: HUE.labelRed,
			},
			// itemStyle: {
			// 	hue: HUE.labelLightRed,
			// 	hueDrag: HUE.greyLight,
			// },
		},
	},
	titleComponent: PrefListTitle,
	itemComponent: PrefTerpItem,
	listStyle: {
		// hue: '#fff',
		// hue: '#c9eebe',
		hueOver: HUE.greyBlue,
		// w: 150,
		minWidth: 120,
	},
	itemStyle: {
		hue: '',
		hueDrag: HUE.greyLight,
	},
	tray: {
		label: 'Terp List',
		listStyle: {
			hue: '#f3f2f2',
			hueOver: HUE.greyBlue,
		},
	},
};