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

var WidgetRenderer = (function (_React$Component) {
	_inherits(WidgetRenderer, _React$Component);

	function WidgetRenderer() {
		_classCallCheck(this, WidgetRenderer);

		_get(Object.getPrototypeOf(WidgetRenderer.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(WidgetRenderer, [{
		key: 'render',
		value: function render() {
			var box = this.props.node;
			var widget = this.props.widget;
			if (widget === undefined) {
				return _react2['default'].DOM.span(null, 'Component ' + box.elementName + ' is not register among widgets.');
			}
			var defaultProps = _lodash2['default'].cloneDeep(widget.defaultProps) || {};
			var props = _lodash2['default'].merge(defaultProps, box.props.toJS !== undefined ? box.props.toJS() : box.props);

			//attach custom code to be available to widgets
			if (this.props.customCode !== undefined) {
				props.customCode = this.props.customCode;
			}

			//apply property resolution strategy -> default style -> custom style -> local style
			var customStyle = this.props.customStyle;
			var widgetStyle = {};
			if (customStyle !== undefined) widgetStyle = _lodash2['default'].merge(widgetStyle, _lodash2['default'].cloneDeep(customStyle));
			props = _lodash2['default'].merge(widgetStyle, props);

			return _react2['default'].createElement(widget, props, props.content !== undefined ? _react2['default'].DOM.div({ dangerouslySetInnerHTML: { __html: props.content } }) : null);
		}
	}]);

	return WidgetRenderer;
})(_react2['default'].Component);

exports['default'] = WidgetRenderer;
;
module.exports = exports['default'];