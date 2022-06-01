import { Meteor } from 'meteor/meteor';


import './methods/user.methods'
import './methods/atendimento.methods'
import './methods/chamado.methods'
import './methods/consulta.methods'

import './publish'
import './security'


Meteor.startup(() => {
  const email = 'sistemaagendaki@gmail.com'
  const senha = '014547JT'
  process.env.MAIL_URL = `smtp://${email}:${senha}@smtp.gmail.com:587`;
  Accounts.emailTemplates.from = "sistemaagendaki@gmail.com";
  Accounts.emailTemplates.siteName = "AGENDAKI";

  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: '1314554739035559',
      secret: '346c924a01db57e4296077ca5e552f8b'
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
