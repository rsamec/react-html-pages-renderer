import React from 'react';
import _ from 'lodash';
import styleBorder from './utils/border';
import ImageBox from './ImageBox';

let Box = (props) => {
	var style = {display:'flex',flexWrap:'wrap',alignItems:'stretch'};

	//size
	if (!!props.height) style.height = props.height;
	if (!!props.width) style.width = props.width;
	if (!!props.minWidth) style.minWidth = props.minWidth;
	if (!!props.minHeight) style.minHeight = props.minHeight;
	
	if (!!props.flexDirection) style.flexDirection = props.flexDirection;
	if (!!props.alignContent)  style.alignContent = props.alignContent;
	
	//border
	styleBorder(style, props.border);
	if (!_.isArray(props.images))return <div></div>;
	return <div style={style}>{props.images.map(function(image,index) {
		
		var imageProps = _.extend({url:image.url,flexGrow:index%3,minWidth:0,minHeight:0},props.image);
		return <ImageBox key={index} {...imageProps} />
			})
		}
	</div>
}
const DEFAULT_IMAGE_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
Box.defaultProps = {images:[{url:DEFAULT_IMAGE_URL}], minWidth:100,minHeight:100};
export default Box;
