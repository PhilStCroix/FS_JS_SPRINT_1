const fs = require('fs');
const myArgs = process.argv.slice(2);
const { folders, configjson, usagetxt } = require('./templates');

// Add logging to the CLI project by using eventLogging
const logEvents = require('./logEvents');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();
myEmitter.on('log', (event, level, msg) => logEvents(event, level, msg));

function displayConfig() {
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if (error) {
            console.error("Error reading config file:", error);
            myEmitter.emit('log', 'config.displayConfig()', 'ERROR', 'Error reading config file.');
        } else {
            console.log(JSON.parse(data));
            myEmitter.emit('log', 'config.displayConfig()', 'INFO', 'Config file displayed successfully.');
        }
    });
}

function resetConfig() {
    let configdata = JSON.stringify(configjson, null, 2);
    fs.writeFile(__dirname + '/json/config.json', configdata, (error) => {
        if (error) {
            console.error("Error resetting config file:", error);
            myEmitter.emit('log', 'config.resetConfig()', 'ERROR', 'Error resetting config file.');
        } else {
            console.log('Config file reset to original state');
            myEmitter.emit('log', 'config.resetConfig()', 'INFO', 'Config file reset to original state.');
        }
    });
}

function setConfig() {
    let match = false;
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if (error) {
            console.error("Error reading config file:", error);
            myEmitter.emit('log', 'config.setConfig()', 'ERROR', 'Error reading config file.');
        } else {
            let cfg = JSON.parse(data);
            for (let key of Object.keys(cfg)) {
                if (key === myArgs[2]) {
                    cfg[key] = myArgs[3];
                    match = true;
                }
            }
            if (!match) {
                console.log(`Invalid key: ${myArgs[2]}, try another.`);
                myEmitter.emit('log', 'config.setConfig()', 'WARNING', `Invalid key: ${myArgs[2]}`);
            }
            data = JSON.stringify(cfg, null, 2);
            fs.writeFile(__dirname + '/json/config.json', data, (error) => {
                if (error) {
                    console.error("Error updating config file:", error);
                    myEmitter.emit('log', 'config.setConfig()', 'ERROR', `Error updating config file for key: ${myArgs[2]}`);
                } else {
                    console.log(`Config file "${myArgs[2]}": updated to "${myArgs[3]}"`);
                    myEmitter.emit('log', 'config.setConfig()', 'INFO', `Config file "${myArgs[2]}": updated to "${myArgs[3]}"`);
                }
            });
        }
    });
}

function configApp() {
    switch (myArgs[1]) {
        case '--show':
            displayConfig();
            break;
        case '--reset':
            resetConfig();
            break;
        case '--set':
            setConfig();
            break;
        case '--help':
        case '--h':
        default:
            fs.readFile(__dirname + "/views/config.txt", (error, data) => {
                if (error) {
                    console.error("Error reading config view file:", error);
                    myEmitter.emit('log', 'configApp()', 'ERROR', 'Error reading config view file.');
                } else {
                    console.log(data.toString());
                    myEmitter.emit('log', 'configApp()', 'INFO', 'Config view displayed successfully.');
                }
            });
    }
}

module.exports = {
    configApp,
    myEmitter // Export the emitter for external use if needed
};
