/*********************************

 File:       waveforms.js
 Function:   Generates a variety of waveforms
 Copyright:  hrbr.io
 Date:       12/12/18 7:51 PM
 Author:     mkahn

 Enter detailed description

 **********************************/

const _ = require('lodash');

let currentAngle = 0;
const TWO_PI = Math.PI * 2;

const IMPULSE_EVERY = 5; // every IMPULSE_EVERY `next()` calls
let impulseCount = 0;

const pizza = {slice1: 0, slice2: 0, slice3: 0, slice4: 0};

const bars = [
    {label: 'Bar #1', value: 0},
    {label: 'Bar #2', value: 0},
    {label: 'Bar #3', value: 0},
    {label: 'Bar #4', value: 0},
    {label: 'Bar #5', value: 0},
    {label: 'Bar #6', value: 0},
];


function getSinusoids(angle) {

    return {
        pi_0: Math.sin(angle),
        pi_8: Math.sin(angle + Math.PI / 8),
        pi_4: Math.sin(angle + Math.PI / 4),
        pi_2: Math.sin(angle + Math.PI / 2),
        freq: [
            Math.sin(angle), Math.sin(angle * 2), Math.sin(angle * 3), Math.sin(angle * 4)
        ],
        square: (Math.sin(angle) > 0 ? 1:0)
}

}

function getSlices() {

    const sliceOrder = _.sample(Object.keys(pizza));
    pizza[sliceOrder] += Math.random()*10;
    return pizza;

}

function getBars() {

    _.sample(bars).value += Math.random();
    return bars;
}

function getImpulse() {
    impulseCount = (++impulseCount)%IMPULSE_EVERY;
    return impulseCount === 0;
}

function getSeconds() {
    return (new Date()).getSeconds()
}

function next() {
    currentAngle += Math.PI / 24;
    if (currentAngle > TWO_PI) currentAngle -= TWO_PI;
}

module.exports = {
    getSinusoids: () => getSinusoids(currentAngle),
    getSlices,
    getBars,
    getImpulse,
    getSeconds,
    next
};
