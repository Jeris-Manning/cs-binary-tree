import {action, computed, observable} from 'mobx';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';

export class DeafUpdata {

	@observable deafId = UpType.Int();
	@observable active = UpType.Bool({defaultValue: true});
	@observable firstName = UpType.String();
	@observable lastName = UpType.String();
	@observable dob = UpType.String();

	@observable email = UpType.String();
	@observable phone = UpType.String();
	@observable videoPhone = UpType.String();
	@observable tty = UpType.String();
	@observable pager = UpType.String();

	@observable address = UpType.String();
	@observable address2 = UpType.String();
	@observable city = UpType.String();
	@observable state = UpType.String();
	@observable zip = UpType.String();

	@observable notesForTerp = UpType.String();
	@observable notesDeafProfile = UpType.String();
	@observable notesForStaff = UpType.String();
	@observable pronoun = UpType.String();

	@observable createdOn = UpType.Thyme();
	@observable updatedOn = UpType.Thyme();
	@observable lastUser = UpType.String();

	@observable medicalIds = UpType.Obj();
	@observable companyRecordDefs = UpType.Obj();
	@observable isDb = UpType.Bool();
	@observable isMls = UpType.Bool();
	@observable isLv = UpType.Bool();

	@observable prefs = UpType.Exotic({
		defaultValue: {
			token: 0,
			data: {
				1: [], // general
				2: [], // business
				3: [], // medical
				4: [], // educational
				5: [], // no
			}
		}
	});


	@observable allKeys = [];
	@observable allStates = [];


	@computed get hasChanged() {
		return this.allStates.some(f => f.hasChanged);
	}

	@computed get errors() {
		return this.allStates.filter(f => f.error);
	}

	@computed get isValid() {
		return this.errors.length === 0;
	}

	constructor(deaf, deafClutch) {
		this.Construct(deaf || {}, deafClutch);
	}

	@action Construct = (deaf, deafClutch) => {
		// TODO: check deaf page, is not currently using clutch?
		Updata.Init(this, deaf, {
			useClutch: deafClutch
		});
	};

	@action Apply = () => this.allStates.forEach(f => f.Apply());
	@action Revert = () => this.allStates.forEach(f => f.Revert());


	GetChanges = () => {
		return Updata.GetChanges(this);
	};
}
