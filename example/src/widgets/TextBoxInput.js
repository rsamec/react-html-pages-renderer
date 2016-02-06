import React from 'react';

export default (props) => {
	var valueLink = props.valueLink;

	var value = valueLink !== undefined ? valueLink.value : null;
	var handleChange = valueLink !== undefined ? function (e) {
		valueLink.value = e.target.value;
	} : null;
	
	return (
		<label>{props.label}
			<input type='text' defaultValue={props.value} value={value} placeholder={props.placeholder}
				   onChange={handleChange}/>
		</label>
	)
}

