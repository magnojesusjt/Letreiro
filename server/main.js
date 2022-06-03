import { Meteor } from 'meteor/meteor';


import './methods/user.methods'
import './methods/atendimento.methods'
import './methods/chamado.methods'
import './methods/consulta.methods'

import './publish'
import './security'


Meteor.startup(() => {
  const email = 'agendaki@outlook.com'
  const senha = '014547JT'
  process.env.MAIL_URL = `smtp://${email}:${senha}@smtp.office365.com:587`;
  Accounts.emailTemplates.from = 'agendaki@outlook.com';
  Accounts.emailTemplates.siteName = "AGENDAKI";

  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: '426290636008452',
      secret: '1d97b6405421d75b3362a628651f7fad'
  });

  Accounts.onCreateUser(function (options, user) {

    if (!user.services.facebook) {
        return user;
    }
    user.username = user.services.facebook.name;
    user.emails = [{address: user.services.facebook.email}];

    return user;
});

});
