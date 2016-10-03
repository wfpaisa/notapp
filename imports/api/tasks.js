import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';
 
export const Tasks = new Mongo.Collection('tasks');

// Publica la db
if (Meteor.isServer) {
  
  Meteor.publish('tasks', function tasksPublication() {
    
    return Tasks.find();

  });

}

// Meteor.startup(function () {
//   Tracker.autorun(function() {
//     console.log('cambio');
//   });

// });

Meteor.methods({
  // Nueva nota
  'tasks.insert'(data) {

    check(data, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Tasks.insert({
      data,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });

  },

  // Elimina una nota
  'tasks.remove'(taskId) {
    
    check(taskId, String);
    
    // evito el error  Uncaught Error: Must be attached
    // https://github.com/meteor/meteor/issues/2981#issuecomment-247613492
    if (!this.isSimulation) {
      Tasks.remove(taskId);
    }

  },

  // Actualiza una nota
  'tasks.setEdit'(taskId, setEdit) {

    check(taskId, String);
    check(setEdit, String);

    Tasks.update(taskId, { $set: { data: setEdit } });

  },

});


