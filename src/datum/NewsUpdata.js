import {action, computed, observable} from 'mobx';
import {Upstate} from '../Bridge/misc/Upstate';
import {Updata} from '../Bridge/misc/Updata';
import {UpType} from '../Bridge/misc/UpType';

export class NewsUpdata {
	
	@observable newsId = UpType.String();
	@observable title = UpType.String();
	@observable author = UpType.String();
	@observable postedAt = UpType.Thyme();
	@observable summary = UpType.String();
	@observable markdown = UpType.String();
	@observable adminOnly = UpType.Bool();
	@observable notificationAt = UpType.Thyme();
	
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
	
	constructor(data) {
		this.Construct(data);
	}
	
	@action Construct = (data) => {
		data.newsId = `${data.newsId}`;
		Updata.Init(this, data);
	};
	
	@action Apply = () => this.allStates.forEach(f => f.Apply());
	@action Revert = () => this.allStates.forEach(f => f.Revert());
	
	ToObject = () => {
		const data = Updata.ToObject(this);
		delete data.postedAt;
		return data;
	};
}
