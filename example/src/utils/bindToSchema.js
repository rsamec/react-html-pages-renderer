"use strict";
var _ = require("lodash");
var MobxBinder_1 = require("react-binding/lib/MobxBinder");
var mobx_1 = require("mobx");
var CONTAINER_NAME = "Container";
var REPEATER_CONTAINER_NAME = "Repeater";
var BOXES_COLLECTION_NAME = "boxes";
var VISIBILITY_KEY = "visibility";
var ITEMS_KEY = "binding";
var ITEMS_INDEX_KEY = "index";
var Cursor = (function () {
    function Cursor(target, path) {
        this.target = target;
        this.path = path;
    }
    Cursor.prototype.set = function (propName, value) {
        var targetNode = this.getNodeByPath(this.path);
        if (targetNode === undefined)
            return;
        return targetNode.set(propName, value);
    };
    Cursor.prototype.get = function (propName) {
        var targetNode = this.getNodeByPath(this.path);
        if (targetNode === undefined)
            return;
        return targetNode[propName];
    };
    Cursor.prototype.getNodeByPath = function (path) {
        if (path === undefined || path.length === 0)
            return this.target.get();
        var targetNode = _.get(this.target.get(), path);
        return targetNode;
    };
    Cursor.prototype.newCursor = function (path) {
        if (this.path === undefined)
            return undefined;
        return new Cursor(this.target, this.path.concat(path));
    };
    return Cursor;
}());
function initBindings(freezer, frozenSchema, dataBinder, cursor) {
    if (frozenSchema === undefined)
        return;
    if (dataBinder === undefined)
        return;
    var ctx = (frozenSchema.props && frozenSchema.props && frozenSchema.props['context']) || {};
    var code = ctx['code'] && ctx['code'].compiled;
    if (!!code) {
        dataBinder.customCode = eval(code);
    }
    trav(frozenSchema, function (x, cursor) {
        //bind containers
        bindContainer(x, new Cursor(freezer, cursor), dataBinder);
        //bind boxes
        bindBoxes(x, cursor, dataBinder, freezer);
    }, cursor);
}
exports.initBindings = initBindings;
var trav = function (container, fce, cursor) {
    if (cursor === undefined)
        cursor = [];
    var containers = container.containers || [];
    fce(container, cursor);
    if (container.elementName === REPEATER_CONTAINER_NAME)
        return;
    cursor.push('containers');
    for (var i = 0; i !== containers.length; i++) {
        trav(containers[i], fce, cursor.concat([i]));
    }
};
var bindBoxes = function (x, cursor, dataBinder, freezer) {
    //bind boxes
    if (x.boxes === undefined || x.boxes.length === 0)
        return;
    var boxes = x.boxes;
    for (var i = 0; i != boxes.length; i++) {
        var box = boxes[i];
        //console.log(cursor.concat(["boxes", i]));
        var updated = box.props === undefined ? box.set('props', {}) : box;
        bindProps(updated, new Cursor(freezer, cursor.concat(["boxes", i, "props"])), dataBinder, false);
    }
};
var bindContainer = function (x, cursor, dataBinder) {
    var visibilityBinding = x.bindings && x.bindings[VISIBILITY_KEY];
    if (visibilityBinding !== undefined) {
        if (!!!visibilityBinding.path)
            return;
        var binding_1 = getBinding(dataBinder, visibilityBinding);
        var newCursor_1 = cursor.newCursor(["props"]);
        //create reaction when binding.value changed
        var setVisibilityReaction = function (val) { return newCursor_1.set(VISIBILITY_KEY, val); };
        //setVisibilityReaction(binding.value);
        mobx_1.reaction(function () { return binding_1.value; }, setVisibilityReaction, true);
    }
    if (x.elementName === REPEATER_CONTAINER_NAME) {
        cursor.set("containers", []);
        var itemsBinding = x.bindings && x.bindings[ITEMS_KEY];
        if (!!!itemsBinding.path)
            return;
        var binding_2 = getBinding(dataBinder, itemsBinding);
        var rowsToRemove = 1; // default is 1=the repetaer itself
        var lastRange = [];
        var repeaterReaction = function (dataLength) {
            var currentContainers = cursor.get("containers");
            if (currentContainers === undefined)
                return;
            var currentLength = currentContainers.length;
            if (currentLength === dataLength)
                return;
            //console.log("reaction Length: " + dataLength + " != " + currentLength);
            if (dataLength > currentLength) {
                //add rows				
                var range = { from: currentLength, to: dataLength };
                repeatContainers(range, x, cursor, binding_2);
            }
            else {
                //remove rows
                var rowsToRemove_1 = currentLength - dataLength;
                cursor.get("containers").splice(currentLength - rowsToRemove_1, rowsToRemove_1);
            }
        };
        //repeaterReaction(binding.value.length);
        mobx_1.reaction(function () { return binding_2.value.length; }, repeaterReaction, true);
    }
};
var repeatContainers = function (range, x, cursor, binding) {
    var clonedRows = [];
    //for each row - deep clone row template
    for (var i = range.from; i != range.to; i++) {
        var clonedRow = _.cloneDeep(x);
        clonedRow.elementName = CONTAINER_NAME;
        clonedRow.name = clonedRow.name + "." + i;
        clonedRow.props[ITEMS_KEY] = undefined;
        clonedRow.props[ITEMS_INDEX_KEY] = i;
        clonedRows.push(clonedRow);
    }
    var containers = cursor.get("containers");
    var updated = containers.splice.apply(containers, [range.from, 0].concat(clonedRows));
    var rootArrayBinding = MobxBinder_1.default.bindArrayTo(binding, undefined, binding.valueConverter);
    var dataItems = rootArrayBinding.items;
    for (var i = range.from; i != range.to; i++) {
        initBindings(cursor.target, updated[i], dataItems[i], cursor.path.concat(["containers", i]));
    }
};
var bindProps = function (box, cursor, dataBinder, isDesignMode) {
    if (box === undefined)
        return;
    var bindings = box.bindings;
    if (bindings === undefined)
        return;
    var props = box.props;
    if (props === undefined)
        return;
    var _loop_1 = function () {
        var bindingProps = bindings[propName];
        //if binding -> replace binding props
        if (bindingProps === undefined)
            return "continue";
        if (!!!bindingProps.path) {
            //binding is not correctly set - do not apply binding
            props[propName] = undefined;
            return "continue";
        }
        //apply binding		
        var binding = getBinding(dataBinder, bindingProps);
        if (!isDesignMode && (bindingProps.mode === 'TwoWay' || bindingProps.mode === 'OneTime')) {
            //apply two-way binding
            props.set("valueLink", binding);
        }
        //create reaction when binding.value changed
        var setValueReaction = function (val) { return cursor.set(propName, val); };
        // if (box.elementName === "Core.JsxContent" ){
        // 	reaction(() => _.clone(binding.value), setValueReaction, true);
        // }
        // else{
        //setValueReaction(binding.value);
        mobx_1.reaction(function () { return binding.value; }, setValueReaction, true);
        //}
    };
    //go through all properties
    for (var propName in bindings) {
        _loop_1();
    }
    return props;
};
var getBinding = function (dataBinder, bindingProps) {
    var converter;
    if (!!bindingProps.converter && !!bindingProps.converter.compiled) {
        converter = eval(bindingProps.converter.compiled);
        if (typeof converter === 'string' || converter instanceof String) {
            var sharedConverter = dataBinder.customCode && dataBinder.customCode[converter];
            if (sharedConverter === undefined)
                return;
            converter = sharedConverter;
        }
    }
    var binding = (bindingProps.mode === "OneTime") ? MobxBinder_1.default.bindArrayTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs) : MobxBinder_1.default.bindTo(dataBinder, bindingProps.path, converter, bindingProps.converterArgs);
    return binding;
};
