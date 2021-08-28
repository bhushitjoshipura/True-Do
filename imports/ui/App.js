import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from "../db/TasksCollection";
import { ReactiveDict } from 'meteor/reactive-dict';
import './App.html';
import './Login.js';
import './Task.js';


const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';
const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const HIDE_COMPLETED_STRING = "hideCompleted";
const IS_LOADING_STRING = "isLoading";

const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
}

Template.mainContainer.onCreated(function mainContainerOnCreated() {
    this.state = new ReactiveDict();

    // Tracker.autorun run a function now and rerun it later whenever its dependencies change
    const handler = Meteor.subscribe('tasks');
    Tracker.autorun(() => {
      this.state.set(IS_LOADING_STRING, !handler.ready());
    });

  });

Template.mainContainer.helpers({
/*   tasks1() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  }, */
  isUserLogged() {
    return isUserLogged();
  },
/*   tasks() {
    const instance = Template.instance();
    
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    const hideCompletedFilter = { isChecked: { $ne: true } };

    return TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch();
  }, */
  tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) {
      return [];
    }

    return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
      sort: { createdAt: -1 },
    }).fetch();
  },


  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  }, 
/*   incompleteCount() {
    const incompleteTasksCount = TasksCollection.find({ isChecked: { $ne: true } }).count();

    // TODO - how do I move the following string into HTML? It doesn't belong here in JS
    return incompleteTasksCount ? `(${incompleteTasksCount})` : "All Done!";
  }, */ 
  incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },

  // useful part of getUser() is username, which is used in the template
  getUser() {
    return getUser();
  },
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  },
});

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {

      // TODO - If a task is "Completed" and the filter turns from "Show Incomplete" to "Show All", 
      // the task checkbox doesn't reflect the completed status, creating confusion

      const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
      instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },
  'click .user'() {
    Meteor.logout();
  },
});

