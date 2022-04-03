import './dentista.html'
import {Consulta} from '../../api/atendimento/atendimento'
import moment from 'moment';

Template.dentista.onCreated(function (){
    Meteor.subscribe('consulta')
})

Template.dentista.helpers({
    tem(){
        var data = Consulta.find({$and: [{ userId: Meteor.userId() }, { "agendada": true }]}).count()
        console.log(data)
        if(data >= 1){
            return true
        }

        return false
    },
    settings: function () {
        return {
            collection: Consulta.find({$and: [{ userId: Meteor.userId() }, { "agendada": true }]}),
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'cliente', label: 'Nome do paciente' },
                { key: 'tipoAtendimento', label: 'Tipo de atendimento' },
                { key: 'dataHora', label: 'Data/Hora', fn: function (data) { return moment(data).format('LLL')}}
            ]
        }
    }
})