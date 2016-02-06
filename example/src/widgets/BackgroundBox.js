import React from 'react';
import backgroundStyle from './utils/backgroundStyle';
import styleBorder from './utils/border';

var Panel = (props) => {
	
	var style = backgroundStyle(props.background);
	
	styleBorder(style,props.border);
	
	//size
	if (props.height) style.height = props.height;
	if (props.width) style.width = props.width;

	if (props.clipPath) {
		style.clipPath = props.clipPath;
		style.WebkitClipPath = props.clipPath;
	}

	return <div style={style}>
	</div>
};
Panel.defaultProps = {height:50, width:50, background:{color:{color:'#ff0a0a'}}};
export default Panel;
