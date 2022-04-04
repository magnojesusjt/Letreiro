import { Meteor } from "meteor/meteor";
import {Consulta} from '../../imports/api/atendimento/atendimento'


Meteor.methods({
    'agendarConsultaCliente'(_id){
       let cliente = Meteor.user().profile.data.name;
       let userIdCliente = Meteor.userId()
       Consulta.update({_id: _id},{$set: {'agendada':true,'cliente':cliente, 'userIdCliente':userIdCliente}})
    },
    'cancelarAtendimento'(_id){
        Consulta.update({_id: _id},{$set: {'agendada':false,'cliente':'', 'userIdCliente':''}})
    },
    'cancelarAgenda'(_id){
        Consulta.remove({_id: _id})
    },
    'agendarConsultaAtendente'({userIdCliente, idConsulta}){

       let data = Meteor.users.find({_id:userIdCliente}).fetch()

       let cliente = data[0].profile.data.name

       Consulta.update({_id: idConsulta},{$set: {'agendada':true,'cliente':cliente, 'userIdCliente':userIdCliente}})

    }   
})