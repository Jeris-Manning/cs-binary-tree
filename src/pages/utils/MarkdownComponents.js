import {observer} from 'mobx-react';
import React from 'react';
import {Col} from '../../Bridge/Bricks/bricksShaper';
import MDEditor from '@uiw/react-md-editor';
import {MDEditorProps} from '@uiw/react-md-editor';


@observer
export class MarkdownEditor extends React.Component<MDEditorProps> {
	render() {
		return (
			<MDEditor
				{...this.props}
			/>
		)
	}
}

type MarkdownPreviewType = {
	source: string,
}

@observer
export class MarkdownPreview extends React.Component<MarkdownPreviewType> {
	render() {
		return (
			<MDEditor.Markdown
				{...this.props}
			/>
		)
	}
}