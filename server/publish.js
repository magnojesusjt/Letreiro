import { Meteor } from "meteor/meteor";

import {Permissoes} from '../imports/api/permissoes/permissoes'
import {Chamados} from '../imports/api/chamados/chamados'
import {TipoAtendimento} from '../imports/api/tipoAtendimento/tipoAtendimento'
import {Consulta} from '../imports/api/atendimento/atendimento'



Meteor.publish('permissoes', function () {
    return Permissoes.find({});
});

Meteor.publish('tipo_atendimento', function () {
    return TipoAtendimento.find({});
});

Meteor.publish('consulta', function () {
    return Consulta.find({});
});

Meteor.publish('chamados', function () {
    return Chamados.find({});
});

Meteor.publish('users', function () {
        return Meteor.users.find({'profile.active': true});
});
