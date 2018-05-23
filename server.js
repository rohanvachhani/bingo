//works as server
var express = require('express');
var app = express();
var server = app.listen(5001, function() {
    console.log('listening to port 5001');
});
var io = require('socket.io')(server);

var rooms = 0;
var game_created = 0;
var game_joined = 0;
var roomID;

app.use(express.static('.'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/game.html');
});

io.on('connection', function(socket) {
    console.log('A user connected! : ' + socket.id); // We'll replace this with our own events
    /**
     * Create a new game room and notify the creator of game. 
     */
    socket.on('createGame', function(data) {
        rooms += 1;
        socket.join('room-' + rooms); //joining the first user to the socket
        io.sockets.emit('newGame', { name: data.name, room: 'room-' + rooms });
    });

    /**
     * Connect the Player 2 to the room he requested. Show error if room full.
     */
    socket.on('joinGame', function(data) { //rceive all the events from client
        var room = io.nsps['/'].adapter.rooms[data.room];
        if (room && room.length == 1) {
            socket.join(data.room);
            roomID = data.room;
            socket.broadcast.to(data.room).emit('player1', { name: data.name }) //only send to player 1
            socket.emit('player2', { name: data.name, room: data.room }) //only send to player 2
        } else {
            socket.emit('err', { message: 'Sorry, The room is full!' });
        }
    });

    socket.on('gameEnded', function(data) {
        socket.broadcast.to(data.room).emit('gameEnd', data);

    });

    /**
     * Handle the turn played by either player and notify the other. 
     */
    socket.on('playTurn', function(data) {
        socket.broadcast.to(data.room).emit('turnPlayed', {
            digit: data.digit,
            room: data.room
        });
    });

    socket.on('move_played', function(data) {
        socket.broadcast.to(roomID).emit('msg_rcvd', {
            player: data.player_name,
            move: data.move
        });
    });


});