import Binder from 'react-binding/lib/MobxBinder';
var Freezer = require('freezer-js');
import * as _ from 'lodash';
import { initBindings } from "./../src/utils/bindToSchema";

var employeesSchema = require("./examples/employees.json");

const CONTAINER_PATH = ["containers", 0, "boxes"];
const EMPLOYEE_LENGTH_PATH = CONTAINER_PATH.concat([0, "props", "content"]);

describe('employees repeater binding', () => {
  describe('initialize', () => {

    it('render list of employees', () => {
      //setup
      var frozenSchema = new Freezer(employeesSchema);

      var dataContext = Binder.bindToState(employeesSchema.props.defaultData);
      var employees = Binder.bindArrayTo(dataContext, "Employees");
      var row = employees.items[0];


      //exec
      initBindings(frozenSchema, frozenSchema.get(), dataContext);


      //verify
      var newState = frozenSchema.get();

      expect(_.get(newState, EMPLOYEE_LENGTH_PATH)).toBe(1);


    });

  });

  describe('reactions', () => {
    it('render full name', (done) => {
      var doneFlag = false;
      var frozenSchema = new Freezer(employeesSchema);
      frozenSchema.on('update', (newState, oldState) => {
        //console.log(JSON.stringify(newState));

        if (doneFlag) {

          //verify
          expect(_.get(newState, EMPLOYEE_LENGTH_PATH)).toBe(2);

          done();
        }
      })


      var dataContext = Binder.bindToState(employeesSchema.props.defaultData);
      var employees = Binder.bindArrayTo(dataContext, "Employees");
      var row = employees.items[0];

      var person = Binder.bindTo(row, "Person");
      var firstName = Binder.bindTo(person, "FirstName");
      var lastName = Binder.bindTo(person, "LastName");

      var addresses = Binder.bindArrayTo(person,"Addresses");
      
      //exec
      initBindings(frozenSchema, frozenSchema.get(), dataContext);

      employees.add({ Person: { Addresses: [{Address:{}}] } });
      
      // var street = Binder.bindTo(addresses.items[1],"Address.Street");
      // street.value = "My Street";

      doneFlag = true;

    });
  });
});
