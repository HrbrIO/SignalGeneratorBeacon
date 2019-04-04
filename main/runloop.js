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
const Beacon = require('hrbr-es6-driver-concurrent');
const options = require('../options/stacked-options')();

// If ENV passed JSON file is corrupt or doesn't exit
if (!options) process.exit(1);

let loopDelay = options.sampleInterval * 1000 | args.i || 1000;
if (loopDelay < 100) loopDelay = 100;

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
    interMessageDelayMs: 1,
    verbose: verbose
};

function initialize() {

    Beacon.initialize(beaconOptions);
    setInterval(postMessages, loopDelay);

}

function postMessages() {

    const sinusoids = waveforms.getSinusoids();
    const slices = waveforms.getSlices();
    const bars = waveforms.getBars();
    const time = waveforms.getSeconds();

    Beacon.transmit({beaconMessageType: 'BARS', data: { bars: bars}});
    Beacon.transmit({beaconMessageType: 'SINUSOIDS', data: sinusoids});
    Beacon.transmit({beaconMessageType: 'SLICES', data: slices});
    Beacon.transmit({beaconMessageType: 'IMPULSE', data: { message: 'Impulse triggered!'}});
    Beacon.transmit({beaconMessageType: 'SAW_TIME', data: { seconds: time}})

    // log(`BARS: ${util.inspect(bars)}`);
    // log(`SINUSOIDS: ${util.inspect(sinusoids)}`);
    // log(`SLICES: ${util.inspect(slices)}`);

    waveforms.next();

}


module.exports = {

    run: () => {

        log("\n");
        log(`======================================`.green)
        log(`Hrbr.io Signal Gen Test Beacon in Node`.green)
        log(`======================================`.green);
        log(("Interval: " + loopDelay + " milliseconds").red);
        log(`Started at: ${new Date()}`.red);

        log(`\n----------- BEACON OPTIONS -----------`)
        log(util.inspect(beaconOptions));
        log(`---------------------------------------\n`);
        initialize();

    }


}
