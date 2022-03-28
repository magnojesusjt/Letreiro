import { Meteor } from 'meteor/meteor';
import './methods/user.methods'
import './publish'
import './security'

Meteor.startup(() => {
  console.log(process.env.MONGO_URL)
});
