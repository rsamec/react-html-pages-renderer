import React from 'react';
import _ from 'lodash';

import styleFont from './utils/font';
import backgroundStyle from './utils/backgroundStyle';


let HtmlImagePanel = (props) => {

	var style = {};
	
	//size
	if (!!props.height)  style.height = props.height;
	if (!!props.width) style.width = props.width;
	if (!!props.minWidth) style.minWidth = props.minWidth;
	if (!!props.minHeight) style.minHeight = props.minHeight;

	
	//text style
	var pStyle = styleFont(props.font);
	pStyle.position = 'relative';
	//padding
	var size = props.padding || {};
	pStyle.paddingTop = size.top;
	pStyle.paddingRight = size.right;
	pStyle.paddingBottom = size.bottom;
	pStyle.paddingLeft = size.left;
	

	//background style
	var bgStyle = {width: '100%', height: '100%', position: 'absolute'};
	if (props.background !== undefined) bgStyle = _.extend(bgStyle, backgroundStyle(props.background));

	//border
	var border = props.border || {};
	bgStyle.borderWidth = border.width;
	bgStyle.borderRadius = border.radius;
	bgStyle.borderColor = border.color && border.color.color;
	bgStyle.borderStyle = border.style || 'solid';
    
	

	//clipPath

	if (!!props.clipPath) {
		bgStyle.clipPath = props.clipPath;
		bgStyle.WebkitClipPath = props.clipPath;
		//pStyle.clipPath = props.clipPath;
		//pStyle.WebkitClipPath = props.clipPath;
	}
	
	var float = props.imageAlign === "topRight" || props.imageAlign === "bottomRight" ? "right" : "left";
	var bottom = props.imageAlign === "bottomLeft" || props.imageAlign === "bottomRight" ? true : false;

	var image = props.image || {};

	var imgStyle = {float: float, clear: float, position: 'relative'};
	if (!!!image.width && !!!image.height) {
		imgStyle.height = '50%'
	}
	;

	if (!!image.width) imgStyle.width = image.width;
	if (!!image.height) imgStyle.height = image.height;
	if (!!image.minWidth) imgStyle.minWidth = image.minWidth;
	if (!!image.minHeight) imgStyle.minHeight = image.minHeight;

	//margin
	size = image.margin || {};
	imgStyle.marginTop = size.top || 0;
	imgStyle.marginRight = size.right || 0;
	imgStyle.marginBottom = size.bottom || 0;
	imgStyle.marginLeft = size.left || 0;

	//padding
	size = props.padding || {};
	if (!bottom && !!size.top) imgStyle.marginTop += size.top;
	if (float === "right" && !!size.right) imgStyle.marginRight += size.right;
	if (bottom && !!size.bottom) imgStyle.marginBottom += size.bottom;
	if (float === "left"&& !!size.left)imgStyle.marginLeft += size.left;

	//border
	border = image.border || {};
	imgStyle.borderWidth = border.width;
	imgStyle.borderRadius = border.radius;
	imgStyle.borderColor = border.color && border.color.color;
	imgStyle.borderStyle = border.style || 'solid';


	var spacerStyle = {height: 0};
	if (bottom) {
		spacerStyle = {float: float, width: 0};

		var imgHeight = image.height;
		var boxHeight = (props.height || 0) - (2 * (props.border && props.border.width || 0));
		if (boxHeight !== undefined) {
			if (imgHeight === undefined) imgHeight = parseInt(image.height / 2, 10);

			// equal to the height of the content minus the height of the image and minus some margin.
			spacerStyle.height = (boxHeight - imgHeight) - (image.margin !== undefined ? image.margin.bottom || 0 + image.margin.top || 0 : 0) - ((props.padding && props.padding.top || 0) + (props.padding && props.padding.bottom || 0));
		}
	}
	return (
		<div style={style}>
			<div style={bgStyle}></div>
			<div style={spacerStyle}></div>
			<img src={image.url} style={imgStyle}/>
			<div style={pStyle} dangerouslySetInnerHTML={{__html: props.content}}></div>
		</div>)
}
const DEFAULT_IMAGE_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
HtmlImagePanel.defaultProps = {
	image: {url: DEFAULT_IMAGE_URL},
	minHeight: 100,
	//height: 200,
	minWidth: 150,
	//content: 'Putin odmítá, že by Rusko usilovalo o to, stát se světovou supervelmocí. Podobné aspirace považuje za příliš nákladné a naprosto zbytečné. Ruský prezident by v každém případě přivítal, kdyby se Rusko opět mohlo zúčastňovat setkání nejvyspělejších států světa ve formátu G8. Dle svých slov se nebrání ani spolupráci Ruska s NATO. „My jsme spolupráci nikdy nepozastavili a máme k ní mnoho důvodů a příležitostí. Je to však stejné jako v životě. Naplněný vztah může existovat jen tehdy, pokud jsou vřelé city opětovány také druhou stranou. Když s námi NATO spolupracovat nechce, tak se nedá nic dělat,“ konstatuje ruský prezident.'
};
export default HtmlImagePanel;

