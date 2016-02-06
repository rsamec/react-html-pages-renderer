import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import HtmlPage from './HtmlPage.js';
import WidgetRenderer from './WidgetRenderer';
import transformToPages from './utils/transformToPages';

export default class HtmlPagesRenderer extends React.Component {
  render() {
    var pageOptions = this.props.pageOptions || {};
    var pageHeight = pageOptions.height;
    var pageMargin = pageOptions.margin || {};
    if (pageMargin.top !== undefined) pageHeight -= pageMargin.top;
    if (pageMargin.bottom !== undefined) pageHeight -= pageMargin.bottom;

    var pages = this.props.pages;
    if (pages === undefined) pages = transformToPages(this.props.schema, pageHeight);
    var ctx = (this.props.schema.props && this.props.schema.props.context) || {};
    var customStyles = ctx['styles'] || {};

    var code = ctx['code'] && ctx['code'].code;

    var customCode = !!code ? new Function(code)() : undefined;

    var dataContext = this.props.dataContext;

    //append shared code to data context
    if (dataContext !== undefined) dataContext.customCode = customCode;

    var pageBackground = (this.props.schema.props && this.props.schema.props.background) || {};

    var items = this.props.schema.containers.map(function (container, i) {
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
                        background={back} pageOptions={this.props.pageOptions}>
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
    var double = true;

    return React.createElement(pagesRoot, {id: "section-to-print", style: this.props.style},double?
          _.chunk(pages, 2).map(function (item, index) {
            return (
              <div style={{display:'flex'}} key={index}>
                {item.map(function (page) {
                  return createPage(page, counter++)
                }, this)}
              </div>)
          }, this):pages.map(function(page) {return createPage(page,counter++)})
    );
  }
};
