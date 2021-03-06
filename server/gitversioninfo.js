import { Meteor } from 'meteor/meteor'

let packagejson;
try {
    // The 4minitz package.json is not available after build
    // so let's see, if we have a copy saved...
    packagejson = require ("/package4min.json");
} catch (e) {
    packagejson = require ("/package.json");    // generic fall back
}



VERSION_INFO = {
    tag: packagejson.version ? packagejson.version : "???",
    branch: packagejson["4minitz"].branch ? packagejson["4minitz"].branch : "???",
    commitlong: packagejson["4minitz"].commitlong ? packagejson["4minitz"].commitlong : "???",
    commitshort: packagejson["4minitz"].commitshort ? packagejson["4minitz"].commitshort : "???"
};

Meteor.methods({
    gitVersionInfo: function () {
        return VERSION_INFO;
    },

    gitVersionInfoUpdate: function () {
        try {
            let git = require('git-rev-sync');
            VERSION_INFO.commitshort = git.short();
            VERSION_INFO.commitlong = git.long();
            VERSION_INFO.branch = git.branch();
            VERSION_INFO.tag = git.tag();
            if (VERSION_INFO.tag == VERSION_INFO.commitlong) {  // no tag found!
                delete VERSION_INFO.tag;
            }

            console.log("git version: "+JSON.stringify(VERSION_INFO, null, 4));

        } catch (e) {
            // silently swallow git-rev-sync errors
            // we have version fallback info from package.json
        }
    }
});

// initialize versioning once on server launch
Meteor.call("gitVersionInfoUpdate");
