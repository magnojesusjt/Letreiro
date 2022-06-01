import { Meteor } from "meteor/meteor";
import {Consulta} from '../../imports/api/atendimento/atendimento'


Meteor.methods({
    'agendarConsultaCliente'(_id){
       let cliente = Meteor.user().profile.data.name;
       let userIdCliente = Meteor.userId()
       Consulta.update({_id: _id},{$set: {'agendada':true,'cliente':cliente, 'userIdCliente':userIdCliente, 'letreiro':true}})
    },
    'cancelarAtendimento'(_id){
        Consulta.update({_id: _id},{$set: {'agendada':false,'cliente':'', 'userIdCliente':'', 'letreiro':false}})
    },
    'cancelarAgenda'(_id){
        Consulta.remove({_id: _id})
    },
    'agendarConsultaAtendente'({userIdCliente, idConsulta}){

       let data = Meteor.users.find({_id:userIdCliente}).fetch()

       let cliente = data[0].profile.data.name

       Consulta.update({_id: idConsulta},{$set: {'agendada':true,'cliente':cliente, 'userIdCliente':userIdCliente, 'letreiro':true}})

    },
    'chamarPaciente'(data){ 
        const _idChamar = data._id
        const verificaConsulta = Consulta.find({'chamar':true}).fetch()
        if(verificaConsulta.length == 0){
            Consulta.update({_id: _idChamar},{$set: {'chamar':true, 'consultorio': data.consultorio, 'letreiro':false}})
            return true
        }else{
            const _id = verificaConsulta[0]._id
            Consulta.update({_id: _id},{$set: {'ultimasChamadas':true, 'chamar':false}})
            Consulta.update({_id: _idChamar},{$set: {'chamar':true, 'consultorio': data.consultorio, 'letreiro':false}})
            return true
        }
    }, 
    'voltarChamar'(data){ 
        console.log(data)
        Consulta.update({_id: data},{$set: {'letreiro':true, 'chamar':false, 'ultimasChamadas':false}})

        return true
    }  
})