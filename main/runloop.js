/*********************************

 File:       runloop.js
 Function:   Main runloop of the generator
 Copyright:  hrbr.io
 Date:       12/12/18 8:03 PM
 Author:     mkahn

 Enter detailed description

 **********************************/

const log = require('../log').log;
const args = require('minimist')(process.argv.slice(2));
const pjson = require('../package.json');
const util = require('util');
const waveforms = require('../generators/waveforms');

const colors = require('colors');
const verbose = args.hasOwnProperty('v');
const Beacon = require('beacon-es6-driver');
const options = require('../node_modules/options/stacked-options')();

let loopDelay = options.sampleInterval * 1000 | args.i || 60000;
if (loopDelay < 5000) loopDelay = 5000;

const beaconOptions = {
    apiKey: options.apikey,
    appVersionId: options.appVersionId || `${pjson.name}:${pjson.version}`,
    beaconVersionId: options.beaconVersionId || `${pjson.name}:${pjson.version}`,
    beaconInstanceId: options.beaconInstanceId || 'some_machine',
    txOptions: {
        server: options.server || 'production'
    },
    bufferOptions: {
        lengthLimit: 100000
    },
    interMessageDelayMs: 500,
    verbose: verbose
};

function initialize() {

    Beacon.initialize(beaconOptions);
    setInterval(postMessages, loopDelay);

}

function postMessages() {

    log('Ping!');
    const sinusoids = waveforms.getSinusoids();
    const slices = waveforms.getSlices();
    const bars = waveforms.getBars();

    Beacon.transmit({beaconMessageType: 'BARS', data: { bars: bars}});
    Beacon.transmit({beaconMessageType: 'SINUSOIDS', data: sinusoids});
    Beacon.transmit({beaconMessageType: 'SLICES', data: slices});

    waveforms.next();

}


module.exports = {

    run: () => {

        log("\n");
        log(`======================================`.green)
        log(`Hrbr.io Signal Gen Test Beacon in Node`.green)
        log(`======================================`.green);
        log(("Interval: " + loopDelay / 1000 + " seconds").red);

        log(`\n----------- BEACON OPTIONS -----------`)
        log(util.inspect(beaconOptions));
        log(`---------------------------------------\n`);
        initialize();

    }


}