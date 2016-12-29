"use strict";
var MobxBinder_1 = require("react-binding/lib/MobxBinder");
var Freezer = require('freezer-js');
var _ = require("lodash");
var bindToSchema_1 = require("./../src/utils/bindToSchema");
var personSchema = require("./examples/person.json");
var CONTAINER_PATH = ["containers", 1, "boxes"];
var FULL_NAME_CONTENT_PATH_CUSTOM_CONVERTER = CONTAINER_PATH.concat([0, "props", "content"]);
var FULL_NAME_CONTENT_PATH_SHARED_CONVERTER = CONTAINER_PATH.concat([1, "props", "content"]);
describe('person binding', function () {
    describe('initialize', function () {
        it('person schema has two containers', function () {
            var containers = personSchema.containers;
            expect(containers.length).toBe(2);
        });
        it('render full name', function () {
            //setup
            var frozenSchema = new Freezer(personSchema);
            var dataContext = MobxBinder_1.default.bindToState(personSchema.props.defaultData);
            var person = MobxBinder_1.default.bindTo(dataContext, "Person");
            var firstName = MobxBinder_1.default.bindTo(person, "FirstName");
            var lastName = MobxBinder_1.default.bindTo(person, "LastName");
            //exec
            bindToSchema_1.initBindings(frozenSchema, frozenSchema.get(), dataContext);
            //verify
            var newState = frozenSchema.get();
            expect(_.get(newState, FULL_NAME_CONTENT_PATH_CUSTOM_CONVERTER)).toBe("Roman Samec");
            expect(_.get(newState, FULL_NAME_CONTENT_PATH_SHARED_CONVERTER)).toBe("Roman Samec");
        });
    });
    describe('reactions', function () {
        it('render full name', function (done) {
            var doneFlag = false;
            var frozenSchema = new Freezer(personSchema);
            frozenSchema.on('update', function (newState, oldState) {
                //console.log(JSON.stringify(newState));
                if (doneFlag) {
                    //verify
                    expect(_.get(newState, FULL_NAME_CONTENT_PATH_CUSTOM_CONVERTER)).toBe("John Smith");
                    expect(_.get(newState, FULL_NAME_CONTENT_PATH_SHARED_CONVERTER)).toBe("John Smith");
                    done();
                }
            });
            var dataContext = MobxBinder_1.default.bindToState(personSchema.props.defaultData);
            var person = MobxBinder_1.default.bindTo(dataContext, "Person");
            var firstName = MobxBinder_1.default.bindTo(person, "FirstName");
            var lastName = MobxBinder_1.default.bindTo(person, "LastName");
            //exec
            bindToSchema_1.initBindings(frozenSchema, frozenSchema.get(), dataContext);
            firstName.value = "John";
            lastName.value = "Smith";
            doneFlag = true;
        });
    });
});
