'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactBinding = require('react-binding');

var _reactBinding2 = _interopRequireDefault(_reactBinding);

var getArrayRange = function getArrayRange() {
	return undefined;
};
var getBindingValue = function getBindingValue(dataBinder, bindingProps) {
	var converter = !!bindingProps.converter && !!bindingProps.converter.compiled ? eval(bindingProps.converter.compiled) : undefined;
	var binding = _reactBinding2['default'].bindTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs);
	return binding.value;
};
var trav = function trav(container, fce, depth) {
	if (depth === undefined) depth = 0;
	var containers = container.containers || [];
	fce(container, depth);
	depth++;
	for (var i = 0; i !== containers.length; i++) {
		trav(containers[i], fce, depth);
	}
};

var bindProps = function bindProps(clonedProps, bindings, dataBinder, isDesignMode, prevDataState) {
	if (bindings === undefined) return;

	var props = clonedProps;

	//go through all properties
	for (var propName in bindings) {

		var bindingProps = bindings[propName];

		//if binding -> replace binding props
		if (bindingProps !== undefined) {

			//console.log(bindingProps.path);

			if (!!bindingProps.path) {

				//console.log(propName + " -> " + bindingProps.path);
				//apply binding
				var converter;
				if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
					converter = eval(bindingProps.converter.compiled);

					if (typeof converter === 'string' || converter instanceof String) {
						var sharedConverter = dataBinder.customCode && dataBinder.customCode[converter];
						if (sharedConverter === undefined) continue;
						converter = sharedConverter;
					}
				}

				var binding = _reactBinding2['default'].bindTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs);
				var currentValue = binding.value;
				if (prevDataState !== undefined) {
					var previousValue = _lodash2['default'].get(prevDataState, bindingProps.path);

					if (converter !== undefined) previousValue = converter.format(previousValue, bindingProps.converterArgs);
					if (_lodash2['default'].isEqual(currentValue, previousValue)) continue;
				}
				if (!isDesignMode && bindingProps.mode === 'TwoWay') {
					//two-way binding
					props.set("valueLink", binding);
					props.set(propName, null);
					//console.log(propName + " = " + props[propName]);
				} else {
						//one-way binding
						//box[propName] = dataBinder.value[prop.Path];
						props.set(propName, currentValue);
						//console.log(propName + " = " + props[propName]);
					}
			} else {
					//binding is not correctly set - do not apply binding
					//props[propName] = undefined;
				}
		}
	}
	return props;
};

function bindToSchema(clonedSchema, dataBinder) {

	var CONTAINER_NAME = "Container";
	var REPEATER_CONTAINER_NAME = "Repeater";
	var BOXES_COLLECTION_NAME = "boxes";

	var VISIBILITY_KEY = "visibility";
	var ITEMS_KEY = "binding";

	var getValue = _lodash2['default'].curry(getBindingValue)(dataBinder);

	//step -> set section visibility (containers)
	trav(clonedSchema, function (x) {

		//if (!!x && x.elementName === CONTAINER_NAME) {

		//var visibilityProp = x.props && x.props[VISIBILITY_KEY];
		var visibilityBinding = x.bindings && x.bindings[VISIBILITY_KEY];

		if (visibilityBinding !== undefined) {
			x.props.set(VISIBILITY_KEY, !!visibilityBinding.path ? getValue(visibilityBinding) : undefined);
		}

		//}
	});

	//step -> set repeatable sections (containers) -
	trav(clonedSchema, function (x) {
		if (x.elementName === REPEATER_CONTAINER_NAME) {
			//var itemsProp = x.props && x.props[ITEMS_KEY];
			var itemsBinding = x.bindings && x.bindings[ITEMS_KEY];

			if (itemsBinding !== undefined) {
				x.props.set(ITEMS_KEY, !!itemsBinding.path ? getValue(itemsBinding) : undefined);
			}
		}
	});

	//TODO: each step means its own recursion - optimize by doing all steps using one recursion

	//step -> remove invisible sections (containers)
	(0, _traverse2['default'])(clonedSchema).forEach(function (x) {

		if (!!x && (x.elementName === CONTAINER_NAME || x.elementName === "Grid" || x.elementName === "Cell")) {
			var visibilityProp = x.props && x.props[VISIBILITY_KEY];
			if (visibilityProp === false) {

				//get parent
				var parent = this.parent;
				if (parent !== undefined) parent = parent.parent;
				if (parent !== undefined) parent = parent.node;

				//decrease the height of the parent container
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
	(0, _traverse2['default'])(clonedSchema).forEach(function (x) {
		if (!!x && x.elementName === REPEATER_CONTAINER_NAME) {
			var itemsProp = x.props && x.props[ITEMS_KEY];
			if (_lodash2['default'].isArray(itemsProp)) {
				var _parentNode$containers;

				//for each row - deep clone row template
				var clonedRows = [];
				var range = { from: 0, to: itemsProp.length };
				for (var i = range.from; i != range.to; i++) {

					var clonedRow = _lodash2['default'].cloneDeep(x);
					clonedRow.elementName = CONTAINER_NAME;
					clonedRow.props[ITEMS_KEY] = undefined;

					//apply binding using square brackets notation
					(0, _traverse2['default'])(clonedRow).forEach(function (y) {
						//TODO: simple solution for demonstration purposes
						if (this.key === "bindings") {
							var props = this.parent.node.props;
							var bindings = y;
							_lodash2['default'].each(bindings, function (bindingProps, key) {

								//binding with converter
								var converter;
								if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
									converter = eval(bindingProps.converter.compiled);

									if (typeof converter === 'string' || converter instanceof String) {
										var sharedConverter = dataBinder.customCode && dataBinder.customCode[converter];
										if (sharedConverter !== undefined) converter = sharedConverter;
									}
								}
								var wrapper = { state: { data: itemsProp[i] } };
								var binding = _reactBinding2['default'].bindToState(wrapper, 'data', bindingProps.path, converter, bindingProps.converterArgs);

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
				var parentNode = this.parent.parent.node;
				var repeaterIndex = parentNode.containers.indexOf(this.node);
				var args = [repeaterIndex, 1].concat(clonedRows);
				if (repeaterIndex !== -1) (_parentNode$containers = parentNode.containers).splice.apply(_parentNode$containers, _toConsumableArray(args));

				//this.parent.parent.node.boxes = [];
			}
		}
	});

	//trav(clonedSchema,(x,d)=>{console.log("       ".slice(-d) + x.elementName + "(" + x.name + ")")})
	// trav(clonedSchema,function(x){
	//	
	// 	if (x.boxes !== undefined && x.boxes.length !== 0) {
	// 		var boxes = x.boxes;
	// 		for (var i=0;i!=boxes.length;i++) {
	// 			var box = boxes[i];
	// 			box.props = bindProps(box.props, box.bindings, dataBinder, false);
	// 		}
	// 	}
	// })

	return clonedSchema;
}

function refreshBind(frozenSchema, dataBinder, previousState) {

	//bindToSchema(frozenSchema,dataBinder);
	trav(frozenSchema, function (x) {

		if (x.boxes !== undefined && x.boxes.length !== 0) {
			var boxes = x.boxes;
			for (var i = 0; i != boxes.length; i++) {
				var box = boxes[i];
				bindProps(box.props, box.bindings, dataBinder, false, previousState);
			}
		}
	});
}

exports['default'] = bindToSchema;
exports.bindToSchema = bindToSchema;
exports.refreshBind = refreshBind;