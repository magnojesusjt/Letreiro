import './gerenciarUsers.html'
import { Meteor } from 'meteor/meteor';
import { Permissoes } from '../../api/permissoes/permissoes';
import swal from 'sweetalert';
import { ReactiveVar } from 'meteor/reactive-var';


Template.gerenciarUsers.helpers({
  users(){
      return Meteor.users.find({}).fetch()
  },
  Permissoes(){
    var permissoes = Permissoes.find({})
    return permissoes
  },
  detalhesUser(){
    const instance = Template.instance();    
    return instance.detalhesUser.get()
  },
  selected: function(){
    const instance = Template.instance();
    var user = instance.detalhesUser.get()
    Session.set("perfilSelecionado",user.profile.perfil)
    return Session.equals('perfilSelecionado', this.perfil) ? 'selected' : '';
  },
  settings: function () {
    return {
        rowsPerPage: 25,
        showNavigation: 'auto',
        showColumnToggles: false,
        showFilter: true,
        fields: [
            { key: 'username', label: 'Login' },
            { key: 'profile.data.name', label: 'Nome' },
            { key: 'emails.0.address', label: 'Email' },
            { key: 'profile.data.telefone', label: 'Telefone' },
            { key: 'profile.data.cpf', label: 'CPF' },
            { key: 'profile.perfil', label: 'perfil' },
            {
                key: 'selecionarUsuario',
                label:'',
                fn: function (value) {
                    // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                    return new Spacebars.SafeString("<button id='btnViewUsuario' class='btn btn-primary' title='Detalhes'>Detalhes</button>");
                }
            },
            {
                key: 'delUser',
                label:'',
                fn: function (value) {
                    // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                    return new Spacebars.SafeString("<button type='button' id='btnDesUser' class='btn btn-danger' title='Desativar Usuário'>Desativar</button>");
                }
            }
        ]
    }
}
})

Template.gerenciarUsers.onCreated(function (){
    Meteor.subscribe('users');
    Meteor.subscribe("permissoes");
    i18n.setLanguage('pt-br');

    this.detalhesUser = new ReactiveVar([])

})

Template.gerenciarUsers.events({
    'click #tableUsers tbody tr'(event){
        switch(event.target.id){
            case 'btnViewUsuario':
                const instance = Template.instance();

                var _id = this._id;

                var user = Meteor.users.find({_id}).fetch()

                instance.detalhesUser.set(user[0])
                $('#modalDetalhesUsuario').modal('show')
               break
        }
    },
    
    'click #adicionarUsuario'(event){
        event.preventDefault();

        swal({
            title: "Deseja adcionar esse usuário?",
            icon: "warning",
            buttons: ["Não", "Sim"],
        })
        .then((willDelete) => {
            if (willDelete) {
                let mat = document.getElementById('matricula').value;
                let nome = document.getElementById('nome').value;
                let cpf = document.getElementById('cpf').value;
                let telefone = document.getElementById('telefone').value;
                let email = document.getElementById('email').value;
                let perfil = document.getElementById('cargo');
                let perfilId = perfil.options[perfil.selectedIndex].value;
                if(mat && nome && cpf && telefone && email && perfilId){
                    const usuario = {
                        username: email,
                        email: email,
                        // password: generator.generate({length:10, numbers: true}),
                        password: 'Magno123',
                        profile:{
                            data: {
                                name: nome,
                                cpf: cpf,
                                telefone: telefone,
                                matricula: mat
                            },
                            perfil: perfilId,
                            active: true
                        }
                    }
                    Meteor.call('criarUsuario',usuario,function(error){
                        if(!error){
                            swal({
                                title: "Conta criada!",
                                text: "Sua conta foi criada com sucesso!",
                                icon: "success",
                              });
                            }else{
                            swal({
                                title: "Erro!",
                                text: `${error}`,
                                icon: "error",
                              });
                        }
                    })

                }else{
                    swal({
                        title: "Preencha todos os campos!",
                        icon: "error"
                    })
                }
            } else {
             
            }
          });
    },
    'click .obterDados'(event){
        event.preventDefault();
        const instance = Template.instance();

        var _id = event.target.dataset.id;

        var user = Meteor.users.find({_id}).fetch()

        instance.detalhesUser.set(user[0])
    }
})

