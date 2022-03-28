import './addUser.html'
import { Permissoes } from '../../api/permissoes/permissoes';
var generator = require('generate-password');


Template.addUser.onCreated(function (){
    Meteor.subscribe("permissoes");
})

Template.addUser.events({
    'click .addUser'(event) {
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
                    nome: nome,
                    cpf: cpf,
                    telefone: telefone,
                    matricula: mat
                },
                perfil: perfilId,
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

      
    }
})

Template.addUser.helpers({
    Permissoes(){
        var permissoes = Permissoes.find({})
        console.log(permissoes.fetch())
        return permissoes
    }
})