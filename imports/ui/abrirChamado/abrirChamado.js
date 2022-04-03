import swal from 'sweetalert'
import './abrirChamado.html'
import {Chamados} from '../../api/chamados/chamados'

Template.abrirChamado.onCreated(function (){
 Meteor.subscribe('chamados')
 this.chamadoSelecionado = new ReactiveVar([])
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
                        return new Spacebars.SafeString("<button id='detalhesChamado' data-bs-toggle='modal' data-bs-target='#chamadoSelecionado' class='btn btn-primary' title='Detalhes'>Detalhes</button>");
                    }
                },
                {
                    key: 'delChamado',
                    label:'',
                    fn: function (value) {
                        return new Spacebars.SafeString("<button type='button' id='delChamado' class='btn btn-danger' title='Excluir Chamado'>Excluir</button>");
                    }
                }
            ]
        }
    },
    chamadoSelecionado(){
        const instance = Template.instance();
        return instance.chamadoSelecionado.get()
    }
})

Template.abrirChamado.events({
    'click #tableChamados tbody tr'(event){

        switch(event.target.id){
            case 'delChamado':
                swal({
                    title: 'Deseja excluir o chamado?',
                    icon: 'warning',
                    buttons: ["Não", "Sim"],
                    dangerMode: true,
                }).then((sim)=>{
                    if(sim){
                        Meteor.call('excluirChamado',this._id, function(error){
                            if(!error){
                                swal({
                                    title:"Chamado excluido com sucesso!",
                                    icon:"success"
                                })
                            }else{
                                swal({
                                    title:"Não foi possível excluir o chamado!",
                                    icon:"error"
                                })
                            }
                        })
                    }
                })
                break
            case 'detalhesChamado':
                    const instance = Template.instance()

                    var _id = this._id

                    var chamado = Chamados.find({_id}).fetch()

                    console.log(chamado)

                    instance.chamadoSelecionado.set(chamado[0])
        }

    },
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
                        status:'Aberto',
                        desativado: false
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
                                title: "Não foi possível criar o chamado!",
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