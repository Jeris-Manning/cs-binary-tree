import {action, observable} from 'mobx';
import {IconType} from 'react-icons';

export type ReFilterKey = string;

export type ReFilterFnCheck = (any, T_RowDat, ReFilter) => boolean;

export type ReFilterStatus = -1|0|1;
export const Unset: ReFilterStatus = 0;
export const Banned: ReFilterStatus = -1;
export const Required: ReFilterStatus = 1;

export class ReFilter {
	
	@observable key: ReFilterKey;
	@observable accessor: string = '';
	@observable compareWith: any = true;
	@observable fnCheck: ReFilterFnCheck;
	
	@observable status: ReFilterStatus;
	@observable defaultStatus: ReFilterStatus;
	@observable noUnset: boolean;
	@observable noRequired: boolean;
	@observable noBanned: boolean;
	
	@observable label: string;
	@observable icon: IconType|undefined;
	
	
	constructor(config: ReFilter) {
		Object.assign(this, config);
		this.defaultStatus = config.status || config.defaultStatus || Unset;
		this.status = this.defaultStatus;
		if (!this.accessor) this.accessor = this.key;
		if (!this.fnCheck) this.fnCheck = StandardCheck;
	}
	
	@action Cycle = () => this.status = this.GetNext();
	@action Set = (status) => this.status = status;
	@action Reset = () => this.status = this.defaultStatus;
	
	Allowed = (dat: T_RowDat): boolean => {
		switch (this.status) {
			default:
			case Unset:     return true;
			case Required:  return this.fnCheck(dat[this.accessor], dat, this);
			case Banned:    return !this.fnCheck(dat[this.accessor], dat, this);
		}
	}
	
	Forbidden = (dat: T_RowDat): boolean => !this.Allowed(dat);
	
	GetNext = () => {
		switch (this.status) {
			default:
			case Unset:     return this.noRequired ? Banned : Required;
			case Required:  return this.noBanned ? Unset : Banned;
			case Banned:    return this.noUnset ? Required : Unset;
		}
	}
}

const StandardCheck: ReFilterFnCheck = (value, dat: T_RowDat, refilter: ReFilter) => {
	// console.log(`Refilter check ${dat.key}: ${value} (${typeof value}) vs ${refilter.compareWith} (${typeof refilter.compareWith}) = ${value === refilter.compareWith}`);
	return value === refilter.compareWith;
}