import React from 'react';
import _ from 'lodash';

import styleFont from './utils/font';

let Box = (props) => {

	var style = {};
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;

	var textStyle = {position:'relative'};
	styleFont(textStyle, props.font);

	if (props.columnCount !== undefined) textStyle.WebkitColumnCount = props.columnCount;

	return (
		<article style={style}>
			<div style={textStyle} dangerouslySetInnerHTML={{__html: props.content}}></div>
		</article>
	);
}

Box.defaultProps = {content:'type your content'};
export default Box;
