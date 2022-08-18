import {action, observable} from 'mobx';
import GetGem_DEPRECATED from '../../Bridge/jewelerClient/GetGem_DEPRECATED';
import thyme from '../../Bridge/thyme';


export class oMiscQueryReports {
	gems = {
		query1: new GetGem_DEPRECATED(),
	};
	
	@observable summary = '';
	@observable columns = [];
	@observable rows = [];
	@observable chartData = {};
	
	@action Load1 = async (start, end) => {
		const columns = [
			{
				header: '',
				accessor: 'name',
			},
			{
				header: 'Cancelled',
				accessor: 'cancel',
			},
			{
				header: 'Not Cxl',
				accessor: 'notCancel',
			},
			{
				header: 'Count',
				accessor: 'count',
			}
		];
		
		const results =
			await this.gems.query1.Request({
				rangeStart: thyme.fast.pack(start),
				rangeEnd: thyme.fast.pack(end),
			});
		
		
		let byDate = {};
		let fullCount = 0;
		let cancelCount = 0;
		let notCancelCount = 0;
		
		results
			.filter(row => {
				if (thyme.isWeekend(row.start)) return false;
				// if (thyme.isWeekend(row.entry)) return false;
				// if (this.WasCancelled(row)) return false;
				if (!row.billType) return false;
				if (!row.start) return false;
				return true;
			})
			.forEach(row => {
				const key = thyme.toDateMs(row.start);
				
				const wasCancelled = this.WasCancelled(row);
				
				if (!byDate.hasOwnProperty(key)) {
					byDate[key] = {
						date: thyme.toDateStart(row.start),
						name: thyme.nice.date.short(thyme.toDateStart(row.start)),
						count: 0,
						cancel: 0,
						notCancel: 0,
					};
				}
				
				byDate[key].count += 1;
				fullCount += 1;
				
				if (wasCancelled) {
					byDate[key].cancel += 1;
					cancelCount += 1;
				} else {
					byDate[key].notCancel += 1;
					notCancelCount += 1;
				}
				
			});
		
		const rows = Object.values(byDate).sort(thyme.sorter('date')).reverse();
		
		const allData = rows.map(row => ({
			x: thyme.toJsDate(row.date),
			y: row.count,
			label: `${row.name}: ${row.count} (${row.cancel} - ${row.notCancel})`,
		}));
		
		const cancelData = rows.map(row => ({
			x: thyme.toJsDate(row.date),
			y: row.cancel,
			label: `${row.name} cancelled: ${row.cancel}`,
		}));
		
		const notCancelData = rows.map(row => ({
			x: thyme.toJsDate(row.date),
			y: row.notCancel,
			label: `${row.name} not cancel: ${row.notCancel}`,
		}));
		
		const extraData = [
			{
				x: thyme.toJsDate(thyme.today()),
				y: 0
			},
			{
				x: thyme.toJsDate(thyme.today()),
				y: 1000
			},
		];
		
		
		const chartData = {
			line1: allData,
			line2: cancelData,
			line3: notCancelData,
			scatter: notCancelData,
			extra: extraData,
		};
		
		const summary = `rows: ${rows.length}, total jobs: ${fullCount}, cancelled - not: ${cancelCount} - ${notCancelCount}`;
		
		this.Set(summary, columns, rows, chartData);
	};
	
	@action Set = (summary, columns, rows, chartData) => {
		this.summary = summary;
		this.columns = columns;
		this.rows = rows;
		this.chartData = chartData;
	};
	
	
	WasCancelled = (row) => {
		if (row.isCancelled) return true;
		if (row.billType.toLowerCase().includes('cancel')) return true;
		return false;
	};
}