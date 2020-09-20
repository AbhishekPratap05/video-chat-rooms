const express = require('express');
const app = express();
const server = require('http').Server(app);

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


server.listen(3030);