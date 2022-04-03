import './consultasAgendadasCliente.html'
import {Consulta} from '../../api/atendimento/atendimento'
import moment from 'moment';
import swal from 'sweetalert';

Template.consultasAgendadasCliente.onCreated(function (){
    Meteor.subscribe('consulta')
    i18n.setLanguage('pt-br');

})

Template.consultasAgendadasCliente.helpers({
    tem(){
        var data = Consulta.find({$and: [{ userIdCliente: Meteor.userId() }, { "agendada": true }]}).count()
        console.log(data)
        if(data >= 1){
            return true
        }

        return false
    },
    settings: function () {
        return {
            collection: Consulta.find({$and: [{ userIdCliente: Meteor.userId() }, { "agendada": true }]}),
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'dentista', label: 'Nome do Dentista' },
                { key: 'tipoAtendimento', label: 'Tipo de atendimento' },
                { key: 'dataHora', label: 'Data/Hora', fn: function (data) { return moment(data).format('LLL')}},
                {
                    key: 'cancelarConsultaCliente',
                    label:'',
                    fn: function () {
                        return new Spacebars.SafeString("<button id='cancelarConsultaCliente' class='btn btn-danger' title='Detalhes'>Cancelar Consulta</button>");
                    }
                }
            ]
        }
    }
})

Template.consultasAgendadasCliente.events({
    'click #consultasAgendadasCliente tbody tr'(event){
        switch(event.target.id){
            case 'cancelarConsultaCliente':
                swal({
                    title:'Deseja cancelar essa consulta?',
                    icon:'info',
                    buttons: ["Não", "Sim"],
                    dangerMode: true,
                }).then((sim)=>{
                    if(sim){
                        var _id = this._id
                        Meteor.call('cancelarAtendimento',_id, function(error){
                            if(!error){
                                swal({
                                    title:'Consulta cancelada com sucesso!',
                                    icon:'success'
                                })
                            }else{
                                swal({
                                    title:'Não foi possível cancelar essa consulta!',
                                    icon:'error'
                                })
                            }
                        })
                    }
                })
        }
    }
})