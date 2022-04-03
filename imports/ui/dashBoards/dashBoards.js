import './dashBoards.html'
import './dashBoards.css'
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Chamados } from '../../api/chamados/chamados';

Template.dashBoards.onCreated(function (){
    
    Meteor.subscribe('users');
    Meteor.subscribe('chamados');

    
})

Template.dashBoards.onRendered(function (){
      
    setTimeout(() => {
        var cliente = Meteor.users.find({'profile.perfil':'Cliente'}).count()
        var dentista = Meteor.users.find({'profile.perfil':'Dentista'}).count()
        var adm = Meteor.users.find({'profile.perfil':'Administrador'}).count()
        var suporte = Meteor.users.find({'profile.perfil':'Suporte'}).count()
        var atendente = Meteor.users.find({'profile.perfil':'Atendente'}).count()
        const ctx = document.getElementById('clientesCadastrados')
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Clientes','Dentista','Administrador','Suporte','Atendente'],
            datasets: [{
                label: 'Quantidade',
                data: [cliente, dentista, adm, suporte, atendente],
                borderWidth: 1,
                backgroundColor:['rgba(54, 162, 235, 0.2)']
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
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
                label: ['Quantidade'],
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