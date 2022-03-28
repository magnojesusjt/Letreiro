import { FlowRouter } from 'meteor/ostrio:flow-router-extra'

FlowRouter.route('/', {
    action() {
        BlazeLayout.render("login");
      },
    
  });


  FlowRouter.route('/login', {
    action() {
        BlazeLayout.render("login");
      },
    
  });

  FlowRouter.route('/marcarconsulta', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"marcarConsulta"});
      },
    
  });

  FlowRouter.route('/agenda', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"agenda"});
      },
    
  });

  FlowRouter.route('/marcarhorario', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"marcarhorario"});
      },
    
  });

  FlowRouter.route('/perfil', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"perfil"});
      },
    
  });

  FlowRouter.route('/adicionarUsuario', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"addUser"});
      },
    
  });

  FlowRouter.route('/gerenciamentodeusuarios', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"gerenciarUsers"});
      },
    
  });

  FlowRouter.route("/logout", {
    name: "logout",
    action() {
      swal({
        title: "Encerrar Sessão?",
        icon: "warning",
        buttons: ["Não", "Sim"],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal("Sessão encerrada com sucesso!", {
            icon: "success",
          });
          Accounts.logout();
          FlowRouter.go("/");
        } else {
          FlowRouter.go(FlowRouter._current.oldRoute.path);
        }
      });
    },
  });
  

  function checkUsuarioLoggedIn(ctx, redirect) {
    if (!Meteor.userId()) {
        redirect('/login');
    }
}
