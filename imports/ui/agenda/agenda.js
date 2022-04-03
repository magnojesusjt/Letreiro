import './agenda.html';
import {TipoAtendimento} from '../../api/tipoAtendimento/tipoAtendimento'
import {Consulta} from '../../api/atendimento/atendimento'
import moment from 'moment';

import swal from 'sweetalert';

Template.agenda.onCreated(function (){
    Meteor.subscribe('tipo_atendimento')
    Meteor.subscribe('consulta')
})

Template.agenda.helpers({
    atendimento(){
        return TipoAtendimento.find({})
    },
    settings: function () {
        return {
            collection: Consulta.find({userId: Meteor.userId()}),
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'tipoAtendimento', label: 'Tipo atendimento' },
                { key: 'dataHora', label: 'Data/Hora', fn: function (data) { return moment(data).format('LLL')}},
                { key: 'dentista', label: 'Dentista' },
                {
                    key: 'delAtendimento',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button type='button' id='delConsulta' class='btn btn-danger' title='Cancelar atendimento'>Cancelar Agenda</button>");
                    }
                }
            ]
        }
    }
})

Template.agenda.events({
    'click #salvarAtendimento'(event) {
        event.preventDefault()
        swal({
            title: 'Salvar atendimento',
            icon: 'info',
            buttons: ["Não", "Sim"],
            
        }).then((sim)=>{
            if(sim){
                let tipo = document.getElementById('tipo');
                let value = tipo.options[tipo.selectedIndex].value;
                let dataHora = document.getElementById('dataHora').value

                if(value && dataHora){
                    data = {
                        tipoAtendimento : value,
                        dataHora: new Date(dataHora),
                        agendada:false,
                        userId: Meteor.userId(),
                        dentista: Meteor.user().profile.data.name,
                        createdAt: new Date()
                    }

                    Meteor.call('salvarAtendimento',data,function(error){
                        if(!error){
                            swal({
                                title: 'Atendimento salvo com sucesso!',
                                icon:'success'
                            })
                        }else{

                        }
                    })
                }else{
                    swal({
                        title: 'Preencha todos os campos',
                        icon:'info'
                    })
                }
            }
        })
    },
    'click #tableatendimento tbody tr'(event){
        switch(event.target.id){
            case 'delConsulta':
                swal({
                    title:"Deseja cancelar esse atendimento?",
                    icon:"info",
                    buttons: ["Não", "Sim"],
                    dangerMode: true,
                }).then((sim)=>{
                    if(sim){
                        let _id = this._id
                         Meteor.call('cancelarAgenda',_id, function(error){
                        if(!error){
                            swal({
                                title:"Atendimento cancelado com sucesso!",
                                icon:'success'
                            })
                        }else{
                            swal({
                                title:"Não foi possível cancelar esse atendimento!",
                                icon:'error'
                            })
                        }
                         })
                    }
                })
        }
    }
})