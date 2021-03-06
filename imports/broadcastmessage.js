import { Meteor } from 'meteor/meteor';
import { BroadcastMessageCollection } from '/imports/collections/broadcastmessage_private'

// Dear admin,
// This class can be used via the 'meteor shell' command from the server backend.
// Once launched, you can handle broadcast messages like so:
//
// import { BroadcastMessage  } from '/imports/broadcastmessage'
// BroadcastMessage.show("Warning: 4Minitz will be down for maintenance in *4 Minute*. Just submit open dialogs. Then nothing is lost. You may finalize meetings later.")
// BroadcastMessage.listAll()
// BroadcastMessage.remove('abcdefghijkl')
// BroadcastMessage.removeAll()

export class BroadcastMessage {

    static find(...args) {
        return BroadcastMessageCollection.find(...args);
    }

    static findOne(...args) {
        return BroadcastMessageCollection.findOne(...args);
    }

    static dismissForMe() {
        Meteor.call("broadcastmessage.dismiss");
    }

    // ************************
    // * static server-only methods
    // ************************
    static show(message, active=true)
    {
        if (Meteor.isServer) {
            Meteor.call("broadcastmessage.show", message, active)
        }
    }

    static removeAll () {
        if (Meteor.isServer) {
            console.log("Remove All BroadcastMessages.");
            BroadcastMessageCollection.remove({});
        }
    }

    static remove (id) {
        if (!id || id == "") {
            return;
        }
        if (Meteor.isServer) {
            console.log("Remove BroadcastMessage: " + id);
            BroadcastMessageCollection.remove({_id: id});
        }
    }

    static listAll () {
        if (Meteor.isServer) {
            console.log("List All BroadcastMessages.");
            let allMsgs = [];
            BroadcastMessageCollection.find({isActive: true}).forEach(msg => {
                let oneMsg = "Message: "+msg._id+" "+
                            global.formatDateISO8601Time(msg.createdAt) +
                            " dismissed:"+msg.dismissForUserIDs.length +
                            "\n" + msg.text;
                console.log(oneMsg);
                allMsgs.push(oneMsg);
            });
            console.log("---");
            return allMsgs;
        }
    }
}
