import './nav.html'
import './nav.css'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

Template.nav.events({
    'click #login'(event){
      FlowRouter.go("/login");
    }
})