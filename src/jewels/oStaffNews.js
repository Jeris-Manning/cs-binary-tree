import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {vow} from '../Bridge/misc/$j';
import {NewsUpdata} from '../datum/NewsUpdata';
import {BaseJewel} from './BaseJewel';


export class oStaffNews extends BaseJewel {
	
	gems = {
		getNews: new WiseGem(),
		saveNews: new WiseGem(),
		sendNotification: new WiseGem(),
	};
	
	
	GetNews = async () => {
		const [news, error] = await vow(
			this.gems.getNews.Get(),
		);
		
		if (error) throw new Error(error);
		return news.map(n => new NewsUpdata(n));
	};
	
	SaveNews = async (changes) => {
		const [result, error] = await vow(
			this.gems.saveNews.Post(changes),
		);
		
		if (error) throw new Error(error);
		return result;
	};
	
	SendNotification = async (newsId) => {
		const [result, error] = await vow(
			this.gems.sendNotification.Post({
				newsId: newsId,
			}),
		);
		
		if (error) throw new Error(error);
		return result;
	};
}