import "./login.html";
import "./login.css";
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'


const validarTelefone = (tel) => {
  let expressao =
    "^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$";
  let regex = new RegExp(expressao);

  return regex.test(tel);
};

const validarSenha = (senha, confirmaSenha) => {
  if (senha === confirmaSenha) {
    return true;
  }

  return false;
};

const validarEmail = (email) => {
  usuario = email.substring(0, email.indexOf("@"));
  dominio = email.substring(
    email.indexOf("@") + 1,
    email.length
  );
  if (
    usuario.length >= 1 &&
    dominio.length >= 3 &&
    usuario.search("@") == -1 &&
    dominio.search("@") == -1 &&
    usuario.search(" ") == -1 &&
    dominio.search(" ") == -1 &&
    dominio.search(".") != -1 &&
    dominio.indexOf(".") >= 1 &&
    dominio.lastIndexOf(".") < dominio.length - 1
  ) {
   return true
  } else {
   return false
  }
};

Template.login.onCreated(function () {});

Template.login.helpers({});

Template.login.events({
  "click #entrar"(event){
    event.preventDefault();
   const username = document.getElementById("emailLogin").value
   const password = document.getElementById("senhaLogin").value
   
   Meteor.loginWithPassword(username, password, function(e){
     if(!e){
      FlowRouter.go("/marcarconsulta");
     }else{

       if(e.reason === "Incorrect password"){
         swal({
           title: "Senha incorreta!",
           text: `Por favor, verifique sua senha!`,
           icon: "error",
         });
         return
       }else if(e.reason === "User not found"){
        swal({
          title: "E-mail não encontrado!",
          text: `Por favor, verifique seu e-mail!`,
          icon: "error",
        });
        return
       }

       swal({
        title: "Deu Ruim!",
        text: `${e}`,
        icon: "error",
      });

      return
     }
   })

  },

  "click .criarUsuario"(event) {
    event.preventDefault();
    let nome = document.getElementById("nomeCompleto").value;
    let email = document.getElementById("email").value;
    let tel = document.getElementById("telefone").value;
    let senha = document.getElementById("senha").value;
    let confirmaSenha = document.getElementById("confirmaSenha").value;

    if (nome && email && tel && senha && confirmaSenha) {
      if(validarEmail(email)){
        if (validarTelefone(tel)) {
            if (validarSenha(senha, confirmaSenha)) {

                let usuario = {
                    username : email,
                    email: email,
                    password: senha,
                    profile:{
                      data:{
                        name: nome,
                        telefone: tel,
                      },
                      perfil: 'userComum'
                    },
                    data:{
                      active: true,
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
            } else {
              swal({
                title: "Senhas diferentes!",
                text: "Por favor, verifique a senha!",
                icon: "info",
              });
            }
          } else {
            swal({
              title: "Telefone incorreto!",
              text: "Por favor, verifique o telefone!",
              icon: "info",
            });
          }
      }else{
        swal({
            title: "E-mail incorreto!",
            text: "Por favor, verifique o e-mail!",
            icon: "info",
          });
      }
    } else {
      swal({
        title: "Campos obrigatorios!",
        text: "Por favor, preencha todos os campos obrigatorios!",
        icon: "info",
      });
    }
  },
});
