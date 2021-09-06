import { Template } from 'meteor/templating';
import { TasksCollection } from "../db/TasksCollection";
import './Task.html';

Template.form.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    isWanted: true,
    isCan: true,
    isShould: true
  });
});

// this is called when the form inserts a task
Template.form.events({
  "submit .task-form"(event, instance) {
    /* console.log('called'); */
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // instance is the form itself
    // so the reactive dictionary will apply to the form
    const isWanted = instance.state.get("isWanted");
    const isCan = instance.state.get("isCan");
    const isShould = instance.state.get("isShould");

    // insert non-null text as tasks
    if (text != '') {
      // Insert a task into the collection
      Meteor.call('tasks.insert', text, isWanted, isCan, isShould);
      /* console.log("inserted "+ text + "\nwant? " + isWanted + " can? " + isCan + " should? " + isShould); */
    }

    // Clear form
    // TODO- How can UI state change based on the default values of the is* items?
    target.text.value = '';
    instance.state.setDefault({
      isWanted: true,
      isCan: true,
      isShould: true
    });
  },
  'click .update-want'(event, instance) {
    // Get value from form element
    // while target is the checkbox, instance is the form itself
    // so the reactive dictionary will apply to the form
    const value = event.target.checked;
    // set the state of isWanted
    instance.state.set("isWanted", value);
    /* console.log('want UI said '+ value +' set to be '+ instance.state.get("isWanted", value)); */
  },

  'click .update-can'(event, instance) {
    // Get value from form element
    // while target is the checkbox, instance is the form itself
    // so the reactive dictionary will apply to the form
    const value = event.target.checked;
    // set the state of isWanted
    instance.state.set("isCan", value);
    /* console.log('can UI said '+ value +' set to be '+ instance.state.get("isCan", value)); */
  },

  'click .update-should'(event, instance) {
    // Get value from form element
    // while target is the checkbox, instance is the form itself
    // so the reactive dictionary will apply to the form
    const value = event.target.checked;
    // set the state of isWanted
    instance.state.set("isShould", value);
    /* console.log('should UI said '+ value +' set to be '+ instance.state.get("isShould", value)); */
  }
});

Template.task.events({
  'click .toggle-checked'() {
      // update the checked property to the opposite of its current value
      Meteor.call('tasks.updateIsChecked', this._id, !this.isChecked);        
    },
  'click .toggle-want'(event) {
      /* console.log('sent '+event.target.checked); */
      Meteor.call('tasks.updateWant', this._id, event.target.checked);  
  },
  'click .toggle-can'(event) {
    /* console.log('sent '+event.target.checked); */
    Meteor.call('tasks.updateCan', this._id, event.target.checked); 
  },
  'click .toggle-should'(event) {
    /* console.log('sent '+event.target.checked); */
    Meteor.call('tasks.updateShould', this._id, event.target.checked ); 
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});