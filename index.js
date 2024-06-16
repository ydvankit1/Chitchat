// to run nodemon server command: nodemon index.js
// enter rs to restart
const io = require('socket.io')(8000, {
    cors: {
        origin: "*", // This allows any origin. You can specify allowed origins here.
        methods: ["GET", "POST"]
    }
});

const users = {};

// io.on listen various connections
io.on('connection', socket => {
    // socket.on handles events for a particular connection
    socket.on('new-user-joined', name => {
        // provide name key to user
        users[socket.id] = name;
        // broadcast sends a message of the new joinee to all joined connections except the sender
    });

    // message sent event handling to all the joinee
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });
    //    when any user left
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
