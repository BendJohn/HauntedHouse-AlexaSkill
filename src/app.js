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

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        let speech = 'You are walking down the sidewalk on a gloomy evening and notice a girl approaching you walking a little white dog.'
        + ' It looks like it might rain any minute. Maybe you should have brought an umbrella. Suddenly, a flash of lightning lights up the sky.'
        + ' A second later a loud crack of thunder pierces your ears. The girl jumps from excitement and drops the dog’s leash.'
        + ' The dog is terrified of the thunder and runs through a metal gate.'
        + '<voice name="Salli"><prosody volume="x-loud" pitch="high"> Puff! Ohhhh Puff! Come here boy!</prosody></voice>'
        + ' She sees you.'
        + '<voice name="Salli"><prosody volume="soft"> Excuse me, could you help me find my dog?</prosody></voice>';
        let reprompt = 'Would like to help the girl find her dog?';
        this.followUpState('State0').ask(speech, reprompt);
    },
    State0: {
        YesIntent() {
            let speech = '<voice name="Salli"><prosody volume="soft"> Oh my gosh, thank you so much. My name is Sally. What is your name? </prosody></voice>';
            let reprompt = 'What is your name?';
            this.followUpState('Name').ask(speech, reprompt);
        },
        NoIntent() {
            let speech = 'Sally squints at you, wondering why you didn’t want to help. You shrugged and hurried back down the road to get cover from the storm. Suddenly a crack of lightning strikes you and you die before you hear its thunder.';
            this.tell(speech);
        },
        Unhandled() {
            let reprompt = 'Sorry I can\'t hear you. If you want to quit, just say quit.';
            let speech = 'Would you like to help the girl find her dog or not?';
            this.followUpState('State0').ask(speech, reprompt);
        },
    },
    Name: {
        myNameIsIntent() {
            let reprompt = '';
            let speech = '<voice name="Salli"><prosody volume="soft"> Hello ' + this.$inputs.name.value + '! My dogs name is Puff. He ran right through there.</prosody></voice>'
            + ' She was pointing at a long iron clad gate that shrouded a looming brick house. The sun setting behind the house concocted a spectral picture.'
            + ' You use a ladder to barely heave yourself over the rusty 12 foot tall iron gate. Sally follows you. You were able to get in, but can you get out?'
            + '<break time="3s"/> You are on the driveway. It was cracked and jagged. Ahead of you, you see the large, wooden front door. To your left you see a garden. Where do you want to go?';
            this.followUpState('DrivewayState').ask(speech, reprompt);
        },
        Unhandled() {
            let reprompt = 'Sorry I can\'t hear you. If you want to quit, just say quit.';
            let speech = 'Is that your name? Say  <emphasis level="strong">my name is</emphasis> and then your name.';
            this.followUpState('Name').ask(speech, reprompt);
        },
    },
    DrivewayState: {
        FrontDoorIntent() {
            if (this.$inputs.key.value == "skeleton key") {
                let reprompt = 'What should we do now?';
                let speech = 'The door screeched open. That chandelier above us looks like it is about to fall. Look, there is a dark kitchen up ahead and living room with an old piano. I think there is a patio back there too. Where should we go?';
                this.followUpState('FrontDoorState').ask(speech, reprompt);
            } else if(this.$inputs.key.value == null) {
                let reprompt = 'Where to now?';
                let speech = 'It looks like its locked. Maybe the owner left his key lying around somehwere? Let\'s check out the garden';
                this.followUpState('DrivewayState').ask(speech, reprompt);
            }
            else {
                let speech = 'We don\'t have a ' + this.$inputs.key.value + '! If you have found an item, say a knife, you can say use knife on door.';
                let reprompt = 'Where to now?';
                this.followUpState('DrivewayState').ask(speech, reprompt);
            }
        },
        GardenIntent() {
            let reprompt = 'Where to now?';
            let speech = '<voice name="Salli"><prosody volume="soft"> This is supposed to be a garden? It smells of death and dirt.</prosody></voice> A small tombstone pops out from the ground. Something is flashing by it. <voice name="Salli"><prosody volume="soft">A skeleton key!</prosody></voice> You now have a skeleotn key. What can we use this on?';
            this.followUpState('GardenState').ask(speech,reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the garden or go to the front door.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('DrivewayState').ask(speech, reprompt);
        },
    },
    GardenState: {
        DrivewayIntent() {
            let speech = 'You are back in the driveway. You can see the garden and the front door. Where do you want to go?';
            let reprompt = 'Where would you like to go? You can go to the driveway.';
            this.followUpState('DrivewayState').ask(speech, reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the driveway.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('GardenState').ask(speech, reprompt);
        },
    },
    FrontDoorState: {
        DrivewayIntent() {
            let speech = 'You are back in the driveway. You can see the garden and the front door. Where do you want to go?';
            let reprompt = 'Where would you like to go? You can go to the driveway.';
            this.followUpState('DrivewayState').ask(speech, reprompt);
        },
        PatioIntent() {
            let speech = 'You are in the patio. With the sun gone, the air outside was deathly cold. <voice name="Salli"><prosody volume="soft"> Ugh it\'s too cold here, there doesn’t seem like there is anything outside. Plus I’m getting cold!</prosody></voice>';
            let reprompt = 'Where would you like to go? You can go to the driveway.';
            this.ask(speech, reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the driveway, patio, kitchen, or the living room.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('FrontDoorState').ask(speech, reprompt);
        },
    },
    Unhandled() {
        let speech = 'Sorry I don\'t understand what you are saying. If you want to go into a room, say go to room.';
        let reprompt = 'Sorry!'
        this.tell(speech, reprompt);
    },
});

module.exports.app = app;
