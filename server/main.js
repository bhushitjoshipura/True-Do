import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

/* const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';
const SECOND_USERNAME = 'test';
const SECOND_PASSWORD = 'password'; */

const insertTask = (taskText, user, isWanted, isCan, isShould) =>
  TasksCollection.insert({
    text: taskText,
    want: isWanted,
    can: isCan,
    should: isShould,
    userId: user._id,
    createdAt: new Date(),
  });
 
Meteor.startup(() => {

  // This is clean but it breaks the logout button and greeting in the title bar

/*   if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });   
  }

  if (!Accounts.findUserByUsername(SECOND_USERNAME)) {
    Accounts.createUser({
      username: SECOND_USERNAME,
      password: SECOND_PASSWORD,
    }); 
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME); */

/*   if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(taskText => insertTask(taskText, user, true, true, true));
  } */
});