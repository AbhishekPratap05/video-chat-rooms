const express = require('express');
const app = express();

const server = require('http').Server(app);
//creating socket
const io = require('socket.io')(server);
//importing v4 version of uuid to make rooms id
const { v4: uuidv4 } = require('uuid');
//for peer to peer connect
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
    path: "/peerjs"
})

//letting peerJS know what url we are going to use
app.use('/peerjs', peerServer);

app.set('view engine', 'ejs');

//to use js file which is imported in ejs we need to set root
app.use(express.static('public'));

//create dynamic room
app.get('/', (request, response) => {
    response.redirect(`/${uuidv4()}`);
});

app.get('/:room', (request, response) => {
    response.render('room', { roomId: request.params.room })
})

//socket io connection 
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);    //we are joining the room whose id is been passed.
        socket.to(roomId).broadcast.emit('user-connected', userId); //socket letting other user know (broadcasting) that user has joined  with this id in that room.
        socket.on('message', (message) => {
            console.log(message)
            io.to(roomId).emit('createMessage', message)
        })
        socket.on('disconnect', () => {
            io.to(roomId).emit('user-disconnected', userId)
        })
        socket.on('leave-room', () => {
            io.to(roomId).emit('user-left', userId)
        })
    })
})


server.listen(process.env.PORT || 3030)