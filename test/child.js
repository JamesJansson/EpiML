// Unpause the stdin stream:
process.stdin.resume();

// Listen for incoming data:
process.stdin.on('data', function (data) {
    console.log('Received data: ' + data);
});


process.on('message', function (data) {
    console.log('Received data2: ' + data);
});