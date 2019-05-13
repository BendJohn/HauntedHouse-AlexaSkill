'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);
var beenHere = false;

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        let speech = 'Welcome to the Escape the Haunted House game.';
        let reprompt = '';
        this.followUpState('State0').ask(speech, reprompt);
    },
    State0 : {
        Unhandled() {
            let reprompt = '';
            let speech = '';
            if (beenHere) {
                speech = 'You have been here!';
            } else {
                speech = 'You have not been here yet';
                beenHere = true;
            }
            this.followUpState('State0').ask(speech, reprompt);
        },
    },
    DrivewayState: {
        FrontDoorIntent() {
            if (this.$inputs.key.value == "skeleton key") {
                let reprompt = 'What should we do now?';
                let speech = 'The door screeched open. That chandelier above us looks like it is about to fall. Look, there is a dark kitchen up ahead and living room with an old piano. I think there is a patio back there too. Where should we go?';
                this.ask(speech, reprompt);
            } else if(this.$inputs.key.value == null) {
                let reprompt = 'Where to now?';
                let speech = 'It looks like its locked. Maybe the owner left his key lying around somehwere? Let\'s check out the garden';
                this.followUpState('BeginingState').ask(speech, reprompt);
            }
            else {
                let speech = 'We don\'t have a ' + this.$inputs.key.value + '!';
                let reprompt = 'Where to now?';
                this.followUpState('BeginingState').ask(speech, reprompt);
            }
        },
        GardenIntent() {
            let reprompt = 'Where to now?';
            let speech = 'This is supposed to be a garden? It smells of death and dirt. A small tombstone pops out from the ground. Something is flashing by it. A skeleton key! What can we use this on?';
            this.ask(speech,reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the garden or go to the front door.';
            let reprompt = 'Try repeating what you said';
            this.ask(speech, reprompt);
        },
    },
    Unhandled() {
        let speech = 'Sorry I don\'t understand what you are saying. If you want to go into a room, say go to room.';
        let reprompt = 'Sorry!'
        this.tell(speech, reprompt);
    },
});

module.exports.app = app;
