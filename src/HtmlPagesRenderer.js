import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import HtmlPage from './HtmlPage.js';
import WidgetRenderer from './WidgetRenderer';
import transformToPages from './utils/transformToPages';
import bindToSchema from './utils/bindToSchema';
import ContainerRenderer from './ContainerRenderer.js';
import HtmlRenderer from './HtmlRenderer';

export default class HtmlPagesRenderer extends React.Component {
	render() {
		var schema = this.props.schema;
		var dataContext = this.props.dataContext;
		var widgets = this.props.widgets;
		
		var defaultPageOptions = {width: 794, height: 1123};

		var pageOptions = this.props.pageOptions || defaultPageOptions;
		var pageHeight = pageOptions.height;
		var pageMargin = pageOptions.margin || {};
		if (pageMargin.top !== undefined) pageHeight -= pageMargin.top;
		if (pageMargin.bottom !== undefined) pageHeight -= pageMargin.bottom;

		var isGrid = schema.containers[0] && schema.containers[0].elementName === "Grid";


		var pages = this.props.pages;
		if (pages === undefined) pages = isGrid ? bindToSchema(schema,dataContext).containers.map(function (container, i) {
			return {pageNumber: i, container: container}
		}) : transformToPages(bindToSchema(schema, dataContext), pageHeight);
		var ctx = (schema.props && schema.props.context) || {};
		var customStyles = ctx['styles'] || {};

		var code = ctx['code'] && ctx['code'].compiled;
		//TODO: hacky way how to compile
		if (code !== undefined) code = code.substr(code.indexOf('return')).replace('})();', '');

		//console.log(code);
		var customCode = !!code ? new Function(code)() : undefined;


		//append shared code to data context
		if (dataContext !== undefined) dataContext.customCode = customCode;

		var pageBackground = (schema.props && schema.props.background) || {};

		var items = schema.containers.map(function (container, i) {
			var conProps = container.props;
			var conBindings = container.bindings;
			if (conBindings !== undefined && dataContext !== undefined) conProps = WidgetRenderer.bindProps(conProps, conBindings, dataContext);
			return {background: (conProps && conProps.background) || pageBackground}
		}, this);

		var normalizeBackgrounds = _.map(items, function (item) {
			return item.background
		}).concat(_.map(_.range(0, pages.length - items.length), function () {
			return pageBackground
		}));

		var pagesRoot = this.props.pagesRoot || 'div';


		let createBoxedPage = function (page, i) {
			var back = normalizeBackgrounds[i];
			return (<HtmlPage key={'page' + i} position={i} pageNumber={page.pageNumber} widgets={widgets}
							  background={back} pageOptions={pageOptions}>
				{page.boxes.map(function (node, j) {
					var elName = node.element.elementName;
					var widget = <WidgetRenderer key={'page' + i + '_' + j} widget={widgets[elName]}
												 node={node.element}
												 customStyle={customStyles[elName]} dataBinder={dataContext}/>;
					return (
						<div key={'item' + j} style={ node.style}>
							<div id={node.element.name}>{widget}</div>
						</div>
					);
				}, this)}
			</HtmlPage>)
		}.bind(this);

		let createGridPage = function (page, i) {
			var back = normalizeBackgrounds[i];

			return <HtmlPage key={'page' + i} position={i} pageNumber={page.pageNumber} widgets={widgets}
							 background={back} pageOptions={pageOptions} title={'Page ' + i} >
				<ContainerRenderer elementName={page.container.elementName}
				containers={page.container.containers}
				node={page.container}
				boxes={page.container.boxes}
				dataBinder={dataContext}
				ctx={ctx}
				widgets={widgets}
				widgetRenderer={WidgetRenderer}
			/>
			</HtmlPage>
		}
		
		
		let createPage = isGrid ? createGridPage : createBoxedPage;

		var counter = 0;
		var double = pageOptions.doublePage || false;

		return React.createElement(pagesRoot, {className:'printable', id: "section-to-print", style: this.props.style}, double ?
			 _.chunk(pages, 2).map(function (item, index) {
					return (
						<div key={'page' + index} title={'Page ' + index}>
						<div className="doublePageStyle" key={index}>
							{item.map(function (page) {
								return createPage(page, counter++)
							}, this)}
						</div></div>)
				}, this) : pages.map(function (page,index) {
				return <div title={'Page ' + index}>{createPage(page, counter++)}</div>
			})
		);
	}
};

export {HtmlPagesRenderer as HtmlPagesRenderer}
export {HtmlRenderer as HtmlRenderer}
