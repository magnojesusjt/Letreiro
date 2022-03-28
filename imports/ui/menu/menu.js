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
        return Meteor.user().profile.data.name
    },

    data(){
        const data = new Date()
        console.log(data)
        return moment(data).subtract(10, 'days').calendar()
    }
})