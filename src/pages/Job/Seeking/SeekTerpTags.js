import {
	GiBee,
	GiChurch,
	GiGiantSquid,
	GiHummingbird,
	GiMale,
	GiOwl,
	GiSharkFin,
	GiTurtle,
	GiWizardStaff
} from 'react-icons/gi';
import {FaBaby, FaHandScissors, FaSnowflake, FaUserGraduate} from 'react-icons/fa';
import {MdHelp, MdCameraEnhance, MdError} from 'react-icons/md';
import {IconType} from 'react-icons';
import {TerpTagId} from '../../../datum/stache/TerpTagDat';


export function GetTagIcon(tagId: TerpTagId): IconType {
	if (tagId === undefined) return MdError;
	if (tagId === null) return MdError;
	if (tagId <= 0) return MdError;
	
	switch (tagId) {
		case 1:
			return GiSharkFin;
		case 2:
			return GiTurtle;
		case 3:
			return GiOwl;
		case 4:
			return GiChurch;
		case 5:
			return GiBee;
		case 6:
			return GiGiantSquid;
		case 7:
			return FaSnowflake;
		case 8:
			return GiMale;
		case 9:
			return FaBaby;
		case 10:
			return FaHandScissors;
		case 11:
			return MdCameraEnhance;
		case 12:
			return FaUserGraduate;
		case 45:
			return GiHummingbird;
		case 99:
			return GiWizardStaff;
		default:
			return MdHelp;
	}
}

export const TERP_TAGS = {
	shark: 1,
	turtle: 2,
	owl: 3,
	church: 4,
	bee: 5,
	cdi: 6,
	snowflake: 7,
	male: 8,
	mednewbie: 9,
	cued: 10,
	vri: 11,
	intern: 12,
	bird: 45,
	staff: 99,
};