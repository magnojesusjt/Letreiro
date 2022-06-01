import './perfil.html'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import swal from 'sweetalert';

Template.perfil.onCreated(function (){

});

Template.perfil.helpers({
    user(){
        return Meteor.user()
    },
    facebook(){
        const profile = Meteor.user().profile

        return profile.facebook ? false : true
    }
})

Template.perfil.events({
    'click #atualizar'(event){
        event.preventDefault();
        swal({
            title: "Certeza que quer atualizar seus dados?",
            icon: 'warning',
            buttons: ["Não","Sim"],
            dangerMode: true

        }).then((sim)=>{
            if(sim){
                nome = document.getElementById('nomeCompleto').value
        cpf = document.getElementById('cpf').value
        telefone = document.getElementById('telefone').value
        
        if(nome !== '', cpf !== '', telefone !== ''){
           user = {
               _id : Meteor.userId(),
               profile : {
                   data:{
                       name : nome,
                       cpf : cpf,
                       telefone : telefone
                   }
               }
           }
            Meteor.call('updateUsuario', user,function(error){
                if(!error){
                    swal({
                        title: "Usuario atualizado!",
                        text: "Os seus dados foram atualizados com sucesso!",
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
        }
            }else{

            }
        })
        
    },
    'click #trocarSenha'(event){
        event.preventDefault();

        swal({
            title: "Atualizar senha?",
            icon: 'warning',
            buttons: ["Não","Sim"],
            dangerMode: true,
        }).then((sim)=>{
            if(sim){
                username = Meteor.user().username
        let properties = {
            passwordAtual: document.getElementById('senhaAtual').value,
            password: document.getElementById('novaSenha').value,
            password2: document.getElementById('confirmaSenha').value

        };


        Meteor.loginWithPassword(username, properties.passwordAtual, function (error) {
        if(error){
            swal({
                title: "Senha atual não confere!",
                icon: "warning",
              });
        }else{
                swal({
                    title: "Mudar Senha?",
                    icon: "warning",
                    buttons: ["Não", "Sim"],
                    dangerMode: true,
                  }).then((willDelete) =>{
            if(willDelete){
                if(properties.password == properties.password2 ){
                    Meteor.call('trocarSenha',properties.password, function(error) {
                        if(error){
                            swal("Erro ao alterar senha.", {
                                icon: "warning",
                              });
                        }else{
                            Accounts.logout();
                            FlowRouter.go("/login");
                            swal("Senha alterada com sucesso.", {
                                icon: "success",
                              });
                        }
                    });
                }else{
                    swal("As senhas são distintas", {
                        icon: "warning",
                      });
                }
            }else{
        
                }
            });
            }    
        })
            }else{

            }
        })
        
    }
})