// TODO: clean up this abomination

export default class EventPromiser {
	
	shouldWait = () => false;
	waitingToLink = [];
	
	constructor(shouldWait) {
		this.shouldWait = shouldWait;
	}
	
	
	Proceed = () => {
		this.waitingToLink.forEach(deferred => {
			deferred.resolve(true);
		});
		
		this.waitingToLink = [];
	};
	
	Add = () => {
		const deferred = new Deferred();
		this.waitingToLink.push(deferred);
		return deferred.promise;
	};
	
	AddOrResolve = () => {
		// Root().isConnected && Root().isAuthed
		if (this.shouldWait()) {
			return this.Add();
		}
		return Promise.resolve(true);
	};
	
}


export class Deferred {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}
}