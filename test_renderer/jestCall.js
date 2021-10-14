// Make connection
const socket = io.connect('http://localhost:9000');

// Query DOM
const message = document.getElementById('message'),
const handle = document.getElementById('handle'),
const btn = document.getElementById('send'),
const output = document.getElementById('output');

// Emit events
btn.addEventListener('click', () => {
  socket.emit('jestCall', {
      message: message.value,
      handle: handle.value
  });
});

// Listen for events
socket.on('jestCall', data => {
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});