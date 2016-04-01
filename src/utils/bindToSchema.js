import traverse from 'traverse';
import _ from 'lodash';
import Binder from 'react-binding';

var getArrayRange = ()=>{return undefined}
var getBindingValue = (dataBinder,path)=> {
	var binding = Binder.bindTo(dataBinder, path);
	return binding.value;
}

function bindToSchema(clonedSchema,dataBinder){

	const CONTAINER_NAME = "Container";
	const REPEATER_CONTAINER_NAME = "Repeater";
	const BOXES_COLLECTION_NAME = "boxes";
	
	const VISIBILITY_KEY = "visibility";
	const ITEMS_KEY = "binding";

	//var specialClone = function(current, containers){ return _.extend(_.cloneDeep(_.omit(current,['containers','boxes'])),{containers:containers, boxes:current.boxes})}
	////first clone schema so that
	//// deep clone for containers
	//// shallow clone for boxes
	//function iterate(current) {
	//    var children = current.containers;
	//
	//    //stop condition
	//    if (children === undefined || children.length === 0){
	//        return specialClone(current,[]);
	//    };
	//
	//    //iterate through containers
	//    var containers = [];
	//    for (var i = 0, len = children.length; i < len; i++) {
	//        containers.push(iterate(children[i]));
	//    }
	//    return specialClone(current,containers);
	//}

	var getValue = _.curry(getBindingValue)(dataBinder);
	
	//step -> set section visibility (containers)
	traverse(clonedSchema).forEach(function (x) {

		if (!!x && x.elementName === CONTAINER_NAME) {
					
			//var visibilityProp = x.props && x.props[VISIBILITY_KEY];
			var visibilityBinding = x.bindings && x.bindings[VISIBILITY_KEY];
			
			if (visibilityBinding !== undefined){
				x.props[VISIBILITY_KEY] = !!visibilityBinding.path?getValue(visibilityBinding.path):undefined;					
			}
			
		}
	});

	//step -> set repeatable sections (containers) -
	traverse(clonedSchema).forEach(function (x) {
		if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
			//var itemsProp = x.props && x.props[ITEMS_KEY];
			var itemsBinding = x.bindings && x.bindings[ITEMS_KEY];
			
			//var rangeFromPath = !!binding && !!binding.path && getArrayRange(binding.path);
			//if (rangeFromPath === undefined) {
			//	var dataObj = !!binding && !!binding.path && getValue(binding.path);
			//	var itemsLength = (!!dataObj && dataObj.length) || 0;
			//	rangeFromPath = {from:0, to:itemsLength}
			//}

			if (itemsBinding !== undefined){
				x.props[ITEMS_KEY] = !!itemsBinding.path?getValue(itemsBinding.path):undefined;
			}

			//var itemsLength = (x.props[ITEMS_KEY] && x.props[ITEMS_KEY].length) || 0;
			//
			//traverse(x.props).forEach(function (y) {
			//	//TODO: simple solution for demonstration purposes
			//	if (this.key === "binding") {
			//		//y.length =itemsLength;
			//		y.range = {from:0, to:itemsLength};
			//	}
			//});
		}
	});
	//TODO: each step means its own recursion - optimize by doing all steps using one recursion
	
	//step -> remove invisible sections (containers)
	traverse(clonedSchema).forEach(function (x) {

		if (!!x && x.elementName === CONTAINER_NAME) {
			var visibilityProp = x.props && x.props[VISIBILITY_KEY];
			if (visibilityProp === false){

				//get parent
				var parent = this.parent;
				if (parent !== undefined) parent = parent.parent;
				if (parent !== undefined) parent = parent.node;

				//decrese the height of the parent container
				if (parent !== undefined && parent.style !== undefined) {
					var parentHeight = parseInt(parent.style.height, 10);
					var nodeHeight = parseInt(x.style.height, 10);
					if (!isNaN(nodeHeight) && !isNaN(parentHeight)) parent.style.height = parentHeight - nodeHeight;
				}

				//invisible section -> delete
				this.remove();
			}
		}
	});

	//step -> process repeatable sections (containers) - for each row - deep clone row template
	traverse(clonedSchema).forEach(function (x) {
		if (!!x && x.elementName === REPEATER_CONTAINER_NAME){
			var itemsProp = x.props && x.props[ITEMS_KEY];
			if(_.isArray(itemsProp)) {
				//for each row - deep clone row template
				var clonedRows = [];
				var range = {from:0,to: itemsProp.length}
				for (var i = range.from; i != range.to; i++) {

					var clonedRow = _.cloneDeep(x);
					clonedRow.elementName = CONTAINER_NAME;
					clonedRow.props[ITEMS_KEY] = undefined;
					//apply binding using square brackets notation
					//traverse(clonedRow).forEach(function (y) {
					//	//TODO: simple solution for demonstration purposes
					//	if (this.key === "path") {
					//		var lastIndex = binding.path.lastIndexOf('[');
                    //
					//		var arrayPath = lastIndex!==-1?binding.path.substr(0,lastIndex):binding.path;
					//		var rowExpression = arrayPath + "[" + i + "]." + y;
                    //
					//		this.update(rowExpression);
					//	}
					//});

					clonedRows.push(clonedRow);
				}

				//assign all cloned rows to parent section
				x.containers = clonedRows;
				x.boxes = [];

			}
		}
	});
	return clonedSchema;
}

export default bindToSchema;
