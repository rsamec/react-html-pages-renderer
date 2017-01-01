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

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactFlexr = require('react-flexr');

var _WidgetRenderer = require('./WidgetRenderer');

var _WidgetRenderer2 = _interopRequireDefault(_WidgetRenderer);

var _utilsBackgroundStyle = require('./utils/backgroundStyle');

var _utilsBackgroundStyle2 = _interopRequireDefault(_utilsBackgroundStyle);

var Row = (function (_React$Component) {
	_inherits(Row, _React$Component);

	function Row() {
		_classCallCheck(this, Row);

		_get(Object.getPrototypeOf(Row.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(Row, [{
		key: 'render',
		value: function render() {

			var containers = this.props.containers || [];
			var boxes = this.props.boxes || [];

			var _props = this.props;
			var containerProps = _props.containerProps;
			var dataContext = _props.dataContext;
			var ctx = _props.ctx;
			var elementName = _props.elementName;

			var styles = {
				left: this.props.left,
				top: this.props.top,
				height: this.props.height,
				width: this.props.width === undefined ? '100%' : this.props.width,
				position: this.props.position || 'relative'
			};

			var customStyles = ctx["styles"] || {};

			var customStyle = ctx["styles"] && ctx["styles"][elementName];

			var selfProps = containerProps;
			var selfBindings = {};

			if (customStyle !== undefined) selfProps = _lodash2['default'].merge(_lodash2['default'].cloneDeep(customStyle), selfProps);
			if (selfProps.background !== undefined || selfBindings.background !== undefined) {

				if (this.props.dataBinder !== undefined) selfProps = this.props.widgetRenderer.bindProps(_lodash2['default'].cloneDeep(selfProps), selfNode.bindings, this.props.dataBinder, true);

				styles = _lodash2['default'].extend(styles, (0, _utilsBackgroundStyle2['default'])(selfProps.background, {
					width: this.props.width,
					height: this.props.height
				}));
			}

			var containerComponent = elementName === "Grid" ? _reactFlexr.Grid : 'div';

			return _react2['default'].createElement(
				'div',
				{ style: styles },
				containers.length !== 0 ? _react2['default'].createElement(containerComponent, containerProps, containers.map(function (container, index) {

					var key = container.name + index;

					var left = container.style.left === undefined ? 0 : parseInt(container.style.left, 10);
					var top = container.style.top === undefined ? 0 : parseInt(container.style.top, 10);

					var childComponent = container.elementName === "Cell" ? _reactFlexr.Cell : 'div';

					return _react2['default'].createElement(childComponent, container.props, _react2['default'].createElement(Row, { key: key,
						index: index,
						left: left,
						top: top,
						height: container.style.height,
						width: container.style.width,
						position: container.style.position || 'relative',
						boxes: container.boxes,
						elementName: container.elementName,
						containers: container.containers,
						containerProps: container.props,
						dataContext: this.props.dataContext,
						ctx: this.props.ctx,
						widgets: this.props.widgets,
						widgetRenderer: this.props.widgetRenderer }));
				}, this)) : null,
				boxes.map(function (box, index) {

					var key = box.name + index;

					var elName = box.elementName;
					var widget = _react2['default'].createElement(this.props.widgetRenderer, {
						widget: this.props.widgets[elName],
						node: box,
						customStyle: customStyles[elName],
						dataBinder: dataContext
					}, null);

					return _react2['default'].createElement(
						'div',
						{ key: key, style: box.style },
						_react2['default'].createElement(
							'div',
							{ id: box.name },
							widget
						)
					);
				}, this)
			);
		}
	}]);

	return Row;
})(_react2['default'].Component);

exports['default'] = Row;
module.exports = exports['default'];