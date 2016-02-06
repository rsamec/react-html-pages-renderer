import React from 'react';
const DEFAULT_IMAGE_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
var Article = (props) => {

	var style = {};

	//border
	var border = props.border || {};
	if (border.width) style.borderWidth = border.width;
	if (border.radius) style.borderRadius = border.radius;
	if (border.color) style.borderColor = border.color.color;
	if (border.style) style.borderStyle = border.style;

	//size
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;
	if (props.minHeight) style.minHeight = props.minHeight;
	if (props.minWidth) style.minWidth = props.minWidth;

	if (props.objectFit) style.objectFit = props.objectFit || 'fill';
	if (props.clipPath) {
		style.clipPath = props.clipPath;
		style.WebkitClipPath = props.clipPath;
	}

	return <article className="caption">
		<img style={style} className="caption__media" src={props.url} />
		<div className="caption__overlay">
			<h1 className="caption__overlay__title">{props.caption}</h1>
			<p className="caption__overlay__content" dangerouslySetInnerHTML={{__html: props.description}}></p>
		</div>
	</article>
};
//Article.defaultProps = {minHeight:50, minWidth:100,url: DEFAULT_IMAGE_URL,caption:"type your caption", description:"type your description"};
export default Article;
