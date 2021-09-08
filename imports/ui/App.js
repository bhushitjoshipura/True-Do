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
const SORTING_STRATEGY_STRING = "sortingStrategy";
const IS_LOADING_STRING = "isLoading";

// this returns Mongo query strings to be used by mainContainer/tasks for list display
const getTasksFilter = () => {
  // user related filter - don't want to show other users' tasks
  const user = getUser();
  const userFilter = user ? { userId: user._id } : {};

  // ... and depending on whethe we need to show completed tasks, another filter kicks in
  const hideCompletedFilter = { isChecked: { $ne: true } };

  // return two filters - this seems JS syntax quirk of returning two items 
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };
  return { userFilter, pendingOnlyFilter };
}

// When main container is created
// 1. declare necessary Reactive elements
// 2. make sure it autoruns when handler is ready
Template.mainContainer.onCreated(function mainContainerOnCreated() {
    // mainContainer is definitely reactive trigger
    this.state = new ReactiveDict();

    // Tracker.autorun run a function now and rerun it later whenever its dependencies change
    const handler = Meteor.subscribe('tasks');
    Tracker.autorun(() => {
      this.state.set(IS_LOADING_STRING, !handler.ready());
    });

  });

Template.mainContainer.helpers({
  // returns a boolean whether the page is loading
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  },
  
  //------------------- User Related -------------------

  // determine if the user is logged at all
  isUserLogged() {
    return isUserLogged();
  },

  // get user name, if logged in
  // useful part of getUser() is username, which is used in the template
  // defined here because global getUser() can't be used as a part of the template?
  getUser() {
    if (getUser()) return getUser();
    else return false;
  },

  getEmail() {
    console.log(getUser().emails[0].address);
    return getUser().emails[0].address;
  },

  //------------------- Task List Related -------------------
  // whether the state of the main container is hiding completed string or not
  // Necessary because html refers to main container's "#if hideCompleted" to change the state of button
  hideCompleted() {
    //console.log(e.stack);
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  }, 

  // Must return a list of tasks meeting filters and sorting criteria
  // used as main container's "#each task"
  // this is the implementation of the {{# each tasks}} {{/each}}
  tasks() {
    // no login, no tasks displayed
    if (!isUserLogged()) {
      return [];
    }

    // otherwise on this main container
    const instance = Template.instance();
    // determine whether completed tasks are to be displayed
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    // and get which user we are talking about
    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    // now mood sorting
    // if mood is specified, sort by the mood, else (in the beginning) by latest added first

    sortingOrder = instance.state.get(SORTING_STRATEGY_STRING);
    /* console.log(sortingOrder); */

    // and depending on the UI state of hideCompleted, return the list of tasks
    return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
      sort: sortingOrder,
    }).fetch();
  },

  // to be displayed in the header
  incompleteCount() {
    // Show nothing if the user isn't even logged in
    if (!isUserLogged()) {
      return '';
    }

    // else
    // get states of userFilter and hideCompletedFilter
    // count number of tasks that match the filter
    // return the count to be displayed as "{{incompleteCount}}"
    const { pendingOnlyFilter } = getTasksFilter();
    const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },
});

Template.mainContainer.events({

  // Upon "Hide Completed" button
  "click #hide-completed-button"(event, instance) {

      // TODO - If a task is "Completed" and the filter turns from "Show Incomplete" to "Show All", 
      // the task checkbox doesn't reflect the completed status, creating confusion

      // 1. Get the state of the button
      const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
      // 2. Toggle the state of the button
      instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },

  // Clicking the name of the user must logout
  'click .user'() {
    Meteor.logout();
  },

  'click #reckless-button'(event, instance) {
    /* console.log('reckless'); */
    /* instance.state.set(SORTING_STRATEGY_STRING, 'reckless'); */
    instance.state.set(SORTING_STRATEGY_STRING, {want:-1, can:-1, should:-1});
  },

  'click #indulgent-button'(event, instance) {
    /* console.log('indulgent'); */
    instance.state.set(SORTING_STRATEGY_STRING, {want:-1, should:-1, can:-1});
  },

  'click #candid-button'(event, instance) {
    /* console.log('candid'); */
    instance.state.set(SORTING_STRATEGY_STRING, { can:-1, want:-1, should:-1 });
  },

  'click #sincere-button'(event, instance) {
    /* console.log('sincere'); */
    instance.state.set(SORTING_STRATEGY_STRING, { can:-1, should:-1, want:-1 });
  },

  'click #alive-button'(event, instance) {
    /* console.log('alive'); */
    instance.state.set(SORTING_STRATEGY_STRING, { should:-1, want:-1, can:-1  });
  }, 

  'click #wise-button'(event, instance) {
    /* console.log('wise'); */
    instance.state.set(SORTING_STRATEGY_STRING, { should:-1, can:-1, want:-1 });
  }, 

  'click #vengeful-button'(event, instance) {
    /* console.log('wise'); */
    instance.state.set(SORTING_STRATEGY_STRING, { createdAt: 1 });
  }, 

  'click #quick-button'(event, instance) {
    /* console.log('wise'); */
    instance.state.set(SORTING_STRATEGY_STRING, { createdAt: -1 });
  }, 
});