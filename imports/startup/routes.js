import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

FlowRouter.route('/', {
    action() {
        BlazeLayout.render("home");
      },
    
  });


  FlowRouter.route('/login', {
    action() {
        BlazeLayout.render("login");
      },
    
  });

  FlowRouter.route('/marcarconsulta', {
    action() {
        BlazeLayout.render("menu",{content:"marcarConsulta"});
      },
    
  });

  FlowRouter.route('/perfil', {
    action() {
        BlazeLayout.render("menu",{content:"perfil"});
      },
    
  });