import './gerenciarChamado.html'
import {Chamados} from '../../api/chamados/chamados'

Template.gerenciarChamado.onCreated(function (){
    Meteor.subscribe('chamados')
})

Template.gerenciarChamado.helpers({
    settings: function () {
        return {
            collection: Chamados.find(),
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
                        return new Spacebars.SafeString("<button type='button' id='delChamado' class='btn btn-danger' title='Fechar Chamado'>Fechar Chamado</button>");
                    }
                }
            ]
        }
    }
})