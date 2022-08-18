
// MAJOR.MINOR.PATCH
const MAJOR: number = 3;
const MINOR: number = 2;
const PATCH: number = 2;


export const VERSION: VersionInfo = {
	origin: 'starfish',
	major: MAJOR,
	minor: MINOR,
	patch: PATCH,
};


export function GetIfNextVersion(version: VersionInfo): VersionInfo|null {
	if (!version) return null;
	if (version.major > MAJOR) return version;
	if (version.minor > MINOR) return version;
	if (version.patch > PATCH) return version;
	return null;
}

export function VersionToString(version: VersionInfo): string {
	if (!version) return '???';
	return `${version.major}.${version.minor}.${version.patch}`
}

export type VersionInfo = {
	major: number,
	minor: number,
	patch: number,
};



// import thing
// node_modules/**
//  **/node_modules/**