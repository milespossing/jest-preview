// Make connection
const socket = io.connect('ws://localhost:9000');

// Query DOM
const output = document.getElementById('output');
// const broadCastLine = document.getElementById('broadCastLine');


// Listen for events
socket.on('jestCall', data => {
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

// socket.on('broadCast', function(data){
//     broadCastLine.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
// });