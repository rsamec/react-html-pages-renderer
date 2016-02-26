import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import HtmlPage from './HtmlPage.js';
import WidgetRenderer from './WidgetRenderer';
import transformToPages from './utils/transformToPages';
import GraphicUtil from './utils/graphicUtil';

export default class HtmlPagesRenderer extends React.Component {
  render() {
	var schema = this.props.schema;

    var defaultPageSizes = GraphicUtil.PageSizes[schema.props && schema.props.defaultPageSize || 'A4'];
	var defaultPageOptions = {height: GraphicUtil.pointToPixel(defaultPageSizes[1]), width: GraphicUtil.pointToPixel(defaultPageSizes[0])};
	  
	var pageOptions = this.props.pageOptions || defaultPageOptions;
    var pageHeight = pageOptions.height;
    var pageMargin = pageOptions.margin || {};
    if (pageMargin.top !== undefined) pageHeight -= pageMargin.top;
    if (pageMargin.bottom !== undefined) pageHeight -= pageMargin.bottom;

    var pages = this.props.pages;
    if (pages === undefined) pages = transformToPages(schema, pageHeight);
    var ctx = (schema.props && schema.props.context) || {};
    var customStyles = ctx['styles'] || {};

    var code = ctx['code'] && ctx['code'].compiled;
	  //TODO: hacky way how to compile
	if (code!== undefined) code = code.substr(code.indexOf('return')).replace('})();','');   
	  
	//console.log(code);
    var customCode = !!code ? new Function(code)() : undefined;

    var dataContext = this.props.dataContext;

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

    let createPage = function (page, i) {
      var back = normalizeBackgrounds[i];
      return (<HtmlPage key={'page' + i} position={i} pageNumber={page.pageNumber} widgets={this.props.widgets}
                        background={back} pageOptions={pageOptions}>
        {page.boxes.map(function (node, j) {
          var elName = node.element.elementName;
          var widget = <WidgetRenderer key={'page' + i + '_' + j} widget={this.props.widgets[elName]}
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

    var counter = 0;
    var double = this.props.doublePage || false;

    return React.createElement(pagesRoot, {id: "section-to-print", style: this.props.style},double?
          _.chunk(pages, 2).map(function (item, index) {
            return (
              <div style={{display:'-webkit-flex'}} key={index}>
                {item.map(function (page) {
                  return createPage(page, counter++)
                }, this)}
              </div>)
          }, this):pages.map(function(page) {return createPage(page,counter++)})
    );
  }
};
