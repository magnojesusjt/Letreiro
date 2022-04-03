import { Meteor } from 'meteor/meteor';
import './menu.css'
import './menu.html'

import moment from 'moment';


Template.menu.onCreated(function(){
    const relogio = () =>  {
        var data = new Date();
        var hor = data.getHours();
        var min = data.getMinutes();
        var seg = data.getSeconds();
    
        if (hor < 10) {
          hor = "0" + hor;
        }
        if (min < 10) {
          min = "0" + min;
        }
        if (seg < 10) {
          seg = "0" + seg;
        }
    
        var horas = hor + ":" + min;
        
        document.getElementById("rel").innerText = horas;    
      }
      
      this.dia = new ReactiveVar(new Date());
    
      
      
      setInterval(relogio, 1000);
    
})

Template.menu.helpers({
    user() {
        return Meteor.user()
    },

    data(){
        const data = new Date()
        console.log(data)
        return moment(data).format('DD-MM-YYYY')
    },

    gerenciarUsuarios(){
      if(Meteor.user().profile.perfil === 'Administrador' || Meteor.user().profile.perfil === 'Suporte'){
        return true
      }
       return false
    },
    gerenciarLetreiro(){
      if(Meteor.user().profile.perfil === 'Atendente'){
        return true
      }
       return false
    },
    gerenciarDash(){
        if(Meteor.user().profile.perfil === 'Administrador' ){
          return true
        }
         return false
    },
    gerenciarPerfil(){
      if(Meteor.user().profile.perfil === 'Cliente' || Meteor.user().profile.perfil === 'Dentista' || Meteor.user().profile.perfil === 'Suporte' || Meteor.user().profile.perfil === 'Administrador' || Meteor.user().profile.perfil === 'Atendente'){
        return true
      }
       return false
    },
    gerenciarAbrirChamado(){
      if(Meteor.user().profile.perfil === 'Cliente' || Meteor.user().profile.perfil === 'Dentista' || Meteor.user().profile.perfil === 'Administrador' || Meteor.user().profile.perfil === 'Atendente'){
        return true
      }
       return false
    },
    gerenciarChamado(){
      if(Meteor.user().profile.perfil === 'Suporte'){
        return true
      }
       return false
    },
    gerenciarMarcarConsultaCliente(){
      if(Meteor.user().profile.perfil === 'Cliente' ){
        return true
      }
       return false
    },
    gerenciarMarcarConsulta(){
      if(Meteor.user().profile.perfil === 'Atendente'){
        return true
      }
       return false
    },
    gerenciarConsultasAgendadas(){
      if(Meteor.user().profile.perfil === 'Cliente'){
        return true
      }
       return false
    },
    gerenciarConsultasAgendadasDentista(){
      if(Meteor.user().profile.perfil === 'Dentista' ){
        return true
      }
       return false
    },
    gerenciarConsultasAgendadasAtendente(){
      if(Meteor.user().profile.perfil === 'Atendente'){
        return true
      }
       return false
    },
    gerenciarDispobinilizar(){
      if(Meteor.user().profile.perfil === 'Dentista' ){
        return true
      }
       return false
    }
    
})