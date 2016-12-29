import React from 'react';
import _ from 'lodash';

import backgroundStyle from './utils/backgroundStyle';
import styleBorder from'./utils/border'

let BackgroundContainer = (props) => {
	//if (props.child) {
		var styles = {
			width: props.width,
			height: props.height,
			top:props.top,
			left:props.left,
			position: props.position || 'absolute'
		};

		//apply custom background
		if (props.background !== undefined) {
			styles = _.extend(styles, backgroundStyle(props.background, {
				width: props.width,
				height: props.height,
			}))
		}

		//border
		if (props.border !== undefined) styleBorder(styles, props.border);

		var containerProps = {style:styles}
		if (props.name !== undefined)containerProps['id'] = props.name
	//}
	return <div><div {...containerProps}></div><div>{props.children}</div></div>
}

export default BackgroundContainer; 



