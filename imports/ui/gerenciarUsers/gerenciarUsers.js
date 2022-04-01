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
    return Session.equals('perfilSelecionado', this._id) ? 'selected' : '';
  }
})

Template.gerenciarUsers.onCreated(function (){
    Meteor.subscribe('users');
    Meteor.subscribe("permissoes");

    this.detalhesUser = new ReactiveVar([])

})

Template.gerenciarUsers.events({
    'click #abrirModal'(event){
        event.preventDefault();
        Modal.show("adicionarUser");
    },
    'click #adicionarUsuario'(event){
        event.preventDefault();

        swal({
            title: "Tem certeza que quer adcionar esse usuário?",
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