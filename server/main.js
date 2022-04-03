import { Meteor } from 'meteor/meteor';


import './methods/user.methods'
import './methods/atendimento.methods'
import './methods/chamado.methods'

import './publish'
import './security'


Meteor.startup(() => {
  console.log(process.env.MONGO_URL)
});
