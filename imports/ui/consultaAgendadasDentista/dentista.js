import './dentista.html'
import {Consulta} from '../../api/atendimento/atendimento'

Template.dentista.onCreated(function (){
    Meteor.subscribe('consulta')
})

Template.dentista.helpers({
    tem(){
        var data = Consulta.find({$and: [{ usesId: Meteor.userId() }, { "agendada": true }]}).count()
        console.log(data)
        if(data >= 1){
            return true
        }

        return false
    },
    settings: function () {
        return {
            collection: Consulta.find({$and: [{ usesId: Meteor.userId() }, { "agendada": true }]}),
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'paciente', label: 'Nome do paciente' },
                { key: 'tipoAtendimento', label: 'Tipo de atendimento' },
                { key: 'dataHora', label: 'Data/Hora' },
                { key: 'resposta', label: 'Resposta do chamado' },
                {
                    key: 'detalhesConsultaDentista',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button id='detalhesConsultaDentista' class='btn btn-primary' title='Detalhes'>Detalhes</button>");
                    }
                }
            ]
        }
    }
})