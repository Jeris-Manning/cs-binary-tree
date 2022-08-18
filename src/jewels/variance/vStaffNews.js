import {Jewels, LocalStaff, Root} from '../../stores/RootStore';
import {NewsUpdata} from '../../datum/NewsUpdata';
import {action, computed, observable, runInAction} from 'mobx';
import thyme from '../../Bridge/thyme';
import {BaseJewel} from '../BaseJewel';

export type NewsId = string;

export class vStaffNews extends BaseJewel {
	
	_GetNews: NewsUpdata[] = async () => Jewels().oStaffNews.GetNews();
	_SaveNews = async (newsObj) => Jewels().oStaffNews.SaveNews(newsObj);
	_SendNotification = async (newsId) => Jewels().oStaffNews.SendNotification(newsId);
	
	
	@observable newsLup: Map<NewsId, NewsUpdata> = new Map();
	@observable isEditing = false;
	@observable editData: NewsUpdata = new NewsUpdata({});
	@observable previewData: NewsUpdata;
	@observable selectedNewsId: NewsId = '';
	
	
	@action EnterPage = () => this.LoadNews();
	
	@action LoadNews = async (selectNewsId: NewsId) => {
		this.newsLup.clear();
		this.isEditing = false;
		this.editData = {};
		this.previewData = {};
		this.selectedNewsId = '';
		
		const news =
			await this._GetNews();
		
		runInAction(() => {
			for (const data : NewsUpdata of news) {
				this.newsLup.set(data.newsId.value, data);
			}
			
			if (selectNewsId) this.SelectNews(selectNewsId);
		});
		
	};
	
	@action SelectNews = (newsId: NewsId) => {
		const data : NewsUpdata = this.newsLup.get(newsId);
		
		if (!data) {
			console.warn(`SelectNews: missing newsId: ${newsId}`);
			return;
		}
		
		this.previewData = data;
		this.selectedNewsId = data.newsId.value;
	}
	
	@action EditNews = async (newsId: NewsId) => {
		let data = this.newsLup.get(newsId);
		
		if (!data) {
			data = new NewsUpdata({
				newsId: 'NEW',
				author: LocalStaff().externalName,
				title: 'Enter Title',
				markdown: 'Write here!',
				postedAt: thyme.now(),
				adminOnly: true,
			});
		}
		
		this.editData = data;
		this.previewData = data;
		this.isEditing = true;
	};
	
	
	@computed get canSave() {
		if (!this.editData) return false;
		if (!this.editData.hasChanged) return false;
		if (!this.editData.title.value) return false;
		if (!this.editData.author.value) return false;
		if (!this.editData.postedAt.value) return false;
		if (!this.editData.summary.value) return false;
		if (!this.editData.markdown.value) return false;
		return true;
	}
	
	@action SaveNews = async () => {
		const newsObj = this.editData.ToObject();
		
		const result =
			await this._SaveNews(newsObj);
		
		console.log(`SaveNews result: `, result);
		
		return this.LoadNews(result.newsId);
	};
	
	@action CancelEdit = async () => this.LoadNews();
	
	@action SendNotification = async () => {
		const newsId = this.selectedNewsId;
		
		await this._SendNotification(newsId);
		
		return this.LoadNews(newsId);
	}
}