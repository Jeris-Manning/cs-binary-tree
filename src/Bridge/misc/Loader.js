import {action, observable, runInAction} from 'mobx';
import {$m} from './$m';
import {Timer} from '../thyme';


export class Loader {
	promise;
	__resolve;
	__reject;
	
	@observable isLoading = false;
	
	@action Start = () => {
		this.isLoading = true;
		
		this.promise = new Promise((resolve, reject) => {
			this.__resolve = resolve;
			this.__reject = reject;
		});
	};
	
	@action Stop = () => {
		this.__resolve();
		this.isLoading = false;
	};
	
	@action Error = (error) => {
		// TODO: this isn't right
		console.error(error);
		this.__reject();
		this.isLoading = false;
	};
	
	@action Load = this.Start;
	@action Done = this.Stop;
}


export class ProgressiveLoader {
	
	@observable isLoading = false;
	@observable hasLoaded = false;
	@observable step = 0;
	@observable numberOfSteps = 0;
	@observable percent = 1;
	@observable percent100 = 100;
	@observable stageName = '';
	timer;
	
	@action Load = (numberOfSteps, stageName = '') => {
		this.isLoading = true;
		this.hasLoaded = false;
		this.step = 0;
		this.numberOfSteps = numberOfSteps;
		this.percent = 0;
		this.percent100 = 0;
		this.stageName = stageName;
		this.timer = new Timer(stageName || 'start');
	};
	
	@action Next = (stageName = '') => {
		this.step += 1;
		this.percent = this.step / this.numberOfSteps;
		this.percent100 = $m.percent100(this.percent);
		this.stageName = stageName;
		this.timer.mark(stageName || this.step);
	};
	
	@action Done = (stageName = '') => {
		this.percent = 1;
		this.percent100 = 100;
		this.stageName = stageName;
		this.isLoading = false;
		this.hasLoaded = true;
		this.timer.mark(stageName || 'done');
		this.timer.print(`Progressive Loader (${this.numberOfSteps}):`);
	};
}

export class ParallelLoader {
	@observable isLoading = false;
	@observable hasLoaded = false;
	@observable percent = 1;
	@observable percent100 = 100;
	
	@observable state: Map<string, boolean> = new Map();
	@observable results = {};
	@observable loadingCount = 0;
	@observable loadedCount = 0;
	@observable totalCount = 0;
	
	@action Load = async (promiseObj) => {
		const promKeys = Object.keys(promiseObj);
		
		this.isLoading = true;
		this.hasLoaded = false;
		this.state.clear();
		this.results = {};
		this.loadingCount = promKeys.length;
		this.loadedCount = 0;
		this.totalCount = this.loadingCount;
		
		const promises = promKeys.map(async (key) => {
			this.state.set(key, true);
			this.results[key] = null;
			
			const promResult = await promiseObj[key];
			
			runInAction(() => {
				this.state.set(key, false);
				this.results[key] = promResult;
				this.loadingCount -= 1;
				this.percent = this.loadingCount / this.totalCount;
				this.percent100 = $m.percent100(this.percent);
			});
			
			return promResult;
		});
		
		let error;
		
		await Promise.all(promises)
			.catch(err => error = err);
		
		runInAction(() => {
			this.isLoading = false;
			this.hasLoaded = true;
		});
		
		return error
			? [{}, error]
			: [this.results, error];
	};
}