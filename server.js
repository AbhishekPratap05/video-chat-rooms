const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

//importing v4 version of uuid to make rooms id
const {v4:uuidv4} = require('uuid');

app.set('view engine','ejs');

app.use(express.static('public'));

app.get('/', (request,response)=>{
    response.redirect(`/${uuidv4()}`);
});

app.get('/:room',(request,response)=>{
    response.render('room',{roomId:request.params.room})
})

//socket io connection 
io.on('connection',socket =>{
    socket.on('join-room',(roomId)=>{
        socket.join(roomId);    //we are joining the room whose id is been passed.
        socket.to(roomId).broadcast.emit('user-connected') //socket letting other user know (broadcasting) that user has joined that room.
    })
})


server.listen(3030);