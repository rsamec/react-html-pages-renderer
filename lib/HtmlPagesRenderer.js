'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _HtmlPageJs = require('./HtmlPage.js');

var _HtmlPageJs2 = _interopRequireDefault(_HtmlPageJs);

var _WidgetRenderer = require('./WidgetRenderer');

var _WidgetRenderer2 = _interopRequireDefault(_WidgetRenderer);

var _utilsTransformToPages = require('./utils/transformToPages');

var _utilsTransformToPages2 = _interopRequireDefault(_utilsTransformToPages);

var _ContainerRendererJs = require('./ContainerRenderer.js');

var _ContainerRendererJs2 = _interopRequireDefault(_ContainerRendererJs);

var _HtmlRenderer = require('./HtmlRenderer');

var _HtmlRenderer2 = _interopRequireDefault(_HtmlRenderer);

var React = require('react');

var pageComponent = function pageComponent(WrappedComponent, page, back, i) {
	return function (props) {
		//let page = props.page;
		var newProps = {
			page: page
		};
		console.log("Page" + i);

		return React.createElement(
			_HtmlPageJs2['default'],
			{ key: 'page' + i, position: i, pageNumber: page.pageNumber, background: back, pageOptions: pageOptions, title: 'Page ' + i },
			React.createElement(WrappedComponent, _extends({}, props, newProps))
		);
	};
};

var PagesRenderer = function PagesRenderer(props) {

	var pagesRoot = props.pagesRoot || 'div';
	var createPage = props.createPage;
	var pages = props.pages;
	var counter = 0;
	var double = props.doublePage || false;

	return React.createElement(pagesRoot, {
		className: 'printable',
		id: "section-to-print",
		style: props.style,
		swipeOptions: { continuous: true },
		key: pages.length
	}, double ? _lodash2['default'].chunk(pages, 2).map(function (item, index) {
		return React.createElement(
			'div',
			{ key: 'page' + index, title: index },
			React.createElement(
				'div',
				{ className: 'doublePageStyle', key: index },
				item.map(function (page) {
					return createPage(page, counter++);
				}, this)
			)
		);
	}, undefined) : pages.map(function (page, index) {
		return React.createElement(
			'div',
			{ title: 'Page ' + index },
			createPage(page, counter++)
		);
	}));
};

var HtmlPagesRenderer = (function (_React$Component) {
	_inherits(HtmlPagesRenderer, _React$Component);

	function HtmlPagesRenderer() {
		_classCallCheck(this, HtmlPagesRenderer);

		_get(Object.getPrototypeOf(HtmlPagesRenderer.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(HtmlPagesRenderer, [{
		key: 'render',
		value: function render() {
			var _props = this.props;
			var schema = _props.schema;
			var widgets = _props.widgets;

			var ctx = schema.props && schema.props.context || {};
			var customStyles = ctx['styles'] || {};

			var code = ctx['code'] && ctx['code'].compiled;
			if (!!code && this.customCode === undefined) {
				this.customCode = eval(code);
			}
			var customCode = this.customCode;
			//pageOptions
			var defaultPageOptions = { width: 794, height: 1123 };

			var pageOptions = this.props.pageOptions || defaultPageOptions;
			var pageHeight = pageOptions.height;
			var pageMargin = pageOptions.margin || {};
			if (pageMargin.top !== undefined) pageHeight -= pageMargin.top;
			if (pageMargin.bottom !== undefined) pageHeight -= pageMargin.bottom;

			var isGrid = schema.containers[0] && schema.containers[0].elementName === "Grid";

			var pageBackground = schema.props && schema.props.background;

			//pages
			var pages = this.props.pages;
			if (pages === undefined) pages = isGrid ? schema.containers.map(function (container, i) {
				return { pageNumber: i, container: container, pageBackground: container.props.background || pageBackground };
			}) : (0, _utilsTransformToPages2['default'])(schema.toJS(), pageHeight);

			var pageBackground = schema.props && schema.props.background || {};

			var items = schema.containers.map(function (container, i) {
				var conProps = container.props;
				var conBindings = container.bindings;
				//if (conBindings !== undefined && dataContext !== undefined) conProps = WidgetRenderer.bindProps(conProps, conBindings, dataContext);
				return { background: conProps && conProps.background || pageBackground };
			}, this);

			var normalizeBackgrounds = _lodash2['default'].map(items, function (item) {
				return item.background;
			}).concat(_lodash2['default'].map(_lodash2['default'].range(0, pages.length - items.length), function () {
				return pageBackground;
			}));

			var pagesRoot = this.props.pagesRoot || 'div';

			var createBoxedPage = (function (page, i) {
				var back = normalizeBackgrounds[i];
				return React.createElement(
					_HtmlPageJs2['default'],
					{ key: 'page' + i, position: i, pageNumber: page.pageNumber, widgets: widgets,
						background: back, pageOptions: pageOptions },
					page.boxes.map(function (node, j) {
						var elName = node.element.elementName;
						var widget = React.createElement(_WidgetRenderer2['default'], { key: 'page' + i + '_' + j, widget: widgets[elName],
							node: node.element,
							customStyle: customStyles[elName],
							customCode: customCode });
						return React.createElement(
							'div',
							{ key: 'item' + j, style: node.style },
							React.createElement(
								'div',
								{ id: node.element.name },
								widget
							)
						);
					}, this)
				);
			}).bind(this);

			var createGridPage = function createGridPage(page, i) {
				var back = normalizeBackgrounds[i];
				return React.createElement(
					_HtmlPageJs2['default'],
					{ key: 'page' + i, position: i, pageNumber: page.pageNumber, widgets: widgets,
						background: back, pageOptions: pageOptions, title: 'Page ' + i },
					React.createElement(_ContainerRendererJs2['default'], { elementName: page.container.elementName,
						containers: page.container.containers,
						node: page.container,
						boxes: page.container.boxes,
						ctx: ctx,
						widgets: widgets,
						widgetRenderer: _WidgetRenderer2['default'],
						customCode: customCode
					})
				);
			};

			var createPage = isGrid ? createGridPage : createBoxedPage;

			var counter = 0;
			var double = pageOptions.doublePage || false;

			return React.createElement(pagesRoot, { className: 'printable', id: "section-to-print", style: this.props.style, swipeOptions: { continuous: true }, key: pages.length }, double ? _lodash2['default'].chunk(pages, 2).map(function (item, index) {
				return React.createElement(
					'div',
					{ key: 'page' + index, title: index },
					React.createElement(
						'div',
						{ className: 'doublePageStyle', key: index },
						item.map(function (page) {
							return createPage(page, counter++);
						}, this)
					)
				);
			}, this) : pages.map(function (page, index) {
				return React.createElement(
					'div',
					{ title: 'Page ' + index },
					createPage(page, counter++)
				);
			}));
		}
	}]);

	return HtmlPagesRenderer;
})(React.Component);

exports['default'] = HtmlPagesRenderer;
;

exports.HtmlPagesRenderer = HtmlPagesRenderer;
exports.HtmlRenderer = _HtmlRenderer2['default'];