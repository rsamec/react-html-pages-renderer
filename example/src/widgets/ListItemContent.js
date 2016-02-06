import React from 'react';
import _ from 'lodash';

import styleFont from './utils/font';

let Box = (props) => {

	var style = {};
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;

	var textStyle = styleFont(style, props.font);
	textStyle['position'] = 'relative';
	if (props.counterReset !== undefined) textStyle.counterReset = 'item ' + (props.counterReset - 1);

	return (
		<div style={style}>
			<div className="nestedList" style={textStyle} dangerouslySetInnerHTML={{__html: props.content}}></div>
		</div>
	);
}

Box.defaultProps = {content:'type your content'};
export default Box;
