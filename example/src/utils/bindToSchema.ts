import * as _ from 'lodash';
import Binder from 'react-binding/lib/MobxBinder';
import { reaction } from 'mobx';

const CONTAINER_NAME = "Container";
const REPEATER_CONTAINER_NAME = "Repeater";
const BOXES_COLLECTION_NAME = "boxes";

const VISIBILITY_KEY = "visibility";
const ITEMS_KEY = "binding";
const ITEMS_INDEX_KEY = "index";

declare type CursorPath = Array<string | number>;

class Cursor<T> {

	constructor(public target: any, public path: CursorPath) { }

	set(propName: string, value: any) {

		var targetNode: T = this.getNodeByPath(this.path);
		if (targetNode === undefined) return;
		return targetNode.set(propName, value);
	}
	get(propName: string): any {
		var targetNode: T = this.getNodeByPath(this.path);
		if (targetNode === undefined) return;
		return targetNode[propName];
	}
	getNodeByPath(path: CursorPath): T {
		if (path === undefined || path.length === 0) return this.target.get();
		var targetNode: T = <T>_.get(this.target.get(), path);
		return targetNode;
	}

	newCursor(path: CursorPath) {
		if (this.path === undefined) return undefined;
		return new Cursor(this.target, this.path.concat(path));
	}

}

export function initBindings(freezer: any, frozenSchema: PTT.Container, dataBinder: any, cursor?: CursorPath) {
	
	if (frozenSchema === undefined) return;
	if (dataBinder === undefined) return;
	
	var ctx = (frozenSchema.props && frozenSchema.props && frozenSchema.props['context']) || {};
	var code = ctx['code'] && ctx['code'].compiled;
	if (!!code) {
		dataBinder.customCode = eval(code);
	}
	trav(frozenSchema, function (x, cursor) {

		//bind containers
		bindContainer(x, new Cursor<PTT.Container>(freezer, cursor), dataBinder);

		//bind boxes
		bindBoxes(x, cursor, dataBinder, freezer);

	}, cursor);
}
var trav = function (container: PTT.Container, fce: (currentNode: PTT.Container, cursor: CursorPath) => void, cursor?: CursorPath) {
	if (cursor === undefined) cursor = [];
	var containers = container.containers || [];
	fce(container, cursor);
	if (container.elementName === REPEATER_CONTAINER_NAME) return;
	cursor.push('containers');
	for (var i = 0; i !== containers.length; i++) {
		trav(containers[i], fce, cursor.concat([i]));
	}
}
var bindBoxes = (x: PTT.Container, cursor: CursorPath, dataBinder, freezer) => {
	//bind boxes
	if (x.boxes === undefined || x.boxes.length === 0) return;

	var boxes = x.boxes;
	for (var i = 0; i != boxes.length; i++) {
		var box = boxes[i];

		//console.log(cursor.concat(["boxes", i]));
		
		var updated =  box.props === undefined?box.set('props',{}):box;
		bindProps(updated, new Cursor<PTT.Node>(freezer, cursor.concat(["boxes", i, "props"])), dataBinder, false);
	}
}
var bindContainer = (x: PTT.Container, cursor: Cursor<PTT.Container>, dataBinder) => {

	var visibilityBinding = x.bindings && x.bindings[VISIBILITY_KEY];

	if (visibilityBinding !== undefined) {
		if (!!!visibilityBinding.path) return;

		let binding = getBinding(dataBinder, visibilityBinding);
		let newCursor = cursor.newCursor(["props"]);

		//create reaction when binding.value changed
		let setVisibilityReaction = (val) => newCursor.set(VISIBILITY_KEY,val);
		
		//setVisibilityReaction(binding.value);
		reaction(() => binding.value, setVisibilityReaction, true);

	}
    
	if (x.elementName === REPEATER_CONTAINER_NAME) {

		cursor.set("containers",[]);

		var itemsBinding = x.bindings && x.bindings[ITEMS_KEY];
		if (!!!itemsBinding.path) return;

		let binding = getBinding(dataBinder, itemsBinding);

		let rowsToRemove = 1; // default is 1=the repetaer itself
		var lastRange = [];
		
		let repeaterReaction = (dataLength) => {
			var currentContainers = cursor.get("containers");
			if (currentContainers === undefined) return;

			var currentLength = currentContainers.length;
			if (currentLength === dataLength) return;

			//console.log("reaction Length: " + dataLength + " != " + currentLength);

			if (dataLength > currentLength) {

				//add rows				
				let range = { from: currentLength, to: dataLength };
				repeatContainers(range,x,cursor,binding);

			}
			else {
				//remove rows
				let rowsToRemove = currentLength - dataLength;
				cursor.get("containers").splice(currentLength - rowsToRemove, rowsToRemove);
			}

		}
		//repeaterReaction(binding.value.length);
		reaction(() => binding.value.length, repeaterReaction, true)
	}
}
var repeatContainers = (range: { from: number, to: number },x:PTT.Container, cursor: Cursor<PTT.Container>,binding:any): void => {
	let clonedRows: PTT.Container[] = [];
	//for each row - deep clone row template
	for (let i = range.from; i != range.to; i++) {
		var clonedRow = _.cloneDeep(x);
		clonedRow.elementName = CONTAINER_NAME;
		clonedRow.name = clonedRow.name + "." + i;
		clonedRow.props[ITEMS_KEY] = undefined;
		clonedRow.props[ITEMS_INDEX_KEY] = i;

		clonedRows.push(clonedRow);
	}
	let containers = cursor.get("containers");
	var updated = containers.splice(range.from,0,...clonedRows);

	var rootArrayBinding = Binder.bindArrayTo(binding,undefined,binding.valueConverter);
	let dataItems = rootArrayBinding.items;

	for (let i = range.from; i != range.to; i++) {
		initBindings(cursor.target, updated[i], dataItems[i], cursor.path.concat(["containers", i]));
	}

}
var bindProps = (box: PTT.Node, cursor: Cursor<PTT.Node>, dataBinder: any, isDesignMode: boolean) => {
	if (box === undefined) return;

	let bindings = box.bindings;
	if (bindings === undefined) return;

	let props = box.props;
	if (props === undefined) return;

	//go through all properties
	for (var propName in bindings) {

		let bindingProps = bindings[propName];

		//if binding -> replace binding props
		if (bindingProps === undefined) continue;

		if (!!!bindingProps.path) {
			//binding is not correctly set - do not apply binding
			props[propName] = undefined;
			continue;
		}

		//apply binding		
		let binding = getBinding(dataBinder, bindingProps);

		if (!isDesignMode && (bindingProps.mode === 'TwoWay' || bindingProps.mode === 'OneTime')) {
			//apply two-way binding
			props.set("valueLink", binding);
		}
	
		//create reaction when binding.value changed
		let setValueReaction = (val) => cursor.set(propName, val);
		

		// if (box.elementName === "Core.JsxContent" ){
		// 	reaction(() => _.clone(binding.value), setValueReaction, true);
		// }
		// else{
			//setValueReaction(binding.value);
			reaction(() => binding.value, setValueReaction, true);
		//}
	}

	return props;
}
var getBinding = (dataBinder, bindingProps) => {
	var converter;
	if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
		converter = eval(bindingProps.converter.compiled);

		if (typeof converter === 'string' || converter instanceof String) {
			var sharedConverter = dataBinder.customCode && dataBinder.customCode[<any>converter];
			if (sharedConverter === undefined) return;
			converter = sharedConverter;
		}
	}

	let binding = (bindingProps.mode === "OneTime") ? Binder.bindArrayTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs) : Binder.bindTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs)

	return binding;
}