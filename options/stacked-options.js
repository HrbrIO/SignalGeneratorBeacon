/*********************************

 File:       stacked-options.js
 Function:   Stacks the options files, returns union
 Copyright:  hrbr.io
 Date:       11/14/18 5:15 PM
 Author:     mkahn

 Enter detailed description

 **********************************/


const fs = require('fs');
const _ = require('lodash');

module.exports = function(){

    if (process.env.CONF_FILE) {

        try {
            const optionsEnvJsonString = fs.readFileSync(`./${process.env.CONF_FILE}`);
            return JSON.parse(optionsEnvJsonString);
        } catch (err) {
            console.error(`Error reading options file passed in ENV: "./${process.env.CONF_FILE}"`);
            console.error(`Message: ${err.message}`);
            return null;
        }

    } else {

        const optionsJsonString = fs.readFileSync('./options.json');

        const options = JSON.parse(optionsJsonString); // we want these to throw if there is an issue
        let localOptions = {};

        try {
            const localOptionsJsonString = fs.readFileSync('./options.local.json');
            localOptions = JSON.parse(localOptionsJsonString);
        } catch (err) {
            console.log('No options.local.json found or file is malformed.')
        }

        return _.merge(options, localOptions);

    }



}
