import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";


Meteor.methods({
    'criarUsuario'(user){
        Accounts.createUser(user);
    },
    'updateUsuario'(user){
        if (user.profile.data) {
            var _id = user._id
            Meteor.users.update({ _id: _id }, { $set: {"profile.data" : user.profile.data}});
        }
    },
    'trocarSenha'(senha){
        let user = Meteor.userId();
        Accounts.setPassword(user, senha, { logout: false });
    },
    'atualizaUsuario'(user){
       if(user._id){
          let _id = user._id
          let email = user.email
          let perfil = user.perfilNome
          let {cpf} = user.profile
          Meteor.users.update({ _id: _id }, { $set: {
            "profile.data" : user.profile,
            "emails.0.address":email,
            "profile.perfil": perfil,
            'username': cpf
                }
            });
        }
    }
})