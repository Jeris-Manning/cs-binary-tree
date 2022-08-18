import PostGem_DEPRECATED from '../Bridge/jewelerClient/PostGem_DEPRECATED';
import {action} from 'mobx';
import {WiseGem} from '../Bridge/jewelerClient/WiseGem';
import {BaseJewel} from './BaseJewel';

export default class oFileUpload extends BaseJewel {
	
	gems = {
		upload: new PostGem_DEPRECATED({}),
		staffPhoto: new PostGem_DEPRECATED({}),
		uploadMisc: new PostGem_DEPRECATED({}),
		uploadCompanyFile: new PostGem_DEPRECATED({}),
	};
	
	@action Upload = (params) => {
		return this.gems.upload.Post(params);
	};
	
	
	@action UploadStaffPhoto = (params) => {
		return this.gems.staffPhoto.Post(params);
	};
	
	@action UploadMisc = (params) => {
		return this.gems.uploadMisc.Post(params);
	};
	
	@action UploadCompanyFile = (file, fileName, companyId) => {
		return this.gems.uploadCompanyFile.Post({
			file: file,
			fileName: fileName,
			companyId: companyId,
		});
	};
	
}