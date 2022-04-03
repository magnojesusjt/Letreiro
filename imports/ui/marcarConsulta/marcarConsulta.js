import './marcarConsulta.html'
import {TipoAtendimento} from '../../api/tipoAtendimento/tipoAtendimento'
import {Consulta} from '../../api/atendimento/atendimento'
import swal from 'sweetalert'
import { ReactiveVar } from "meteor/reactive-var";
import moment from 'moment';





Template.marcarConsulta.onCreated(function (){
    this.tableResult = new ReactiveVar([]);
    this.ativarTable = new ReactiveVar(false);
    Meteor.subscribe('tipo_atendimento')
    Meteor.subscribe('consulta')



})



Template.marcarConsulta.helpers({
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
                    key: 'detalhesConsultaCliente',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button id='agendarConsultaCliente' class='btn btn-primary' title='Detalhes'>Agendar</button>");
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

Template.marcarConsulta.events({
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

    'click #tableConsultaCliente tbody tr'(event){
        switch(event.target.id){
            case 'agendarConsultaCliente':
                swal({
                    title:'Deseja agendar esse consulta?',
                    icon:'info',
                    buttons: ["Não", "Sim"],
                }).then((sim)=>{
                    if(sim){
                        var _id = this._id
                        Meteor.call('agendarConsultaCliente',_id, function(error){
                            if(!error){
                                swal({
                                    title:'Consulta agendada com sucesso!',
                                    icon:'success'
                                })
                            }else{
                                swal({
                                    title:'Não foi possível agendar essa consulta!',
                                    icon:'error'
                                })
                            }
                        })
                    }
                })
        }
    }
})