import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './body.html';
import './task.js';


// State contendra un diccionario reactivo
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

// Asigno a tasks todas las tareas.
Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});


Template.body.events({
  
  // Al guardar -Control + S-  or  -Command + S- (mac)
  'keydown #newTaskDescription'(e){
    
    if( (e.keyCode === 83 && e.ctrlKey) || (e.keyCode === 83 && e.metaKey) ){
      e.preventDefault(); 
			

			// Insert a task into collection
			Tasks.insert({
				title: $("#newTaskTitle").val(),
				description: e.target.value,
				owner: Meteor.userId(),
      	username: Meteor.user().username,
				createdAt: new Date(), // current time
			});

			// Clear textarea 'newTaskDescription'
			$("#newTaskTitle").val('');
			e.target.value = '';
      
    }
  },

  // Ocultar tasks
  'change .hide-completed'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});

