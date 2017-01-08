import React from 'react';
import _ from 'lodash';

export default class WidgetRenderer extends React.Component {

	render() {
		var box = this.props.node;
		var widget = this.props.widget;
		if (widget === undefined) {
			return React.DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
		}
		var defaultProps = _.cloneDeep(widget.defaultProps) || {};
		var props = _.merge(defaultProps,_.isFunction(box.props.toJS)?box.props.toJS():box.props);

		//attach custom code to be available to widgets
		if (this.props.customCode !== undefined) { props.customCode = this.props.customCode }

		//apply property resolution strategy -> default style -> custom style -> local style
		var customStyle = this.props.customStyle;
		var widgetStyle = {};
		if (customStyle !== undefined) widgetStyle = _.merge(widgetStyle, _.cloneDeep(customStyle));
		props = _.merge(widgetStyle, props);

		return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({ dangerouslySetInnerHTML: { __html: props.content } }) : null);
	}
};
