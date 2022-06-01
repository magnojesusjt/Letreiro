import './letreiro.html'
import { Consulta } from '../../api/atendimento/atendimento';
import moment from 'moment';

Template.letreiro.onCreated(function (){
    Meteor.subscribe('consulta')
    i18n.setLanguage('pt-br');
    this.detalhesConsulta = new ReactiveVar([])
    this.voltarChamadaId = new ReactiveVar('oi')
})

Template.letreiro.events({
    'click #tableLetreiro tbody tr'(event) {
        const instance = Template.instance();
        switch(event.target.id){
            case 'btnChamar':

                var _id = this._id

                var consulta = Consulta.find({_id}).fetch()

                instance.detalhesConsulta.set(consulta[0])

                break
            case 'btnVoltar':
                swal({
                    title: "Certeza que quer voltar?",
                    icon: 'warning',
                    buttons: ["Não","Sim"],
                    dangerMode: true
        
                }).then((sim)=>{
                    if(sim){
                       Meteor.call('voltarChamar', this._id, function(error, res){
                           if(res){
                            swal({
                                title:'Concluido',
                                icon:'success'
                            })
                           }
                       })
                    }
                })
                
                break
        }
    }, 
    'click #chamarUsuario'(event){
        event.preventDefault()

        let select = document.getElementById('consultorio')
        let value = select.options[select.selectedIndex].value;
        if(value){
            data = {
                "consultorio": value,
                "_id": event.target.dataset.id
            }
            Meteor.call('chamarPaciente', data, function(error, res){
                if(res){
                    swal({
                        title:'Concluído!',
                        icon:'success'
                    })
                }
            } )
        }else{
            swal({
                title:'Sem consultorio!',
                text:'Por favor, adicione um consultorio',
                icon:'info'
            })
        }

    }
})

Template.letreiro.helpers({
    Consultorio(){
        return [{value:01},{value:02},{value:03},{value:04},{value:05}]
    },
    detalhesConsulta(){
        const instance = Template.instance();
        return instance.detalhesConsulta.get()
    },
    consultaUltimos(){
        return Consulta.find({
            $or: [{ chamar: true }, { ultimasChamadas: true }],
          })
    },
    consulta(){
        return Consulta.find({
            $and: [{ agendada: true }, { letreiro: true }],
          })
    },
    settings: function () {
        return {
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'cliente', label: 'Nome do paciente' },
                { key: 'dentista', label: 'Nome do dentista' },
                { key: 'dataHora', label: 'Horario', fn: function (data) { return moment(data).format('LLL')} },
                { key: 'tipoAtendimento', label: 'Tipo de atendimento' },
                {
                    key: 'selecionarUsuario',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button id='btnChamar' data-bs-toggle='modal' data-bs-target='#modalConsultorio' class='btn btn-primary' title='Detalhes'>Chamar</button>");
                    }
                }
            ]
        }
    }, 
    settingsUltimasChamadas: function () {
        return {
            rowsPerPage: 25,
            showNavigation: 'auto',
            showColumnToggles: false,
            showFilter: true,
            fields: [
                { key: 'cliente', label: 'Nome do paciente' },
                { key: 'dentista', label: 'Nome do dentista' },
                { key: 'dataHora', label: 'Horario', fn: function (data) { return moment(data).format('LLL')} },
                { key: 'tipoAtendimento', label: 'Tipo de atendimento' },
                {
                    key: 'selecionarUsuario',
                    label:'',
                    fn: function (value) {
                        // return new Spacebars.SafeString("<a href='#modal' data-toggle='modal' id='linkModal'><i class=''></i></a>");
                        return new Spacebars.SafeString("<button id='btnVoltar' class='btn btn-danger btnVoltar' title='Detalhes'>Voltar chamado</button>");
                    }
                }
            ]
        }
    }
})