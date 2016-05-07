import traverse from 'traverse';
import _ from 'lodash';
import Binder from 'react-binding';

var getArrayRange = ()=>{return undefined}
var getBindingValue = (dataBinder,path)=> {
	var binding = Binder.bindTo(dataBinder, path);
	return binding.value;
}
var trav = function(container,fce,depth){
	if (depth === undefined) depth =0;
	var containers = container.containers || [];
	fce(container,depth);
	depth++;
	for (var i=0;i!== containers.length;i++) {
		trav(containers[i],fce,depth);
	}
	
}
function bindToSchema(clonedSchema,dataBinder){

	const CONTAINER_NAME = "Container";
	const REPEATER_CONTAINER_NAME = "Repeater";
	const BOXES_COLLECTION_NAME = "boxes";
	
	const VISIBILITY_KEY = "visibility";
	const ITEMS_KEY = "binding";

	var getValue = _.curry(getBindingValue)(dataBinder);
	
	
	
	//step -> set section visibility (containers)
	trav(clonedSchema,function (x) {
		
		//if (!!x && x.elementName === CONTAINER_NAME) {
					
			//var visibilityProp = x.props && x.props[VISIBILITY_KEY];
			var visibilityBinding = x.bindings && x.bindings[VISIBILITY_KEY];
			
			if (visibilityBinding !== undefined){
				x.props[VISIBILITY_KEY] = !!visibilityBinding.path?getValue(visibilityBinding.path):undefined;					
			}
			
		//}
	});

	//step -> set repeatable sections (containers) -
	trav(clonedSchema,function (x) {
		if (x.elementName === REPEATER_CONTAINER_NAME) {
			//var itemsProp = x.props && x.props[ITEMS_KEY];
			var itemsBinding = x.bindings && x.bindings[ITEMS_KEY];

			if (itemsBinding !== undefined) {
				x.props[ITEMS_KEY] = !!itemsBinding.path ? getValue(itemsBinding.path) : undefined;
			}
		}
	});
	
	
	//TODO: each step means its own recursion - optimize by doing all steps using one recursion
	
	//step -> remove invisible sections (containers)
	traverse(clonedSchema).forEach(function (x) {

		if (!!x && (x.elementName === CONTAINER_NAME || x.elementName === "Grid" || x.elementName === "Cell")) {
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
					traverse(clonedRow).forEach(function (y) {
						//TODO: simple solution for demonstration purposes
						if (this.key === "bindings") {
							var props = this.parent.node.props;
							var bindings = y;
							_.each(bindings,function(bindingProps,key) {

								//binding with converter
								var converter;
								if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
									converter = eval(bindingProps.converter.compiled);

									if (typeof converter === 'string' || converter instanceof String){
										var	sharedConverter = dataBinder.customCode && dataBinder.customCode[converter];
										if (sharedConverter !== undefined) converter = sharedConverter;
									}
								}
								var wrapper = {state:{data:itemsProp[i]}};
								var binding = Binder.bindToState(wrapper,'data', bindingProps.path, converter, bindingProps.converterArgs);
								
								
								//simple binding without converter using lodash
								//var newValue = binding.value;
								//var newValue = _.get(itemsProp[i],binding.path);

								//console.log(key,binding.path + " -> " +  newValue)
								props[key] = binding.value;
							});

							this.update(undefined);
						}
					});

					clonedRows.push(clonedRow);
				}

				//assign all cloned rows to parent section
				this.parent.parent.node.containers = clonedRows;
				this.parent.parent.node.boxes = [];
			}
		}
	});

	//trav(clonedSchema,(x,d)=>{console.log("       ".slice(-d) + x.elementName + "(" + x.name + ")")})

	return clonedSchema;
}

export default bindToSchema;
