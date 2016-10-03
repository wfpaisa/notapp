import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import './body.html';
import './task.js';


// State contendra un diccionario reactivo
Template.body.onCreated(function bodyOnCreated() {
  
  this.state = new ReactiveDict();
  
  Session.set("currentTask", 0);

  Meteor.subscribe('tasks');


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
  session(){
    return Session.get('currentTask');
  }
});


Template.body.events({
  
  // Al guardar -Control + S-  or  -Command + S- (mac)
  'keydown #newTaskDescription'(event){
		
    if( (event.keyCode === 83 && event.ctrlKey) || (event.keyCode === 83 && event.metaKey) ){
      event.preventDefault(); 
				
      // Insert a task into the collection
    	Meteor.call('tasks.insert', event.target.value);


			// Clear textarea 'newTaskDescription'
			$("#newTaskTitle").val('');
			event.target.value = '';
      
    }
  },
  // Ocultar tasks
  'change .hide-completed'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});


