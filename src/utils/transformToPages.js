import traverse from 'traverse';
import _ from 'lodash';


/**
 * This reduce containers objects (containers, repeaters) to boxes group by pages.
 * This reduce object schema tree to flat boxes group by pages.
 * The transformation has these steps
 * -    transform relative positions to absolute positions (top, left)
 * -    removes all content in hidden containers
 * -    expands repeatable container (using repeater binding)
 * -    group to pages
 * -    apply one-way data binding
 *
 * @param {object} schema - object schema tree
 * @param {object} data - data context used for data binding
 * @returns {object} schema to render -> pages with boxes with data-binded values
 */
var generateCssTransform = function(transform) {
    var cssTransform = '';

    if (transform.tx !== undefined)  cssTransform += ' translateX(' + transform.tx + 'px)';
    if (transform.ty !== undefined) cssTransform += ' translateY(' + transform.ty + 'px)';
    if (transform.rz !== undefined) cssTransform += ' rotate(' + transform.rz + 'rad)';
    if (transform.sx !== undefined) cssTransform += ' scaleX(' + transform.sx + ')';
    if (transform.sy !== undefined) cssTransform += ' scaleY(' + transform.sy + ')';

    return cssTransform
};
function transformToPages(clonedSchema,pageHeight){

    const CONTAINER_NAME = "Container";
    const REPEATER_CONTAINER_NAME = "Repeater";
    const BOXES_COLLECTION_NAME = "boxes";
    const DEFAULT_PAGE_HEIGHT = 1065;


    //step -> transform relative positions to absolute positions
	if (pageHeight === undefined) pageHeight = DEFAULT_PAGE_HEIGHT;
    var globalTop = 0;
    var trav = function(node){

        if (node === undefined) return 0;

        var props = node.props || {};

        //grap height and top properties
        var nodeHeight = (node.style === undefined)?0:parseInt(node.style.height, 10);
        if (isNaN(nodeHeight)) nodeHeight = 0;
        var nodeTop = (node.style === undefined)?0:parseInt(node.style.top, 10);
        if (isNaN(nodeTop)) nodeTop = 0;


        var children = node.containers || [];
        var computedHeight = 0;
        if (children === undefined) return computedHeight;
        var childrenHeight = 0;

		//unbreakable -> if section is too height to have enough place to fit the the page - move it to the next page
		var startOnNewPage =  false;
		if (!!props.unbreakable){
			var nodeBottom = globalTop + nodeHeight;
			var nextPageTop = Math.ceil(globalTop/pageHeight) * pageHeight;
			startOnNewPage = nodeBottom > nextPageTop;
		}

		//startOnNewPage - move globalTop to the next page
		if (!!props.startOnNewPage || startOnNewPage) globalTop = Math.ceil(globalTop/pageHeight) * pageHeight;


        //set absolute top property - use last global top + node top (container can have top != 0)
        if (node.style !== undefined) node.style.top = globalTop + nodeTop;

        //recurse by all its children containers
        for (var i in children)
        {
            childrenHeight += trav(children[i]);
        }

        //expand container height if childrenHeight is greater than node height - typically for repeated containers
        computedHeight = _.max([nodeHeight,childrenHeight]) +  nodeTop;
        //var tmp =  node.style!==undefined?node.style.top:'--';
        //console.log(node.name + ":" + height + "->" + top + ", " + tmp);

        //compute next top
        globalTop += (computedHeight-childrenHeight);
        //return computed height of container
        return computedHeight;
    };
    trav(clonedSchema);


    //step -> reduce to boxes - using containers absolute positions (top,height) and its dimensions (with, height)
    //step -> create pages and add boxes to them
    var pages = [];
    var currentPage;
    traverse(clonedSchema).reduce(function (occ,x) {

        if (this.key === BOXES_COLLECTION_NAME){
            var parent = this.parent.node;
            for (var i in x){
                var el = x[i];

				var elTop = el.style.top && parseInt(el.style.top,10) || 0;
				var elLeft = el.style.left && parseInt(el.style.left,10) || 0;

                //grab parent positions
                var top = (parent.style.top && parseInt(parent.style.top,10) || 0) + elTop;
                var left = (parent.style.left && parseInt(parent.style.left,10) || 0) + elLeft;

                //grab parent dimensions
                //TODO: !!!! temporarily - container width simulates boxes width
                var height = (parent.style.height && parseInt(parent.style.height, 10) || 0) - elTop;
                var width = (parent.style.width && parseInt(parent.style.width, 10) || 0) - elLeft;
                //var height = parseInt(el.style.height,10);
                //var width = parseInt(el.style.width,10);
                if (isNaN(height)) height = 0;
                if (isNaN(width)) width = 0;


                //create newPage
                if (currentPage === undefined || (top + height) > pageHeight * pages.length){
                    var newPage ={pageNumber:pages.length + 1,boxes:[]};
                    pages.push(newPage);
                    currentPage = newPage;
                }

                //decrease top according the pages
                if (pages.length > 1){ top -= (pages.length -1) * pageHeight };

                var style = {'left':left,'top':top,'position':'absolute'};
                if (el.style.width!== undefined) style.width = el.style.width;
                if (el.style.height!== undefined) style.height = el.style.height;
                if (el.style.zIndex!== undefined) style.zIndex = el.style.zIndex;

                //propagate width and height to widget props
                if (!el.props.width && !!el.style.width) el.props.width = el.style.width;
                if (!el.props.height&& !!el.style.height) el.props.height = el.style.height;

                if (el.style.transform !== undefined) {
                    style.WebkitTransform = generateCssTransform(el.style.transform);
                    style.transform = generateCssTransform(el.style.transform);
                }
                // set another box
                currentPage.boxes.push({element:x[i],style:style});
            }
        }
        return occ;
    }, pages);


    //step -> apply one-way binding
    //_.each(pages,function(page){
    //    _.each(page.boxes,function(node) {
    //        var box = node.element;
    //        for (var propName in box){
    //            var prop = box[propName];
    //            //TODO: better test - it is a binding object?
    //            if (_.isObject(prop) && !!prop.Path && prop.Mode !== 'TwoWay'){
    //                //one-way binding
    //                box[propName] = dataBinder.getValue(prop.Path);
    //            }
    //        }
    //    })
    //});

    return pages;
};

export default transformToPages;
