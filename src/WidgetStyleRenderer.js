import React from 'react';
import _ from 'lodash';

export default class WidgetStyleRenderer extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.widgetProps !== nextProps.widgetProps;
    }

    render() {
        const {node, widget, customStyle} = this.props;
        if (widget === undefined) {
            return React.DOM.span(null, 'Component ' + widgetProps.elementName + ' is not register among widgets.');
        }

        //apply property resolution strategy -> default style -> custom style -> local style
        var widgetStyle =  {}; //_.cloneDeep(widget.metaData && widget.metaData.props || {});
        if (customStyle !== undefined) widgetStyle = _.merge(widgetStyle, customStyle);
        var props = _.merge(widgetStyle,node.props);


        return React.createElement(widget, props, props.content !== undefined ? React.DOM.div({dangerouslySetInnerHTML: {__html: props.content}}) : null);
    }
};
