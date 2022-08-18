import {action, observable, runInAction} from 'mobx';

export class Stall {
	@observable isLoading = false;
	@observable key;
	@observable value;
	
	constructor(promise, key, placeholder, then) {
		this.Load(promise, key, placeholder, then).then();
	}
	
	@action Load = async (promise, key, placeholder, then) => {
		this.key = key;
		this.value = placeholder;
		this.isLoading = true;
		
		const value = await promise;
		
		runInAction(() => {
			this.value = value;
			this.isLoading = false;
			if (typeof then === 'function') then(value);
		});
	};
}