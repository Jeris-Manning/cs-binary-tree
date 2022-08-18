import {BaseJewel} from './BaseJewel';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {vow} from '../Bridge/misc/$j';

export type T_GetSchema_Params = {
	table: string,
};

export type T_GetAllRows_Params = {
	table: string,
	orderBy: string,
	limit: number,
	offset: number,
};

export type T_GetRow_Params = {
	table: string,
	pk: T_PrimaryKeyInfo,
};

export type T_InsertRow_Params = {
	table: string,
	pk: T_PrimaryKeyInfo, // returns column value of new row (id, etc.)
	row: any,
};

export type T_UpdateRow_Params = {
	table: string,
	pk: T_PrimaryKeyInfo,
	row: any,
};

export type T_DeleteRow_Params = {
	table: string,
	pk: T_PrimaryKeyInfo,
};

export type T_PrimaryKeyInfo = {
	column: string,
	value: number | string,
}

export class oDataEdit extends BaseJewel {
	gems = {
		getSchema: new WiseGem('table'),
		getAllRows: new WiseGem('table'),
		getRow: new WiseGem('pk'),
		insertRow: new WiseGem('row'),
		updateRow: new WiseGem('row'),
		deleteRow: new WiseGem('table'),
	};
	
	
	GetSchema = async (params: T_GetSchema_Params): Promise<any[]> => {
		const promise = this.gems.getSchema.Post(params);
		const [result, error] = await vow(promise);
		if (error) throw new Error(error);
		return result;
	};
	
	GetAllRows = async (params: T_GetAllRows_Params): Promise<any[]> => {
		const promise = this.gems.getAllRows.Post(params);
		const [result, error] = await vow(promise);
		if (error) throw new Error(error);
		return result;
	};
	
	GetRow = async (params: T_GetRow_Params): Promise<any> => {
		const promise = this.gems.getRow.Post(params);
		const [result, error] = await vow(promise);
		if (error) throw new Error(error);
		return result;
	};
	
	
	// returns new pk column val
	InsertRow = async (params: T_InsertRow_Params): Promise<number | string> => {
		const promise = this.gems.insertRow.Post(params);
		const [result, error] = await vow(promise);
		if (error) throw new Error(error);
		return result;
	};
	
	UpdateRow = async (params: T_UpdateRow_Params) => {
		const promise = this.gems.updateRow.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
	
	DeleteRow = async (params: T_DeleteRow_Params) => {
		const promise = this.gems.deleteRow.Post(params);
		const [_, error] = await vow(promise);
		if (error) throw new Error(error);
	};
}

export const DATA_EDIT_OVERVIEW = 'overview';

export type T_DataEditTableEntry = {
	table: string,
	pkColumn: string,
	labelColumn: string,
	description: string,
	columnHelp: {},
	// packer:
}

export const DATA_EDIT_TABLES: T_DataEditTableEntry[] = [
	{
		table: 'credential',
		pkColumn: 'id',
		labelColumn: 'name',
		description: '',
	},
	{
		table: 'demand',
		pkColumn: 'id',
		labelColumn: 'name',
		description: '',
		columnHelp: {
			'creds_required': [
				`Must always have square brackets around entire thing and all inner elements.`,
				`[[1]]  requires cred 1`,
				`[[1,2]]  requires cred 1 AND 2`,
				`[[1], [2]]  requires 1 OR 2`,
				`[[1, 2], [1, 3]]  requires 1&2 OR 1&3`,
			],
		},
		packer: (saveObj) => {
			saveObj.creds_required = JSON.parse(saveObj.creds_required || '[[]]');
		}
	},
];