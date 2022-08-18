import styled from 'styled-components';


function prop(key, or = 'none') {
	return (p) => p[key] || or;
}

export const OuterCol = styled.div`
	display: flex;
	flex-direction: column;
    padding: ${prop('pad', '4px 16px')}
    min-width: 0;
`;

const row = styled.div`
	display: flex;
	flex-direction: row;
    padding: ${prop('pad', '4px 16px')}
    min-width: 0;
`;


export class tdOuter {
	static col = OuterCol;
	static row = row;
}

// export const OuterCol = col;