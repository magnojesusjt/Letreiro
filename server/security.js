import { Meteor } from 'meteor/meteor';
Meteor.users.allow({
    insert: function () {
       return true;
    }, update: function () {
        if(Meteor.userId())
            return true;
        return true;
    }, remove: function () {
        if(Meteor.userId()){
            if(Meteor.user().profile.isAdmin){
                return true;
            }

        }
        return false;
    }
});