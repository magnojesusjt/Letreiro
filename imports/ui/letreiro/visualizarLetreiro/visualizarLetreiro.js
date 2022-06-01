import './visualizarLetreiro.html'
import './visualizarLetreiro.css'
import {Consulta} from '../../../api/atendimento/atendimento'

Template.visualizarLetreiro.helpers({
    ultimasChamadas(){
        return Consulta.find({ultimasChamadas: true},{limit:3})
    },
    chamar(){ 
        const consulta = Consulta.find({chamar: true}).fetch()
        return consulta[0]
    }
})

Template.visualizarLetreiro.onCreated(function (){
    Meteor.subscribe('consulta')
})