const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define the CLI commands
function initialize() {
  // Create a directory for your application
  fs.mkdir('myapp', (err) => {
    if (err) {
      console.error('Error creating the application directory:', err);
    } else {
      console.log('Application directory created.');
      // Create a configuration file
      fs.writeFile('myapp/config.json', JSON.stringify({}), (err) => {
        if (err) {
          console.error('Error creating the configuration file:', err);
        } else {
          console.log('Configuration file created.');
        }
      });
    }
  });
}

function viewConfig() {
  // Read and display the configuration file
  fs.readFile('myapp/config.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the configuration file:', err);
    } else {
      console.log('Current configuration:', data);
    }
  });
}

function updateConfig() {
  // Update the configuration file
  rl.question('Enter new configuration data: ', (data) => {
    fs.writeFile('myapp/config.json', data, (err) => {
      if (err) {
        console.error('Error updating the configuration file:', err);
      } else {
        console.log('Configuration file updated.');
      }
      rl.close();
    });
  });
}

// Define the available CLI commands
const commands = {
  initialize,
  'view-config': viewConfig,
  'update-config': updateConfig,
};

// Parse command-line arguments
const [, , command] = process.argv;

if (command && commands[command]) {
  // Execute the specified command
  commands[command]();
} else {
  console.log('Available commands: initialize, view-config, update-config');
}
