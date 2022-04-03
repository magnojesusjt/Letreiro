import './marcarConsultaAtendente.html'
import {TipoAtendimento} from '../../api/tipoAtendimento/tipoAtendimento'
import {Consulta} from '../../api/atendimento/atendimento'
import swal from 'sweetalert'
import { ReactiveVar } from "meteor/reactive-var";
import { Meteor } from 'meteor/meteor';
import moment from 'moment';





Template.marcarConsultaAtendente.onCreated(function (){    

    Meteor.subscribe('tipo_atendimento')
    Meteor.subscribe('consulta')
    Meteor.subscribe('users');
    this.tableResult = new ReactiveVar([]);
    this.ativarTable = new ReactiveVar(false);
    this.consulta = new ReactiveVar([])
    this.cliente = new ReactiveVar()
    




})



Template.marcarConsultaAtendente.helpers({
    cliente(){
        const instance = Template.instance();    
        console.log(instance.cliente.get())
        return instance.cliente.get()
    },
    consulta(){
        const instance = Template.instance();    
        return instance.consulta.get()
    },
    tipoAtendimento(){
        return TipoAtendimento.find({})
    },

    settings: function () {
        instance = Template.instance()
        cursor = instance.tableResult.get()
        return {
            collection: cursor,
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'dentista', label: 'Nome do Dentista' },
                { key: 'tipoAtendimento', label: 'Tipo de atendimento' },
                { key: 'dataHora', label: 'Data/Hora', fn: function(val){
                    return moment(val).format('LLL')
                }},,
                {
                    key: 'agendarConsultaAtendente',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button id='agendarConsultaAtendente' data-bs-toggle='modal' data-bs-target='#modalDetalhesConsulta' class='btn btn-primary' title='Detalhes'>Agendar</button>");
                    }
                }
            ]
        }
    },
    ativarTable(){
        instance = Template.instance()
        return instance.ativarTable.get()
    }
})

Template.marcarConsultaAtendente.events({
    'submit [name="pesquisa"]'(event){
        event.preventDefault()
        const instance = Template.instance()
        
        if(event.target.dataPesquisa.value){
            
            let pesquisa = {}

            let data = new Date(event.target.dataPesquisa.value)

            pesquisa.dataHora = {$gte: data}

            if(event.target.tipoPesquisa.value){
               pesquisa['tipoAtendimento'] =  event.target.tipoPesquisa.value
            }

            pesquisa['agendada'] = false
      
            const dados = Consulta.find(pesquisa)
            if(dados.fetch().length != 0){
                instance.tableResult.set(dados)
                instance.ativarTable.set(true)
            }else{
                swal({
                    title:"Sem resultados!",
                    icon:'info'
                })
                instance.ativarTable.set(false)

            }
           

        }else{
            swal({
                title:"Preencha o campo data!",
                icon:"info"
            })
        }

        

    },

    'click #agendaCliente'(event){
        event.preventDefault()

        swal({
            title:'Deseja agendar essa consulta para esse paciente?',
            icon:'info',
            buttons: ["Não", "Sim"],
        }).then((sim)=>{
            if(sim){
                let select = document.getElementById('paciente');
                let paciente = select.options[select.selectedIndex].value;

                if(paciente){
                    let data = {
                        userIdCliente : paciente,
                        idConsulta : event.target.dataset.id
                    }

                    Meteor.call('agendarConsultaCliente', data, function(error){
                        if(!error){
                            swal({
                                title:"Consulta agendada com sucesso!",
                                icon:'info'
                            })
                            $('#modalDetalhesConsulta').modal('hide')

                        }else{
                            swal({
                                title:"Não foi possível agendar essa consulta!",
                                icon:'error'
                            })
                        }
                    })
                }else{
                    swal({
                        title:"Preencha todos os campos!",
                        icon:"info"
                    })
                }
            }
        })
    },

    'click #tableConsultaAtendente tbody tr'(event){
        switch(event.target.id){
            case 'agendarConsultaAtendente':
               
                const instance = Template.instance();

                var _id = this._id
                var consulta = Consulta.find({_id:_id}).fetch()               
                instance.consulta.set(consulta[0])
                instance.cliente.set(Meteor.users.find({'profile.perfil':'Cliente'}).fetch())
        }
    }
})