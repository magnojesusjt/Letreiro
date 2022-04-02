import { Meteor } from "meteor/meteor";

import {Permissoes} from '../imports/api/permissoes/permissoes'
import {Chamados} from '../imports/api/chamados/chamados'



Meteor.publish('permissoes', function () {
    return Permissoes.find({});
});

Meteor.publish('chamados', function () {
    return Chamados.find({});
});

Meteor.publish('users', function () {
    
        return Meteor.users.find({'profile.active': true});

});
