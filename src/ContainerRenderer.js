import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import WidgetRenderer from './WidgetRenderer';
import backgroundStyle from './utils/backgroundStyle';
import styleBorder from './utils/border.js';
import generateCssTransform from './utils/generateCssTransform';

export default class ContainerRenderer extends React.Component {

	render() {

		var containers = this.props.containers || [];
		var boxes = this.props.boxes || [];

		let { dataBinder,ctx,node, widgets} = this.props;
		var elementName = node.elementName;

		var customStyles = ctx["styles"] || {};


		var styles = {
			left: this.props.left,
			top: this.props.top,
			height: this.props.height,
			width: this.props.width,
			position: this.props.position || 'relative'
		};

		var nodeProps = node.props;
		var nodeBindings = node.bindings || {};

		//apply custom styles
		var customStyle = ctx["styles"] && ctx["styles"][elementName];
		if (customStyle !== undefined) nodeProps = _.merge(_.cloneDeep(customStyle), nodeProps)

		//apply node props
		if (dataBinder !== undefined)nodeProps = this.props.widgetRenderer.bindProps(_.cloneDeep(nodeProps), nodeBindings.bindings, dataBinder, true);


		var containerComponent = widgets[elementName] || 'div';

		return (<div style={styles}>
			{containers.length !== 0 ? React.createElement(containerComponent, nodeProps, containers.map(function (container, index) {

				var key = container.name + index;

				var left = container.style.left === undefined ? 0 : parseInt(container.style.left, 10);
				var top = container.style.top === undefined ? 0 : parseInt(container.style.top, 10);

				//je potreba merge
				var childProps = _.cloneDeep(container.props) || {};
				var childBindings = container.bindings || {};
				
				//apply custom styles
				var childCustomStyle = ctx["styles"] && ctx["styles"][container.elementName];
				if (childCustomStyle !== undefined) childProps = _.merge(_.cloneDeep(childCustomStyle), childProps)

				//apply node props
				if (dataBinder !== undefined)childProps = this.props.widgetRenderer.bindProps(childProps, childBindings.bindings, dataBinder, true);

				var childComponent = widgets[container.elementName] || 'div';
				
				//propagete width and height to child container props
				if (!childProps.width && !!container.style.width) childProps.width = container.style.width;
				if (!childProps.height && !!container.style.height) childProps.height = container.style.height;
				
				
				return (React.createElement(childComponent, _.extend({child: true, key: key},childProps),
					<ContainerRenderer key={key}
									   index={index}
									   left={left}
									   top={top}
									   height={container.style.height}
									   width={container.style.width}
									   position={container.style.position || 'relative'}
									   boxes={container.boxes}
									   containers={container.containers}
									   node={container}
									   parent={this.props.parent}
									   dataBinder={this.props.dataBinder}
									   ctx={this.props.ctx}
									   widgets={this.props.widgets}
									   widgetRenderer={this.props.widgetRenderer}/>
				));
			}, this)) : null}

			{boxes.map(function (box, index) {

				var key = box.name + index;

				if (box.style.transform !== undefined) {
					box.style.WebkitTransform = generateCssTransform(box.style.transform);
					box.style.transform = generateCssTransform(box.style.transform);
				}
				
				box.style.position = elementName ==="Cell"?'relative':'absolute';

				var elName = box.elementName;
				var widget = React.createElement(this.props.widgetRenderer, {
					widget: this.props.widgets[elName],
					node: box,
					customStyle: customStyles[elName],
					dataBinder: dataBinder
				}, null);

				return (
					<div key={key} style={box.style}>
						<div id={box.name}>{widget}</div>
					</div>
				);


			}, this)
			}

		</div>)
	}
}
