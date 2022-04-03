import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';


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
      setTimeout(() => {
        if(Meteor.user().profile.perfil === 'Administrador' || Meteor.user().profile.perfil === 'Suporte'){
          BlazeLayout.render("menu",{content:"gerenciarUsers"});

        }
      }, 200);
      },
    
  });

  FlowRouter.route('/consultasagendadasdentista', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
      setTimeout(() => {
        if(Meteor.user().profile.perfil === 'Dentista'){
          BlazeLayout.render("menu",{content:"dentista"});

        }
      }, 500);
      },
    
  });

  FlowRouter.route('/gerenciarchamados', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"gerenciarChamado"});
      },
    
  });

  FlowRouter.route('/abrirchamado', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"abrirChamado"});
      },
    
  });

  FlowRouter.route('/dashboards', {
    triggersEnter: [checkUsuarioLoggedIn],
    action() {
        BlazeLayout.render("menu",{content:"dashBoards"});
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
