import { Template } from 'meteor/templating';
import { TasksCollection } from "../db/TasksCollection";

import './Task.html';


// this is called when the form inserts a task
// TODO - we have to make sure the new task is by default want, can and should
Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
/*     const want = target.want.value;
    const can = target.can.value;
    const should = target.should.value; */

/*     console.log(want);
    console.log(can);
    console.log(should); */

    // insert non-null text as tasks
    if (text != '') {
      // Insert a task into the collection
      Meteor.call('tasks.insert', text);
    }

    // Clear form
    target.text.value = '';
  }
});

Template.task.events({
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setIsChecked', this._id, !this.isChecked);        
      },
    'click .toggle-want'() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.want', this._id, !this.want);  
    },
    'click .toggle-can'() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.can', this._id, !this.can); 
      },
    'click .toggle-should'() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.should', this._id, !this.should); 
      },
    'click .delete'() {
        // TasksCollection.remove(this._id);
        Meteor.call('tasks.remove', this._id);
    },
});