import React from 'react';
import styleBorder from './utils/border';
import styleFont from './utils/font';

let Box = (props) => {

	var style = {};

  //font
  var fontStyle = {};
  styleFont(fontStyle, props.font);

	//border
	styleBorder(style,props.border);

	//size
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;
	if (props.minHeight) style.minHeight = props.minHeight;
	if (props.minWidth) style.minWidth = props.minWidth;

	style.objectFit = props.objectFit || 'fill';
	if (props.clipPath) {
		style.clipPath = props.clipPath;
		style.WebkitClipPath = props.clipPath;
		style.WebkitClipPath = props.clipPath;
	}

	return <article className="caption">
		<img style={style} className="caption__media" src={props.url} />
		<div style={fontStyle} className="caption__overlay">
			<h1 className="caption__overlay__title">{props.caption}</h1>
			<p className="caption__overlay__content" dangerouslySetInnerHTML={{__html: props.description}}></p>
		</div>
	</article>
};
const DEFAULT_IMAGE_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
Box.defaultProps = {minHeight:100, minWidth:150,url: DEFAULT_IMAGE_URL,caption:"title", description:"type your description"};
export default Box;
