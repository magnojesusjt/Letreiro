import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import {Permissoes} from '../imports/api/permissoes/permissoes'

export let TabularTablesUsers = {};
Meteor.isClient && Template.registerHelper('TabularTablesUsers', TabularTablesUsers);
TabularTablesUsers.Users = new Tabular.Table({
    name:"Users",
    collection: Meteor.users,
    colums:[
        {data:'username', title:"E-mail"}
    ]
})

console.log("Entreiiiiiiiiiiiiiiiii")