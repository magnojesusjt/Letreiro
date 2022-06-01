import "./login.html";
import "./login.css";
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import swal from "sweetalert";
import { ReactiveVar } from "meteor/reactive-var";


const validarCPF =(cpf) => {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	add = 0;	
	for (i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}

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

Template.login.onCreated(function () {
  this.carregar = new ReactiveVar(false)
});

Template.login.helpers({
  carregar(){
    instance = Template.instance()

    return instance.carregar.get()
  }
});

Template.login.events({
  'click .novaSenha'(event){
    event.preventDefault();
    const instance = Template.instance()

    const cpf = document.getElementById("novaSenhaCpf").value
    const email = document.getElementById("novaSenhaEmail").value
    
    if(cpf !== '' && email !== ''){
      Meteor.call('verificaUser', cpf, function (error, result){
        if(result){
              instance.carregar.set(true)
          Meteor.call('resetSenha',result, function(error, result){
            if(result){
              instance.carregar.set(false)
              swal({
                title: "Uma nova senha foi enviada para o seu e-mail",
                text: `Verifique sua caixa de entrada`,
                icon: "success",
              });
              $('#esqueceuSenha').modal('hide')
              document.getElementById("novaSenhaCpf").value = ''
              document.getElementById("novaSenhaEmail").value = ''
            }else{
              instance.carregar.set(false)

              swal({
                title: "Não foi possível resetar sua senha",
                text: `Tente novamente mais tarde.`,
                icon: "error",
              });
            }
          })
        }else{
          swal({
            title: "Usuário não encontrado na base",
            text: `Verifique seus dados`,
            icon: "error",
          });
        }
      })
    }else{
      swal({
        title: "Preencha os campos",
        text: `Preencha o campo E-mail e CPF!`,
        icon: "error",
      });
    }

  },
  "click #entrar"(event){
    event.preventDefault();
   const username = document.getElementById("emailLogin").value
   const password = document.getElementById("senhaLogin").value
   
   Meteor.loginWithPassword(username, password, function(e){
     if(!e){
       if(Meteor.user().profile.active){
         FlowRouter.go("/perfil");
       }else{
         swal({
           title: "Usuário desativado!",
           text: 'Seu usuário está desativado!',
           icon: 'error'
         })
       }
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
          title: "Usuário não encontrado!",
          text: `Por favor, verifique seus dados!`,
          icon: "error",
        });
        return
       }

       swal({
        title: "Preencha os campos para fazer o acesso!",
        text: `Preencha o campo de login e senha!`,
        icon: "error",
      });

      return
     }
   })

  },

  "click .criarUsuario"(event) {
    event.preventDefault();
    swal({
      title: "Deseja criar uma conta!",
      icon: "info",
      buttons: ["Não","Sim"],
      dangerMode: false,
    }).then((sim)=>{
      if(sim){
          let nome = document.getElementById("nomeCompleto").value;
          let email = document.getElementById("email").value;
          let tel = document.getElementById("telefone").value;
          let cpf = document.getElementById("cpf").value
          let senha = document.getElementById("senha").value;
          let confirmaSenha = document.getElementById("confirmaSenha").value;

          if (nome && email && tel && cpf && senha && confirmaSenha) {
            if(validarEmail(email)){
              if (validarTelefone(tel)) {
                if(validarCPF(cpf)){
                  if (validarSenha(senha, confirmaSenha)) {
                    let usuario = {
                          username : cpf,
                          email: email,
                          password: senha,
                          profile:{
                            data:{
                              name: nome,
                              telefone: tel,
                              cpf: cpf
                          },
                          perfil: 'Cliente',
                          active: true,
                          },
                        }

                    Meteor.call('criarUsuario',usuario,function(error){
                        if(!error){
                            swal({
                                title: "Conta criada!",
                                text: "Sua conta foi criada com sucesso!",
                                icon: "success",
                              });
                              document.getElementById("nomeCompleto").value = ''
                              document.getElementById("email").value = ''
                              document.getElementById("telefone").value = ''
                              document.getElementById("cpf").value = ''
                              document.getElementById("senha").value = ''
                              document.getElementById("confirmaSenha").value = ''                              
                              $('#exampleModal').modal('hide')
                              FlowRouter.go("/");
                        }else{
                          if(error.reason === 'Email already exists.'){
                            swal({
                                  title: "Já existe um usuário com esse E-mail!",
                                  text: `verifique o seu e-mail!`,
                                  icon: "error",
                                });
                          }else if(error.reason === 'Username already exists.'){
                            swal({
                                title: "Já existe um usuário com esse CPF!",
                                text: `verifique o seu CPF!`,
                                icon: "error",
                            });
                          }else{
                            swal({
                                title: "Deu ruim!",
                                text: `${error}`,
                                icon: "error",
                            });
                          }
                        }
                    })
                  } else {
                    swal({
                      title: "Senhas diferentes!",
                      text: "Por favor, verifique a senha!",
                      icon: "info",
                    });
                  }
                }else{
                  swal({
                    title: "CPF incorreto!",
                    text: "Por favor, verifique seu CPF!",
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
      }else{

      }
    })
  },

  'click #entrarFacebook'(event){
    event.preventDefault();
    console.log('entrei')
    Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err, res){
      if (err) {
          console.log('Handle errors here: ', err);
      }
      const user = Meteor.user()
      const ativaFacebook = user.profile ?? false
      if(ativaFacebook){
        FlowRouter.go("/perfil");
      }else{
        const user = Meteor.user()
        Meteor.call('atualizarFacebook', user, function(error,res){
          if(res){
            FlowRouter.go("/perfil");
          }
        })
      }
      
  });
  }
});
