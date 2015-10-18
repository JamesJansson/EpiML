// Require spawn from the child process module
var spawn = require('child_process').spawn;

// Run node with the child.js file as an argument
var child = spawn('node', ['child.js']);

// Send data to the child process via its stdin stream
child.stdin.write("Hello there!");

// Listen for any response from the child:
child.stdout.on('data', function (data) {
    console.log('We received a reply: ' + data);
});

// Listen for any errors:
child.stderr.on('data', function (data) {
    console.log('There was an error: ' + data); 
});