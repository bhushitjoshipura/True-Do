import { Template } from 'meteor/templating';
import { TasksCollection } from "../db/TasksCollection";

import './Task.html';

Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
/*     TasksCollection.insert({
      text,
      userId: getUser()._id,
      createdAt: new Date(), // current time
    }); */

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  }
});

Template.task.events({
    'click .toggle-checked'() {
        // Set the checked property to the opposite of its current value
/*         TasksCollection.update(this._id, {
          $set: { isChecked: !this.isChecked },
        }); */
        Meteor.call('tasks.setIsChecked', this._id, !this.isChecked);        
      },
    'click .toggle-want'() {
        // Set the checked property to the opposite of its current value
/*         TasksCollection.update(this._id, {
          $set: { want: !this.want },
        }); */
        Meteor.call('tasks.setIsChecked', this._id, !this.want);  
    },
    'click .toggle-can'() {
        // Set the checked property to the opposite of its current value
/*         TasksCollection.update(this._id, {
          $set: { can: !this.can },
        }); */
        Meteor.call('tasks.setIsChecked', this._id, !this.can); 
      },
    'click .toggle-should'() {
        // Set the checked property to the opposite of its current value
/*         TasksCollection.update(this._id, {
          $set: { should: !this.should },
        }); */
        Meteor.call('tasks.setIsChecked', this._id, !this.should); 
      },
    'click .delete'() {
        // TasksCollection.remove(this._id);
        Meteor.call('tasks.remove', this._id);
    },
});

Template.task.events({
  'click .toggle-checked'() {
    Meteor.call('tasks.setIsChecked', this._id, !this.isChecked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});