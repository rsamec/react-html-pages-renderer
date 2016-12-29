
var React = require('react');
var renderer = require('react-test-renderer');
import Binder from 'react-binding/lib/MobxBinder';

import HtmlRenderer from '../../src/HtmlRenderer';
import Widgets from '../src/WidgetFactory';
var Freezer = require('freezer-js');
import * as _ from 'lodash';

import { initBindings } from "./../src/utils/bindToSchema";

var personSchema = require("./examples/person.json");
var employeesSchema = require("./examples/employees.json");

describe('Html rendering', () => {

  describe('person', () => {

    //setup
    let frozenSchema = new Freezer(personSchema);
    let dataContext = Binder.bindToState(personSchema.props.defaultData);

    it('schema renders correctly', () => {
      
      //setup
      initBindings(frozenSchema,frozenSchema.get(),dataContext);
      
      var schema = frozenSchema.get();
      //exec
      const component = renderer.create(
        React.createElement(HtmlRenderer, { widgets: Widgets, schema: schema, data: dataContext, pageOptions: schema.props && schema.props.pageOptions })
      );
      let tree = component.toJSON();

      //verify
      expect(tree).toMatchSnapshot();
    });
  });

  describe('employees', () => {

    //setup
    let frozenSchema = new Freezer(employeesSchema);
    let dataContext = Binder.bindToState(employeesSchema.props.defaultData);

    it('schema renders correctly', () => {
      
      //setup
      initBindings(frozenSchema,frozenSchema.get(),dataContext);
      
      var schema = frozenSchema.get();
      //exec
      const component = renderer.create(
        React.createElement(HtmlRenderer, { widgets: Widgets, schema: schema, data: dataContext, pageOptions: schema.props && schema.props.pageOptions })
      );
      let tree = component.toJSON();

      //verify
      expect(tree).toMatchSnapshot();
    });
  });
});
