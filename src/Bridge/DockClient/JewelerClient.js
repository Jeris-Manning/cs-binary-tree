import {action, observable} from 'mobx';
import thyme from '../thyme';

const PING_ROLLING_DIVIDER = 100;

export class JewelerClient {
	
	// TODO: cleanup, types (see StacherClient)
	
	ToLog = (msg) => `💎 JewelerClient ${msg}`;
	
	/* DockClient messaging */
	SendWorkerRequest = async (content) => ({}); // injected by DockClient
	SendWorkerNotice = async (content) => ({}); // injected by DockClient
	ReceiveWorkerNotice = (content) => this._HandleWorkerNotice(content);
	
	
	@observable jewels = {};
	@observable ping = 100;
	@observable requestCount = 0;
	
	@action Initialize = (config) => {
		const jewelsArray = Object.keys(config.jewels);
		
		console.log(`💎  initializing ${jewelsArray.length} jewels`);
		
		// Initialize Jewels + Gems
		jewelsArray.forEach(jewelKey => {
			const jewel = config.jewels[jewelKey];
			jewel.jewelKey = jewelKey;
			this.jewels[jewelKey] = jewel;
			
			if (config.injections) Object.assign(jewel, config.injections);
			jewel.jewels = config.jewels;
			
			Object.keys(jewel.gems || {})
				.forEach(gemKey => {
					// console.log(`💎  init gem ${gemKey} of ${jewelKey}`);
					// TODO: cleanup gem classes
					const gem = jewel.gems[gemKey];
					gem.jewelKey = jewelKey;
					gem.gemKey = gemKey;
					gem.Send.Request = (params) => this.Send_Request(jewelKey, gemKey, params);
					gem.Send.Notice = (payload) => this.Send_Notice(jewelKey, gemKey, payload);
				});
		});
	};
	
	
	@action Send_Request = async (jewel, gem, params) => {
		const startMs = thyme.nowMs();
		this.requestCount += 1;
		
		const result = await this.SendWorkerRequest({
			jewel: jewel,
			gem: gem,
			params: params,
		});
		
		this.ping = Math.round((
			(thyme.nowMs() - startMs - this.ping) / PING_ROLLING_DIVIDER
		) + this.ping);
		this.requestCount -= 1;
		
		return result;
	};
	
	@action Send_Notice = async (jewel, gem, payload) => {
		return this.SendWorkerNotice({
			jewel: jewel,
			gem: gem,
			payload: payload,
		});
	};
	
	
	@action _HandleWorkerNotice = (content) => {
		const gem = this.GetGem_DEPRECATED(content.jewel, content.gem);
		if (gem) gem.Receive.Notice(content.payload);
	};
	
	
	Has = (jewel, gem) => (this.jewels.hasOwnProperty(jewel)
		&& this.jewels[jewel].gems.hasOwnProperty(gem));
	
	GetGem_DEPRECATED = (jewel, gem) => {
		if (!this.Has(jewel, gem)) {
			console.log(`MISSING gem: ${jewel}.${gem}`);
			return null;
			// throw new Error(`MISSING gem: ${jewel}.${gem}`);
		}
		return this.jewels[jewel].gems[gem];
	};
	
}