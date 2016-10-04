import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';



// Permite crear una variable reactiva por cada instancia 
// import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
 
// Template de la tarea
import './task.html';

Template.task.onCreated(function taskOnCreated() {

	// Almacena los posibles estados de cada nota
  this.state = new ReactiveDict();
  this.state.set('editing', false);
});



// Asigno a tasks todas las tareas.
Template.task.helpers({
  editing() {
    return Template.instance().state.get('editing');
  },

	session(){
		// Asigno el foco a la instancia
		var tmpl = Template.instance();

		// revisar cambios, si se a realizado un cambio
		// en alguna otra instancia
		if (tmpl.view.isRendered) {
			if(this.task.data != tmpl.$('.data').html()){
				tmpl.$('.data').html(this.task.data)	
			}
		}
		

		// Tarea que se esta editando
		if(Session.get('currentTask') === this.index){
						
			// Compruebo que exista una instancia, de lo contrario
			// sacaria un error antes de renderizar
			if (tmpl.view.isRendered) {
				tmpl.$('.data').focus()	
			}

			return true
		}
    	
    return false
  },

	// // Debido a que en el momento de guardar el sistema duplica datos (los inyectados mas 
	// // los que en el momento se escriben) por eso actualizo el div completo con su contenido
 //  editable(){
 //  	return '<div class="data" contenteditable="true">' + this.task.data + '</div>';
 //  },

});



Template.task.events({

  // Elimina
  'click .delete'() {
    Meteor.call('tasks.remove', this.task._id);
  },
  
  // Editando la nota
  'click .edit'(e, tpl) {  
  	e.preventDefault();
  	tpl.state.set('editing', !tpl.state.get('editing'));
   	
  },

  // Guardar
  'keydown .collection-item'(e, tpl){
  	
    if( (e.keyCode === 83 && e.ctrlKey) || (e.keyCode === 83 && e.metaKey) ){
    	
    	e.preventDefault();

    	let dataToSave = tpl.$('.data').html();
    	// let dataToSave = tpl.$('.data').val();
    	// console.log(dataToSave);
    	

			Meteor.call('tasks.setEdit', this.task._id, dataToSave, function(err, data){
				if(err) return err

				//console.log('datos actualizados: ')
			} );
			
			tpl.$('.collection-item').removeClass('item-editing');
      
    }
  },

  // Habilitar el foco al div data al hacer click en cualquier parte
  'click .collection-item'(e, tpl){
  	//tpl.$('.data').focus();
  	Session.set("currentTask", this.index);
  },
	
	// Segun el foco lo asigno a la instancia actual
  'focus .data'(e, tpl){
  	Session.set("currentTask", this.index);
  },

  'input .data'(e, tpl){
  	// console.log('change:', this.index)
  	tpl.$('.collection-item').addClass('item-editing');
  }

});




// Dropdown
Template.task.onRendered(function () {
	
	let element = this;
	// Asigno el valor por medio de jquery porque el reactivy
	// genera contenido duplicado con los contentedit
	this.$('.data').html( this.data.task.data );
	

})

