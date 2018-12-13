/*********************************

 File:       index.js
 Function:   Super-dumb logger
 Copyright:  hrbr.io
 Date:       12/12/18 7:58 PM
 Author:     mkahn

 Enter detailed description

 **********************************/

const colors = require('colors');

let verbose = true;

module.exports = {

    enableLogging: (isVerbose) => {
        verbose = isVerbose;
    },

    log: (message) => {
        if (verbose) console.log(message);
    }

}
