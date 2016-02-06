import React from 'react';
import _ from 'lodash';

import styleFont from './utils/font';
import styleBorder from './utils/border';
import backgroundStyle from './utils/backgroundStyle';

import HtmlContent from './HtmlContent';

let Box = (props) => {

	var style = {};
	
	//size
	if (!!props.height)  style.height = props.height;
	if (!!props.width) style.width = props.width;
	
	//text style
	var pStyle = {position :'relative'};
	
	var size = props.padding || {};
	pStyle.paddingTop = size.top;
	pStyle.paddingRight = size.right;
	pStyle.paddingBottom = size.bottom;
	pStyle.paddingLeft = size.left;
	
	//background style
	var bgStyle = {width: '100%', height: '100%', position: 'absolute'};
	if (props.background !== undefined) bgStyle = _.extend(bgStyle, backgroundStyle(props.background));

	//border
	styleBorder(bgStyle,props.border);
	
	//clipPath
	if (!!props.clipPath) {
		bgStyle.clipPath = props.clipPath;
		bgStyle.WebkitClipPath = props.clipPath;
	}
	
	return (
		<div style={style}>
			<div style={bgStyle}></div>
			<HtmlContent style={pStyle} content={props.content} font={props.font} />
		</div>)
}
Box.defaultProps = {content: 'type your content'};
export default Box;

