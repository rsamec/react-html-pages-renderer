import React from 'react';
import _ from 'lodash';
import generateCssTransform from './utils/generateCssTransform';

let ContainerRenderer = (props) => {

	var containers = props.containers || [];
	var boxes = props.boxes || [];

	let {dataBinder, ctx, node, widgets} = props;
	var elementName = node.elementName;

	var customStyles = ctx["styles"] || {};


	var styles = {
		left: props.left,
		top: props.top,
		height: props.height,
		width: props.width,
		position: props.position || 'relative'
	};

	var nodeProps = node.props;
	var nodeBindings = node.bindings || {};

	//apply custom styles
	var customStyle = ctx["styles"] && ctx["styles"][elementName];
	if (customStyle !== undefined) nodeProps = _.merge(_.cloneDeep(customStyle), nodeProps);

	//apply node props
	if (dataBinder !== undefined)nodeProps = props.widgetRenderer.bindProps(_.cloneDeep(nodeProps), nodeBindings.bindings, dataBinder, true);


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
			if (dataBinder !== undefined)childProps = props.widgetRenderer.bindProps(childProps, childBindings.bindings, dataBinder, true);

			var childComponent = widgets[container.elementName] || 'div';

			//propagete width and height to child container props
			var containerStyle = container.style || {};
			if (!childProps.width && !!containerStyle.width) childProps.width = containerStyle.width;
			if (!childProps.height && !!containerStyle.height) childProps.height = containerStyle.height;
			if (!childProps.left && !!containerStyle.left) childProps.left = containerStyle.left;
			if (!childProps.top && !!containerStyle.top) childProps.top = containerStyle.top;


			return (React.createElement(childComponent, _.extend({child: true, key: key}, childProps),
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
								   parent={props.parent}
								   dataBinder={props.dataBinder}
								   ctx={props.ctx}
								   widgets={props.widgets}
								   widgetRenderer={props.widgetRenderer}/>
			));
		}, this)) : null}

		{boxes.map(function (box, index) {

			var key = box.name + index;

			//propagate width and height to widget props
			var boxProps = box.props || {};
			var boxStyle = box.style || {};
			if (!boxProps.width && !!boxStyle.width) boxProps.width = boxStyle.width;
			if (!boxProps.height && !!boxStyle.height) boxProps.height = boxStyle.height;

			if (boxStyle.transform !== undefined) {
				boxStyle.WebkitTransform = generateCssTransform(boxStyle.transform);
				boxStyle.transform = generateCssTransform(boxStyle.transform);
			}
			boxStyle.position = elementName === "Cell" ? 'relative' : 'absolute';

			var elName = box.elementName;
			var widget = React.createElement(props.widgetRenderer, {
				widget: props.widgets[elName],
				node: box,
				customStyle: customStyles[elName],
				dataBinder: dataBinder
			}, null);

			return (
				<div key={key} style={boxStyle}>
					<div id={box.name}>{widget}</div>
				</div>
			);


		}, this)
		}

	</div>)
}	
export default ContainerRenderer;

