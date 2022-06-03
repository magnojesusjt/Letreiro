import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
var generator = require('generate-password');


Meteor.methods({
    'criarUsuario'(user){
        Accounts.createUser(user);
        Meteor.users.update({username: user.username},{$set: {'profile': user.profile}})
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
    'atualizarFacebook'(user){
        const _id = user._id
        const face = Meteor.users.find({_id}).fetch()

        const profile = {
                         data:{
                                name:user.username
                            },
                         "facebook": true,
                         "active": true,
                         "perfil": "Cliente"       
                        }
        const username = face[0].services.facebook.id
                        console.log(username)
        Meteor.users.update({_id: _id},{$set: {"profile": profile, "username": username,}})

        return true
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
    },
    'desativarUsers'(_id){
        Meteor.users.update({ _id: _id},{$set: {
            'profile.active':false
        } })
    },
    'verificaUser'(cpf){
        const user = Meteor.users.find({username: cpf}).fetch()

        if(user.length > 0){
            return user
        }

        return false
    },
    'resetSenha'(user){
        const _id = user[0]._id
        const firstName = user[0].profile.data.name
        const email = user[0].emails[0].address
        var password = generator.generate({
            length: 6,
            numbers: true
        }); 

        console.log(password)
        Accounts.setPassword(_id, password, { logout: false });

        const dados = {
            to: email,
            from: "agendaki@outlook.com",
            subject: "AGENDAKI",
            html: `
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:650px;margin:0px auto;background: #779bf8;">
            <thead>
            <tr>
            <td align="center" width="100%" style="background-image: linear-gradient( #779bf8 100%, #EEEEEE 10%);font-size: 34px; padding: 57px 0px; 
            background-size:cover;">
            <span style="color: white;
            font-size: 50px;">AGENDAKI</span>
            </td>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td style="background: rgb(240, 234, 234); padding: 40px;">
            <h1 style="font-size: 32px;">${firstName}, sua senha mudou!</h1> <br>
            <p style="font-size: 18px;">Verificamos que foi solicitado alteração da senha de sua conta no sistema AGENDAKI</p> <br> 
            <p style="font-size: 18px;">Seus dados de acesso são:</p> 
            <p style="font-size: 18px;"><strong>SENHA PROVISÓRIA:</strong> ${password}</p> <br> 
            <p style="font-size: 18px;">No primeiro acesso, por questões de segurança, recomendamos <br> trocar a senha para uma de sua preferência.</p> <br> 
            </td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
            <td align="center" width="100%;" style="padding: 20px;">
            <p style="font-size: 18px; color: white;">Este e-mail foi enviado de forma automática. Caso você não seja o destinatário, por favor desconsidere.</p>
            </td>
            </tr>
            </tfoot>
        </table>
          `
          }
        Meteor.call("sendEmail", dados);
        return true
    },
    sendEmail(dados) {
        Email.send({ to: dados.to, from: dados.from, subject: dados.subject, html: dados.html });
    },
})