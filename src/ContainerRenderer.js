import React from 'react';
import _ from 'lodash';
import generateCssTransform from './utils/generateCssTransform';
import backgroundStyle from './utils/backgroundStyle';

let ContainerView = (props) => {
	
	//background
	var style = backgroundStyle(props.node.props && props.node.props.background);
	return <div style={style}><ContainerRenderer {...props}/></div>		
}

class ContainerRenderer extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
    
		// The comparison is fast, and we won't render the component if
		// it does not need it. This is a huge gain in performance.
		var node = this.props.node;
		var update = node !== nextProps.node;
    
		if (update) {
			console.log(node.elementName + "(" + node.name + ")" + " -> " + update);
			return update;
		}
		return false;
	}

	render() {

		var props = this.props;
		var containers = props.containers || [];
		var boxes = props.boxes || [];

		let {ctx, node, widgets, customCode} = props;
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
		
		//reuse visibility
		if (nodeProps !== undefined && nodeProps.visibility !== undefined && !nodeProps.visibility) return null;
		//var nodeBindings = node.bindings || {};

		//apply custom styles
		var customStyle = ctx["styles"] && ctx["styles"][elementName];
		if (customStyle !== undefined) nodeProps = _.merge(_.cloneDeep(customStyle), nodeProps);

		//apply node bindings
		//if (dataBinder !== undefined)nodeProps = props.widgetRenderer.bindProps(_.cloneDeep(nodeProps), nodeBindings, dataBinder, true);
		var containerComponent = widgets[elementName] || 'div';
		var containerComponentProps =  widgets[elementName] !== undefined?nodeProps:nodeProps.name!==undefined?{id:nodeProps.name}:{};

		return (<div style={styles}>
			{containers.length !== 0 ? React.createElement(containerComponent, containerComponentProps, containers.map(function (container, index) {

				var key = 'container_' + index;

				var containerStyle = container.style || {};

				var left = containerStyle.left === undefined ? 0 : parseInt(containerStyle.left, 10);
				var top = containerStyle.top === undefined ? 0 : parseInt(containerStyle.top, 10);
				var height = containerStyle.height === undefined ? 0 : parseInt(containerStyle.height, 10);
				var width = containerStyle.width === undefined ? 0 : parseInt(containerStyle.width, 10);

				//je potreba merge
				var childProps = _.cloneDeep(container.props) || {};
				//var childBindings = container.bindings || {};

				//apply custom styles
				var childCustomStyle = ctx["styles"] && ctx["styles"][container.elementName];
				if (childCustomStyle !== undefined) childProps = _.merge(_.cloneDeep(childCustomStyle), childProps);

				//apply node bindings
				//if (dataBinder !== undefined)childProps = props.widgetRenderer.bindProps(childProps, childBindings, dataBinder, true);

				

				//propagate width and height to child container props
				
				if (!childProps.width && !!containerStyle.width) childProps.width = containerStyle.width;
				if (!childProps.height && !!containerStyle.height) childProps.height = containerStyle.height;
				if (!childProps.left && !!containerStyle.left) childProps.left = containerStyle.left;
				if (!childProps.top && !!containerStyle.top) childProps.top = containerStyle.top;

				var childComponent = widgets[container.elementName] || 'div';
				var childComponentProps = widgets[container.elementName] !== undefined?_.extend({
						child: true,
						key: key,
						id: container.name
					}, childProps):{id: container.name,key: key}
				
				return (React.createElement(childComponent, childComponentProps,
					<ContainerRenderer key={key}
									   index={index}
									   left={left}
									   top={top}
									   height={containerStyle.height}
									   width={containerStyle.width}
									   position={containerStyle.position || 'relative'}
									   boxes={container.boxes}
									   containers={container.containers}
									   node={container}
									   parent={props.parent}
									   ctx={props.ctx}
									   customCode={props.customCode}
									   widgets={props.widgets}
									   widgetRenderer={props.widgetRenderer}/>
				));
			}, this)) : null}

			{boxes.map(function (box, index) {

				var key = 'box_' + index;

				//propagate width and height to widget props
				var boxProps = box.props || {};
				var boxStyle = _.cloneDeep(box.style) || {};
				//if (!boxProps.width && !!boxStyle.width) boxProps.set("width",boxStyle.width);
				//if (!boxProps.height && !!boxStyle.height) boxProps.set("height",boxStyle.height);
				
								
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
					customCode:customCode
				}, null);
				var widgetBoxProps = {};
				if (box.name !== undefined) widgetBoxProps['id'] = box.name;
				return (
					<div key={key} style={boxStyle}>
						<div {...widgetBoxProps}>{widget}</div>
					</div>
				);


			}, this)
			}

		</div>)
	}
}
export default ContainerView;

