// Unpause the stdin stream:
process.stdin.resume();

// Listen for incoming data:
process.stdin.on('data', function (data) {
    console.log('Received data: ' + data);
});