'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utilsGenerateCssTransform = require('./utils/generateCssTransform');

var _utilsGenerateCssTransform2 = _interopRequireDefault(_utilsGenerateCssTransform);

var _utilsBackgroundStyle = require('./utils/backgroundStyle');

var _utilsBackgroundStyle2 = _interopRequireDefault(_utilsBackgroundStyle);

var ContainerView = function ContainerView(props) {

	//background
	var style = (0, _utilsBackgroundStyle2['default'])(props.node.props && props.node.props.background);
	return _react2['default'].createElement(
		'div',
		{ style: style },
		_react2['default'].createElement(ContainerRenderer, props)
	);
};

var ContainerRenderer = (function (_React$Component) {
	_inherits(ContainerRenderer, _React$Component);

	function ContainerRenderer() {
		_classCallCheck(this, ContainerRenderer);

		_get(Object.getPrototypeOf(ContainerRenderer.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(ContainerRenderer, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {

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
	}, {
		key: 'render',
		value: function render() {

			var props = this.props;
			var containers = props.containers || [];
			var boxes = props.boxes || [];

			var ctx = props.ctx;
			var node = props.node;
			var widgets = props.widgets;
			var customCode = props.customCode;

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
			if (customStyle !== undefined) nodeProps = _lodash2['default'].merge(_lodash2['default'].cloneDeep(customStyle), nodeProps);

			//apply node bindings
			//if (dataBinder !== undefined)nodeProps = props.widgetRenderer.bindProps(_.cloneDeep(nodeProps), nodeBindings, dataBinder, true);
			var containerComponent = widgets[elementName] || 'div';
			var containerComponentProps = widgets[elementName] !== undefined ? nodeProps : nodeProps.name !== undefined ? { id: nodeProps.name } : {};

			return _react2['default'].createElement(
				'div',
				{ style: styles },
				containers.length !== 0 ? _react2['default'].createElement(containerComponent, containerComponentProps, containers.map(function (container, index) {

					var key = 'container_' + index;

					var containerStyle = container.style || {};

					var left = containerStyle.left === undefined ? 0 : parseInt(containerStyle.left, 10);
					var top = containerStyle.top === undefined ? 0 : parseInt(containerStyle.top, 10);
					var height = containerStyle.height === undefined ? 0 : parseInt(containerStyle.height, 10);
					var width = containerStyle.width === undefined ? 0 : parseInt(containerStyle.width, 10);

					//je potreba merge
					var childProps = _lodash2['default'].cloneDeep(container.props) || {};
					//var childBindings = container.bindings || {};

					//apply custom styles
					var childCustomStyle = ctx["styles"] && ctx["styles"][container.elementName];
					if (childCustomStyle !== undefined) childProps = _lodash2['default'].merge(_lodash2['default'].cloneDeep(childCustomStyle), childProps);

					//apply node bindings
					//if (dataBinder !== undefined)childProps = props.widgetRenderer.bindProps(childProps, childBindings, dataBinder, true);

					//propagate width and height to child container props

					if (!childProps.width && !!containerStyle.width) childProps.width = containerStyle.width;
					if (!childProps.height && !!containerStyle.height) childProps.height = containerStyle.height;
					if (!childProps.left && !!containerStyle.left) childProps.left = containerStyle.left;
					if (!childProps.top && !!containerStyle.top) childProps.top = containerStyle.top;

					var childComponent = widgets[container.elementName] || 'div';
					var childComponentProps = widgets[container.elementName] !== undefined ? _lodash2['default'].extend({
						child: true,
						key: key,
						id: container.name
					}, childProps) : { id: container.name, key: key };

					return _react2['default'].createElement(childComponent, childComponentProps, _react2['default'].createElement(ContainerRenderer, { key: key,
						index: index,
						left: left,
						top: top,
						height: containerStyle.height,
						width: containerStyle.width,
						position: containerStyle.position || 'relative',
						boxes: container.boxes,
						containers: container.containers,
						node: container,
						parent: props.parent,
						ctx: props.ctx,
						customCode: props.customCode,
						widgets: props.widgets,
						widgetRenderer: props.widgetRenderer }));
				}, this)) : null,
				boxes.map(function (box, index) {

					var key = 'box_' + index;

					//propagate width and height to widget props
					var boxProps = box.props || {};
					var boxStyle = _lodash2['default'].cloneDeep(box.style) || {};
					//if (!boxProps.width && !!boxStyle.width) boxProps.set("width",boxStyle.width);
					//if (!boxProps.height && !!boxStyle.height) boxProps.set("height",boxStyle.height);

					if (boxStyle.transform !== undefined) {
						boxStyle.WebkitTransform = (0, _utilsGenerateCssTransform2['default'])(boxStyle.transform);
						boxStyle.transform = (0, _utilsGenerateCssTransform2['default'])(boxStyle.transform);
					}
					boxStyle.position = elementName === "Cell" ? 'relative' : 'absolute';

					var elName = box.elementName;
					var widget = _react2['default'].createElement(props.widgetRenderer, {
						widget: props.widgets[elName],
						node: box,
						customStyle: customStyles[elName],
						customCode: customCode
					}, null);
					var widgetBoxProps = {};
					if (box.name !== undefined) widgetBoxProps['id'] = box.name;
					return _react2['default'].createElement(
						'div',
						{ key: key, style: boxStyle },
						_react2['default'].createElement(
							'div',
							widgetBoxProps,
							widget
						)
					);
				}, this)
			);
		}
	}]);

	return ContainerRenderer;
})(_react2['default'].Component);

exports['default'] = ContainerView;
module.exports = exports['default'];