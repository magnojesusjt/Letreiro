import './dashBoards.html'
import './dashBoards.css'
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Chamados } from '../../api/chamados/chamados';

Template.dashBoards.onCreated(function (){
    
    Meteor.subscribe('users');
    Meteor.subscribe('chamados');

    
})

Template.dashBoards.helpers({
   
})

Template.dashBoards.onRendered(function (){
      
    setTimeout(() => {
        var count = Meteor.users.find({}).count()
        const ctx = document.getElementById('clientesCadastrados')
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Clientes'],
            datasets: [{
                label: 'Quantidade',
                data: [count],
                borderWidth: 1,
                backgroundColor:['rgba(54, 162, 235, 0.2)']
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: false
                }
            }
        }
    });
    }, 500);

    setTimeout(() => {
        var realizados = Chamados.find({}).count()
        var abertos = Chamados.find({status:"Aberto"}).count()
        var fechados = Chamados.find({status:"Fechado"}).count()

        const ctx = document.getElementById('chamados')
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Chamados abertos','Chamados Fechados', 'Chamados realizados'],
            datasets: [{
                label: ['Abertos'],
                data: [abertos,fechados,realizados],
                backgroundColor:['rgba(54, 162, 235, 0.2)'],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: false
                }
            }
        }
    });
    }, 500);
    
})