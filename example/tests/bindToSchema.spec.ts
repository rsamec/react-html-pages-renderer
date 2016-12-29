import Binder from 'react-binding/lib/MobxBinder';
var Freezer = require('freezer-js');
import * as _ from 'lodash';

import { initBindings } from "./../src/utils/bindToSchema";

var personSchema = require("./examples/person.json");

const CONTAINER_PATH = ["containers", 1, "boxes"];
const FULL_NAME_CONTENT_PATH_CUSTOM_CONVERTER = CONTAINER_PATH.concat([0, "props", "content"]);
const FULL_NAME_CONTENT_PATH_SHARED_CONVERTER = CONTAINER_PATH.concat([1, "props", "content"]);

describe('person binding', () => {
  describe('initialize', () => {

    it('person schema has two containers', () => {
      var containers = personSchema.containers;
      expect(containers.length).toBe(2);
    });

    it('render full name', () => {

      //setup
      var frozenSchema = new Freezer(personSchema);

      var dataContext = Binder.bindToState(personSchema.props.defaultData);
      var person = Binder.bindTo(dataContext, "Person");
      var firstName = Binder.bindTo(person, "FirstName");
      var lastName =  Binder.bindTo(person, "LastName");

      //exec
      initBindings(frozenSchema, frozenSchema.get(), dataContext);


      //verify
      var newState = frozenSchema.get();

      expect(_.get(newState, FULL_NAME_CONTENT_PATH_CUSTOM_CONVERTER)).toBe("Roman Samec");
      expect(_.get(newState, FULL_NAME_CONTENT_PATH_SHARED_CONVERTER)).toBe("Roman Samec");

    });

  });

  describe('reactions', () => {
    it('render full name', (done) => {
      var doneFlag = false;
      var frozenSchema = new Freezer(personSchema);
      frozenSchema.on('update', (newState, oldState) => {
        //console.log(JSON.stringify(newState));

        if (doneFlag) {

          //verify
          expect(_.get(newState, FULL_NAME_CONTENT_PATH_CUSTOM_CONVERTER)).toBe("John Smith");
          expect(_.get(newState, FULL_NAME_CONTENT_PATH_SHARED_CONVERTER)).toBe("John Smith");

          done();
        }
      })

     var dataContext = Binder.bindToState(personSchema.props.defaultData);
      var person = Binder.bindTo(dataContext, "Person");
      var firstName = Binder.bindTo(person, "FirstName");
      var lastName =  Binder.bindTo(person, "LastName");

      //exec
      initBindings(frozenSchema, frozenSchema.get(), dataContext);

      firstName.value = "John";
      lastName.value = "Smith";
      doneFlag = true;

    });
  });
});
