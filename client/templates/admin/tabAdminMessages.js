import { Meteor } from 'meteor/meteor';
import { BroadcastMessageCollection } from '/imports/collections/broadcastmessage_private';

Template.tabAdminMessages.onCreated(function() {
    //add your statement here
});

Template.tabAdminMessages.onRendered(function() {
    Template.instance().find("#id_adminMessage").focus();
});

Template.tabAdminMessages.onDestroyed(function() {
    //add your statement here
});


Template.tabAdminMessages.helpers({
    messages() {
        return BroadcastMessageCollection.find({}, {sort: {createdAt: -1}});
    },

    "inactiveStateColor"(message) {
        if (message.isActive) {
            return "#A2F9EA";
        }
        return "#ffced9";
    },

    "formatTimeStamp": function (date) {
        return global.formatDateISO8601Time(date);
    }
});

Template.tabAdminMessages.events({
    "submit #frmAdminMessages"(evt, tmpl) {
        evt.preventDefault();
        let message = tmpl.find("#id_adminMessage").value;
        Meteor.call("broadcastmessage.show", message);
        tmpl.find("#id_adminMessage").value = "";
    },

    "click #btnRemoveMessage"(evt, tmpl) {
        evt.preventDefault();
        Meteor.call("broadcastmessage.remove", this._id);
    },

    "click #btnTogglaActiveMessage"(evt, tmpl) {
        evt.preventDefault();
        Meteor.call("broadcastmessage.toggleActive", this._id);
    },

    "click #btnDismissingUsers"(evt, tmpl) {
        evt.preventDefault();
        let userIds = this.dismissForUserIDs;
        let userNames = "#Dismissing Users: "+this.dismissForUserIDs.length+"\n";
        userIds.forEach(usrId => {
            let user = Meteor.users.findOne(usrId);
            if (user) {
                userNames += user.username + " ";
                userNames += (user.profile && user.profile.name) ? user.profile.name + "\n" : "\n";
            }
        });
        alert(userNames);
    },

    "click #btnReShow"(evt, tmpl) {
        evt.preventDefault();
        tmpl.find("#id_adminMessage").value = this.text;
        tmpl.find("#id_adminMessage").focus();
    }
});
