import React from 'react';
import _ from 'lodash';

import styleFont from './utils/font';

let HtmlBox = (props) => {
	
	var style = props.style || {};
	
	styleFont(style, props.font);
	
	//size
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;
	
	return (
		<div style={style} dangerouslySetInnerHTML={{__html: props.content}}>
		</div>
	);
}

HtmlBox.defaultProps = {content:'type your content'};
export default HtmlBox;
