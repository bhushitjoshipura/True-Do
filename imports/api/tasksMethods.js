import { check } from 'meteor/check';
import { TasksCollection } from '/imports/db/TasksCollection';
 
Meteor.methods({
  'tasks.insert'(text, isWanted, isCan, isShould) {
    check(text, String);
    check(isWanted, Boolean);
    check(isCan, Boolean);
    check(isShould, Boolean);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.insert({
      text,
      want: isWanted,
      can: isCan,
      should: isShould,
      createdAt: new Date,
      userId: this.userId,
    })
  },
 
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }
 
    TasksCollection.remove(taskId);
  },
 
  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }
 

    // This is creating and setting (or setting if already existed) "isChecked" - to true
    // "isChecked" wasn't there at all in the beginning
    TasksCollection.update(taskId, { 
      $set: {isChecked} 
    });
  },

  'tasks.setWant' (taskId, isWanted) {
    check(taskId, String);
    check(isWanted, Boolean);
    console.log('received '+isWanted);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }
 
    TasksCollection.update(taskId, { 
      $set: {want: isWanted}
    });
  },

  'tasks.setCan' (taskId, isCan) {
    check(taskId, String);
    check(isCan, Boolean);
    console.log('received '+isCan);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }
 
    TasksCollection.update(taskId, { 
      $set: {can: isCan}
    });
  },

  'tasks.setShould' (taskId, isShould) {
    check(taskId, String);
    check(isShould, Boolean);
    console.log('received '+isShould);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }
 
    TasksCollection.update(taskId, { 
      $set: {should: isShould}
    });
  },

});
