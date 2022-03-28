import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";


Meteor.methods({
    'criarUsuario'(user){
        Accounts.createUser(user);
    },
    'updateUsuario'(user){
        if (user.profile.data) {
            var _id = user._id
            delete user._id 
            Meteor.users.update({ _id: _id }, { $set: {"profile.data" : user.profile.data}});
        }
    },
    'trocarSenha'(senha){
        let user = Meteor.userId();
        Accounts.setPassword(user, senha, { logout: false });
    }
})