import { Meteor } from "meteor/meteor";
import { Chamados } from '../../imports/api/chamados/chamados'


Meteor.methods({
    'abrirChamado'(data){
        console.log("entrei")
        Chamados.insert(data);
    },
    'excluirChamado'(_id){
        Chamados.update({_id: _id},{$set:{desativado:true}})
    }
})