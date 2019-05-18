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
                let speech = 'The door screeched open. That chandelier above us looks like it is about to fall. Look, there is a dark kitchen up ahead and a living room with an old piano. I think there is a patio back there too. Where should we go?';
                this.followUpState('FrontDoorState').ask(speech, reprompt);
            } else if(this.$inputs.key.value == null) {
                let reprompt = 'Where to now?';
                let speech = 'It looks like its locked. Maybe the owner left his key lying around somewhere? Let\'s check out the garden. If you have a key. Say use key name on door.';
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
            let speech = '<voice name="Salli"><prosody volume="soft"> This is supposed to be a garden? It smells of death and dirt.</prosody></voice> A small tombstone pops out from the ground. Something is flashing by it. <voice name="Salli"><prosody volume="soft">A skeleton key!</prosody></voice> You now have a skeleton key. What can we use this on?';
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
            let speech = 'You are in the patio. With the sun gone, the air outside was deathly cold. <voice name="Salli"><prosody volume="soft"> Ugh it\'s too cold here, there doesn’t seem like there is anything outside. Plus I’m getting cold! Let\'s go back to the front door.</prosody></voice>';
            let reprompt = 'Where would you like to go? You can go back to the front door.';
            this.followUpState('PatioState').ask(speech, reprompt);
        },
        KitchenIntent() {
            let speech = 'You step into the kitchen. You stepped on something -- a little taut and squishy. It was too dark to tell what it was.'
            + '<voice name="Salli"><prosody volume="soft"> What’s that smell? It smells like that dissection we had in class, chemically-infused flesh. Hey, there seems to be a bathroom back there. Do you need to go?</prosody></voice>';
            let reprompt = 'Where would you like to go? You can go back to the front door, or to the bathroom.';
            this.followUpState('KitchenState').ask(speech, reprompt);
        },
        LivingroomIntent() {
            let speech = 'You step into the living room. The floor creaks beneath you. It smells = damp and rancid like thawing meat. There a large piano in the center of the room and a unlit fireplace to your left. You squint and notice a closet up ahead. Sally moves toward it.'
            + '<voice name="Salli"><prosody volume="soft"> Ugh the room is jammed shut! We need something to pry it open!</prosody></voice>'
            + ' You also see a set of stairs by the fireplace. Where do you want to go?';
            let reprompt = 'Where would you like to go? You can go back ot the front door, down the stairs, or to the closet.';
            this.followUpState('LivingroomState').ask(speech, reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the driveway, patio, kitchen, or the living room.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('FrontDoorState').ask(speech, reprompt);
        },
    },
    PatioState: {
        FrontDoorIntent() {
            let reprompt = 'What should we do now?';
            let speech = 'You are back at the front door. You see the patio, kitchen, and living room. Where do you want to go?';
            this.followUpState('FrontDoorState').ask(speech, reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the front door.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('PatioState').ask(speech, reprompt);
        },
    },
    KitchenState: {
        FrontDoorIntent() {
            let reprompt = 'What should we do now?';
            let speech = 'You are back at the front door. You see the patio, kitchen, and living room. Where do you want to go?';
            this.followUpState('FrontDoorState').ask(speech, reprompt);
        },
        BathroomIntent() {
            let reprompt = 'Where to now? You can go back to the kitchen.';
            let speech = 'You decide to step into the bathroom. The light switch wasn’t working so you’re forced to use the dim light from the kitchen. There is a silhouette figure in the dark.'
            + '<voice name="Salli"><prosody volume="soft"> Oh my gosh is that a.</prosody></voice>'
            + ' Something dropped from the figure.'
            + '<voice name="Salli"><prosody volume="soft"> Look, it\'s a flashlight!</prosody></voice>'
            + ' You use it to look at the figure. It was a grinning skeleton.'
            + '<voice name="Salli"><prosody volume="soft"> Maybe the owner was into anatomy?</prosody></voice>'
            + ' You can go back to the kitchen.';
            this.followUpState('BathroomState').ask(speech, reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the front door or the bathroom.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('KitchenState').ask(speech, reprompt);
        },
    },
    BathroomState: {
        KitchenIntent() {
            let speech = 'You step back into the kitchen. The rancid smell is still there. You can go back to the bathroom or to the front door. You have flashlight and a skeleton key.';
            let reprompt = 'Where would you like to go? You can go back to the kitchen.';
            this.followUpState('KitchenState').ask(speech, reprompt);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the front door.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('BathroomState').ask(speech, reprompt);
        },
    },
    LivingroomState: {
        FrontDoorIntent() {
            let reprompt = 'What should we do now?';
            let speech = 'You are back at the front door. You see the patio, kitchen, and living room. Where do you want to go?';
            this.followUpState('FrontDoorState').ask(speech, reprompt);
        },
        ClosetIntent() {
            if (this.$inputs.key.value == "crowbar") {
                let speech = 'You walk over to the closet.'
                + ' You unlocked the door. You thought it was a closet but there was something more.'
                + '<voice name="Salli"><prosody volume="soft"> Look there is a small hole here. Maybe it will lead outside!</prosody></voice>'
                + ' You’re not so sure, but Sally was already was climbing through it. After 5 minutes of crawling through that rusty pipe, you see a light.'
                + '<voice name="Salli"><prosody volume="soft"> We made it, we’re behind the haunted house! Look there is a Puff, and we could climb over the back gate.</prosody></voice>'
                + ' Puff looked very still and scared, but you guys are glad you found him.'
                + ' You did it. You look back at the haunted house. It looked like a face smiling strangely in the moonlight. You escaped it today but you can’t shake of the feeling that you will be seeing the haunted house again. Congratulations!';
                this.tell(speech);
            } else if(this.$inputs.key.value == null) {
                let reprompt = 'Where to now?';
                let speech = 'You walk over to the closet. You jostle the knob yourself and see that the door wouldn’t budge. If only you had some tool to help you…. If you do have a tool, say use key name on door.'
                + '<voice name="Salli"><prosody volume="soft"> Told you it was jammed shut!</prosody></voice>'
                + ' You can go the stairs you saw earlier or back out to the front door.';
                this.followUpState('LivingroomState').ask(speech, reprompt);
            }
            else {
                let speech = 'We don\'t have a ' + this.$inputs.key.value + '! If you have found an item, say a knife, you can say use knife on closet. You can go the stairs you saw earlier or back out to the front door.';
                let reprompt = 'Where to now?';
                this.followUpState('LivingroomState').ask(speech, reprompt);
            }
        },
        StairsIntent() {
            if (this.$inputs.key.value == "flashlight") {
                let reprompt = 'What should we do now?';
                let speech = 'You walk over to the stairs. It was an eerie dark black color as you peered down. Luckily, you had a flashlight!'
                + ' You are in the basement of the haunted house. You see a strange, dense liquid on the floor. The walls were lit by a single light hanging in the middle.'
                + '<voice name="Salli"><prosody volume="soft"> Look at these pictures on the wall. Do you think these were ancestors that lived in the house?</prosody></voice>'
                + ' All the pictures seemed to have the same, eerily smiling face, in different poses and from different eras. How strange.'
                + '<voice name="Salli"><prosody volume="soft"> Hey there’s a crowbar behind this one!</prosody></voice>'
                + ' You could go back upstairs, but you see an eerie light in the east wing. It looked like it was some sort of cellar.'
                + '<voice name="Salli"><prosody volume="soft"> Where should we go now?</prosody></voice>';
                this.followUpState('StairsState').ask(speech, reprompt);
            } else if(this.$inputs.key.value == null) {
                let reprompt = 'Where to now?';
                let speech = 'You walk over to the stairs. It was an eerie dark black color as you peered down.'
                + '<voice name="Salli"><prosody volume="soft"> It’s way too dark in there. We’ll have no idea where we’re stepping!</prosody></voice>'
                + ' You need some sort of light. You can go the closet at the end of the room or back out to the front door.';
                this.followUpState('LivingroomState').ask(speech, reprompt);
            }
            else {
                let speech = 'We don\'t have a ' + this.$inputs.key.value + '! If you have found an item, say a knife, you can say use knife on door.';
                let reprompt = 'Where to now?';
                this.followUpState('LivingroomState').ask(speech, reprompt);
            }
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go to the front door, the stairs, or the closet.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('LivingroomState').ask(speech, reprompt);
        },
    },
    StairsState: {
        StairsIntent() {
            let speech = 'You step back up into the living room and turn off your flashlight. You see the closet and the doorway to the front door.';
            let reprompt = 'Where to next? You can go to the clost, back down the stairs, or to the front door.';
            this.followUpState('LivingroomState').ask(speech, reprompt);
        },
        CellarIntent() {
            let speech = 'You step into the cellar. Or what used to be a cellar anyway, now it was infested with pests.'
            + '<voice name="Salli"><prosody volume="soft"> Ahh a rat! It bit me!</prosody></voice>'
            + ' You jump back. You ask if she is ok.'
            + '<voice name="Salli"><prosody volume="soft"> Yes, I think so.</prosody></voice>'
            + ' Sally seemed to hate pests, but you were glad she was ok. There doesn’t seem to be anything here, but just as you are turning away, Sally grabs you. Shocked you ask Sally what shes do.'
            + 'Her eyes were bloodshot.'
            + '<voice name="Salli"><prosody volume="loud"> Sally doesn’t live here anymore!</prosody></voice>'
            + ' She proceeds to bite your face. You are too shocked to defend yourself. You feel yourself slipping away, as your consciousness is taken over by some other being. Goodbye cruel world.';
            this.tell(speech);
        },
        Unhandled() {
            let speech = 'I\'m sorry, I don\'t understand. We can go back up the stairs or to the cellar.';
            let reprompt = 'Try repeating what you said.';
            this.followUpState('StairsState').ask(speech, reprompt);
        },
    },
    Unhandled() {
        let speech = 'Sorry I don\'t understand what you are saying. If you want to go into a room, say go to room.';
        let reprompt = 'Sorry!'
        this.tell(speech, reprompt);
    },
});

module.exports.app = app;
