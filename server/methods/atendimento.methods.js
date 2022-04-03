import { Meteor } from "meteor/meteor";
import {Consulta} from '../../imports/api/atendimento/atendimento'


Meteor.methods({
    'salvarAtendimento'(atendimento){
        Consulta.insert(atendimento)
    }
})