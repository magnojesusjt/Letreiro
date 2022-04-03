import swal from 'sweetalert'
import './abrirChamado.html'
import {Chamados} from '../../api/chamados/chamados'

Template.abrirChamado.onCreated(function (){
 Meteor.subscribe('chamados')
});


Template.abrirChamado.helpers({
    user(){
        return Meteor.user()
    },
    settings: function () {
        return {
            collection: Chamados.find({userId:Meteor.userId()}),
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'assunto', label: 'Assunto' },
                { key: 'mensagem', label: 'Mensagem' },
                { key: 'status', label: 'Status' },
                { key: 'resposta', label: 'Resposta do chamado' },
                {
                    key: 'detalhesChamado',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button id='detalhesChamado' class='btn btn-primary' title='Detalhes'>Detalhes</button>");
                    }
                },
                {
                    key: 'delChamado',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button type='button' id='delChamado' class='btn btn-danger' title='Desativar Chamado'>Desativar</button>");
                    }
                }
            ]
        }
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