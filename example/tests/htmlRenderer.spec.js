"use strict";
var React = require('react');
var renderer = require('react-test-renderer');
var MobxBinder_1 = require("react-binding/lib/MobxBinder");
var HtmlRenderer_1 = require("../../src/HtmlRenderer");
var WidgetFactory_1 = require("../src/WidgetFactory");
var Freezer = require('freezer-js');
var bindToSchema_1 = require("./../src/utils/bindToSchema");
var personSchema = require("./examples/person.json");
var employeesSchema = require("./examples/employees.json");
describe('Html rendering', function () {
    describe('person', function () {
        //setup
        var frozenSchema = new Freezer(personSchema);
        var dataContext = MobxBinder_1.default.bindToState(personSchema.props.defaultData);
        it('schema renders correctly', function () {
            //setup
            bindToSchema_1.initBindings(frozenSchema, frozenSchema.get(), dataContext);
            var schema = frozenSchema.get();
            //exec
            var component = renderer.create(React.createElement(HtmlRenderer_1.default, { widgets: WidgetFactory_1.default, schema: schema, data: dataContext, pageOptions: schema.props && schema.props.pageOptions }));
            var tree = component.toJSON();
            //verify
            expect(tree).toMatchSnapshot();
        });
    });
    describe('employees', function () {
        //setup
        var frozenSchema = new Freezer(employeesSchema);
        var dataContext = MobxBinder_1.default.bindToState(employeesSchema.props.defaultData);
        it('schema renders correctly', function () {
            //setup
            bindToSchema_1.initBindings(frozenSchema, frozenSchema.get(), dataContext);
            var schema = frozenSchema.get();
            //exec
            var component = renderer.create(React.createElement(HtmlRenderer_1.default, { widgets: WidgetFactory_1.default, schema: schema, data: dataContext, pageOptions: schema.props && schema.props.pageOptions }));
            var tree = component.toJSON();
            //verify
            expect(tree).toMatchSnapshot();
        });
    });
});
