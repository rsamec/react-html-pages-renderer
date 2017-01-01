'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _generateCssTransform = require('./generateCssTransform');

var _generateCssTransform2 = _interopRequireDefault(_generateCssTransform);

/**
 * This reduce containers objects (containers, repeaters) to boxes group by pages.
 * This reduce object schema tree to flat boxes group by pages.
 * The transformation has these steps
 * -    transform relative positions to absolute positions (top, left)
 * -    group to pages
 *
 * @param {object} schema - object schema tree
 * @param {object} data - data context used for data binding
 * @returns {object} schema to render -> pages with boxes with data-binded values
 */
function transformToPages(clonedSchema, pageHeight) {

  var BACKGROUND_CONTAINER_NAME = "BackgroundContainer";
  var BOXES_COLLECTION_NAME = "boxes";
  var CONTAINERS_COLLECTION_NAME = "containers";
  var DEFAULT_PAGE_HEIGHT = 1065;

  (0, _traverse2['default'])(clonedSchema).reduce(function (occ, x) {

    if (this.key === CONTAINERS_COLLECTION_NAME) {
      for (var i in x) {
        var el = x[i];

        if (el.elementName === BACKGROUND_CONTAINER_NAME) {
          if (this.level > 1 || el.boxes.length === 0 && el.containers.length === 0) {
            var newBox = _lodash2['default'].cloneDeep(el);
            newBox.containers = [];
            newBox.boxes = [];
            el.boxes.unshift(newBox);
          }
        }
      }
    }
  });

  //step -> transform relative positions to absolute positions
  if (pageHeight === undefined) pageHeight = DEFAULT_PAGE_HEIGHT;
  var globalTop = 0;
  var trav = function trav(node) {

    if (node === undefined) return 0;

    var props = node.props || {};

    //grap height and top properties
    var nodeHeight = node.style === undefined ? 0 : parseInt(node.style.height, 10);
    if (isNaN(nodeHeight)) nodeHeight = 0;
    var nodeTop = node.style === undefined ? 0 : parseInt(node.style.top, 10);
    if (isNaN(nodeTop)) nodeTop = 0;

    var children = node.containers || [];
    var computedHeight = 0;
    if (children === undefined) return computedHeight;
    var childrenHeight = 0;

    //unbreakable -> if section is too height to have enough place to fit the the page - move it to the next page
    var startOnNewPage = false;
    if (!!props.unbreakable) {
      var nodeBottom = globalTop + nodeHeight;
      var nextPageTop = Math.ceil(globalTop / pageHeight) * pageHeight;
      startOnNewPage = nodeBottom > nextPageTop;
    }

    //startOnNewPage - move globalTop to the next page
    if (!!props.startOnNewPage || startOnNewPage) globalTop = Math.ceil(globalTop / pageHeight) * pageHeight;

    //set absolute top property - use last global top + node top (container can have top != 0)
    if (node.style !== undefined) node.style.top = globalTop + nodeTop;

    //recurse by all its children containers
    for (var i in children) {
      childrenHeight += trav(children[i]);
    }

    //expand container height if childrenHeight is greater than node height - typically for repeated containers
    computedHeight = _lodash2['default'].max([nodeHeight, childrenHeight]) + nodeTop;

    //compute next top
    globalTop += computedHeight - childrenHeight;

    //return computed height of container
    return computedHeight;
  };
  trav(clonedSchema);

  //step -> reduce to boxes - using containers absolute positions (top,height) and its dimensions (with, height)
  //step -> create pages and add boxes to them
  var pages = [];
  var currentPage;
  (0, _traverse2['default'])(clonedSchema).reduce(function (occ, x) {

    if (this.key === BOXES_COLLECTION_NAME) {
      var parent = this.parent.node;
      for (var i in x) {
        var el = x[i];
        var elStyle = el.style || {};

        var elTop = elStyle.top && parseInt(elStyle.top, 10) || 0;
        var elLeft = elStyle.left && parseInt(elStyle.left, 10) || 0;

        var parentStyle = parent.style || {};
        //grab parent positions
        var top = (parentStyle.top && parseInt(parentStyle.top, 10) || 0) + elTop;
        var left = (parentStyle.left && parseInt(parentStyle.left, 10) || 0) + elLeft;

        //grab parent dimensions
        //TODO: !!!! temporarily - container width simulates boxes width
        var height = (parentStyle.height && parseInt(parentStyle.height, 10) || 0) - elTop;
        var width = (parentStyle.width && parseInt(parentStyle.width, 10) || 0) - elLeft;
        //var height = parseInt(elStyle.height,10);
        //var width = parseInt(elStyle.width,10);
        if (isNaN(height)) height = 0;
        if (isNaN(width)) width = 0;

        //create newPage
        if (currentPage === undefined || top + height > pageHeight * pages.length) {
          var newPage = { pageNumber: pages.length + 1, boxes: [] };
          pages.push(newPage);
          currentPage = newPage;
        }

        //decrease top according the pages
        if (pages.length > 1) {
          top -= (pages.length - 1) * pageHeight;
        };

        var style = { 'left': left, 'top': top, 'position': 'absolute' };
        if (elStyle.width !== undefined) style.width = elStyle.width;
        if (elStyle.height !== undefined) style.height = elStyle.height;
        if (elStyle.zIndex !== undefined) style.zIndex = elStyle.zIndex;

        //TODO: propagate width and height to widget props
        var elProps = el.props || {};
        if (!elProps.width && !!elStyle.width) elProps.width = elStyle.width;
        if (!elProps.height && !!elStyle.height) elProps.height = elStyle.height;

        if (elStyle.transform !== undefined) {
          style.WebkitTransform = (0, _generateCssTransform2['default'])(elStyle.transform);
          style.transform = (0, _generateCssTransform2['default'])(elStyle.transform);
        }
        // set another box
        currentPage.boxes.push({ element: x[i], style: style });
      }
    }
    return occ;
  }, pages);

  return pages;
};

exports['default'] = transformToPages;
module.exports = exports['default'];