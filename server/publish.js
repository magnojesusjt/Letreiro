import { Meteor } from "meteor/meteor";

import {Permissoes} from '../imports/api/permissoes/permissoes'



Meteor.publish('permissoes', function () {
    return Permissoes.find({});
});

Meteor.publish('users', function () {
    
        return Meteor.users.find({});

});
