"use strict";
var MobxBinder_1 = require("react-binding/lib/MobxBinder");
var Freezer = require('freezer-js');
var _ = require("lodash");
var bindToSchema_1 = require("./../src/utils/bindToSchema");
var employeesSchema = require("./examples/employees.json");
var CONTAINER_PATH = ["containers", 0, "boxes"];
var EMPLOYEE_LENGTH_PATH = CONTAINER_PATH.concat([0, "props", "content"]);
describe('employees repeater binding', function () {
    describe('initialize', function () {
        it('render list of employees', function () {
            //setup
            var frozenSchema = new Freezer(employeesSchema);
            var dataContext = MobxBinder_1.default.bindToState(employeesSchema.props.defaultData);
            var employees = MobxBinder_1.default.bindArrayTo(dataContext, "Employees");
            var row = employees.items[0];
            //exec
            bindToSchema_1.initBindings(frozenSchema, frozenSchema.get(), dataContext);
            //verify
            var newState = frozenSchema.get();
            expect(_.get(newState, EMPLOYEE_LENGTH_PATH)).toBe(1);
        });
    });
    describe('reactions', function () {
        it('render full name', function (done) {
            var doneFlag = false;
            var frozenSchema = new Freezer(employeesSchema);
            frozenSchema.on('update', function (newState, oldState) {
                //console.log(JSON.stringify(newState));
                if (doneFlag) {
                    //verify
                    expect(_.get(newState, EMPLOYEE_LENGTH_PATH)).toBe(2);
                    done();
                }
            });
            var dataContext = MobxBinder_1.default.bindToState(employeesSchema.props.defaultData);
            var employees = MobxBinder_1.default.bindArrayTo(dataContext, "Employees");
            var row = employees.items[0];
            var person = MobxBinder_1.default.bindTo(row, "Person");
            var firstName = MobxBinder_1.default.bindTo(person, "FirstName");
            var lastName = MobxBinder_1.default.bindTo(person, "LastName");
            var addresses = MobxBinder_1.default.bindArrayTo(person, "Addresses");
            //exec
            bindToSchema_1.initBindings(frozenSchema, frozenSchema.get(), dataContext);
            employees.add({ Person: { Addresses: [{ Address: {} }] } });
            // var street = Binder.bindTo(addresses.items[1],"Address.Street");
            // street.value = "My Street";
            doneFlag = true;
        });
    });
});
