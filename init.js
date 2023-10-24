const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Load the logEvents module and EventEmitter
const logEvents = require('./logEvents');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter();

const { folders, configjson, usagetxt } = require('./templates');

function createFolders() {
    myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders should be created.');
    let mkcount = 0;
    folders.forEach(foldername => {
        try {
            if (!fs.existsSync(path.join(__dirname, foldername))) {
                fsPromises.mkdir(path.join(__dirname, foldername));
                mkcount++;
            }
        } catch (err) {
            console.log(err);
        }
    });

    if (mkcount === 0) {
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders already exist.');
    } else if (mkcount <= folders.length) {
        myEmitter.emit('log', 'init.createFolders()', 'INFO', mkcount + ' of ' + folders.length + ' folders needed to be created.');
    } else {
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders successfully created.');
    }
}

function createFiles() {
    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'Files should be created.');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        if (!fs.existsSync(path.join(__dirname, './json/config.json'))) {
            fs.writeFile('./json/config.json', configdata, (err) => {
                if (err) {
                    console.log(err);
                    myEmitter.emit('log', 'init.createFiles()', 'ERROR', 'config.json creation was unsuccessful.');
                } else {
                    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'config.json successfully created.');
                }
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', 'config.json already exists.');
        }

        if (!fs.existsSync(path.join(__dirname, './views/usage.txt'))) {
            fs.writeFile('./views/usage.txt', usagetxt, (err) => {
                if (err) {
                    console.log(err);
                    myEmitter.emit('log', 'init.createFiles()', 'ERROR', 'usage.txt creation was unsuccessful.');
                } else {
                    myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/usage.txt successfully created.');
                }
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/usage.txt already exists.');
        }
    } catch (err) {
        console.log(err);
    }
}

const myArgs = process.argv.slice(2);

function initializeApp() {
    myEmitter.emit('log', 'initializeApp()', 'INFO', 'init feature was called.');

    switch (myArgs[1]) {
        case '--all':
            createFolders();
            createFiles();
            myEmitter.emit('log', 'init --all', 'INFO', 'Create all folders and files.');
            break;
        case '--cat':
            createFiles();
            myEmitter.emit('log', 'init --cat', 'INFO', 'Create all files.');
            break;
        case '--mk':
            createFolders();
            myEmitter.emit('log', 'init --mk', 'INFO', 'Create all folders.');
            break;
        case '--help':
        case '--h':
        default:
            fs.readFile(__dirname + "/views/init.txt", (error, data) => {
                if (error) throw error;
                console.log(data.toString());
            });
    }
}

module.exports = {
    initializeApp,
    myEmitter  // Export the emitter for external use if needed
};
