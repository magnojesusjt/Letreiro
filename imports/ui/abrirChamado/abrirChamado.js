import swal from 'sweetalert'
import './abrirChamado.html'

Template.abrirChamado.helpers({
    user(){
        return Meteor.user()
    }
})

Template.abrirChamado.events({
    'click #enviarChamado'(event){
        event.preventDefault()
        swal({
            title: "Enviar chamado?",
            icon: "warning",
            buttons: ["Não","Sim"],
            dangerMode: true,
        }).then((sim)=>{
            if(sim){
                usuario = document.getElementById('usuario').value
                email = document.getElementById('email').value
                userId = Meteor.userId()
                assunto = document.getElementById('assunto').value
                mensagem = document.getElementById('mensagem').value

                if(assunto && mensagem && usuario && email){
                    data = {
                        assunto,
                        mensagem,
                        usuario,
                        email,
                        userId,
                        status:'Aberto'
                    }

                    Meteor.call("abrirChamado",data,function(e){
                        if(!e){
                            swal({
                                title: "Chamado enviado com sucesso!",
                                // text: "Sua conta foi criada com sucesso!",
                                icon: "success",
                              });

                            document.getElementById('assunto').value=''
                            document.getElementById('mensagem').value=''
                        }else{
                            swal({
                                title: "Aconteceu algum erro!",
                                text: "Nossa equipe já está verificando o problema!",
                                icon: "error",
                              });
                        }
                    })
                    return

                }

                swal({
                    title:'Por favor, preencha todos os campos!',
                    icon: "warning",
                })
            }else{

            }
        })
        
    }
})