var express = require('express');
var app = express();
app.set('views','./views');
app.use(express.static('public'));
var functions = require('./functions/functions');

const port = 8000;
const decks = [
    [ 3, 0 ],  [ 3, 1 ],  [ 3, 2 ],  [ 3, 3 ],
    [ 4, 0 ],  [ 4, 1 ],  [ 4, 2 ],  [ 4, 3 ],
    [ 5, 0 ],  [ 5, 1 ],  [ 5, 2 ],  [ 5, 3 ],
    [ 6, 0 ],  [ 6, 1 ],  [ 6, 2 ],  [ 6, 3 ],
    [ 7, 0 ],  [ 7, 1 ],  [ 7, 2 ],  [ 7, 3 ],
    [ 8, 0 ],  [ 8, 1 ],  [ 8, 2 ],  [ 8, 3 ],
    [ 9, 0 ],  [ 9, 1 ],  [ 9, 2 ],  [ 9, 3 ],
    [ 10, 0 ], [ 10, 1 ], [ 10, 2 ], [ 10, 3 ],
    [ 11, 0 ], [ 11, 1 ], [ 11, 2 ], [ 11, 3 ],
    [ 12, 0 ], [ 12, 1 ], [ 12, 2 ], [ 12, 3 ],
    [ 13, 0 ], [ 13, 1 ], [ 13, 2 ], [ 13, 3 ],
    [ 14, 0 ], [ 14, 1 ], [ 14, 2 ], [ 14, 3 ],
    [ 15, 0 ], [ 15, 1 ], [ 15, 2 ], [ 15, 3 ]
  ]  
var newDecks = [];
var clients = 0;

var server = app.listen(port,function(){
    console.log("Server on port " + port);
})

var io = require("socket.io")(server);
var clientList = [];

app.get('/',function(req,res){
    res.sendfile('public/html/index.html');
});

io.on('connection', function(socketClient){
    if (clients<4){
        clients++;
        console.log(clients)
        var clientInfo = {};
        clientInfo.dataId = socketClient.id;
        clientList.push(clientInfo);
        console.log(clientList);
        if(clients == 4){
            newDecks = functions.randomDecks(decks);
            var partOfDecks = [];
            clientList.forEach(function(client, id){
                partOfDecks = newDecks.slice(id*13,id*13+13);
                io.to(client.dataId).emit('randomDecks',
                    {
                        decks : partOfDecks,
                        id : id
                    }
                );
            })
        }
        socketClient.on('disconnect',function(){
            clients--;
            clientList = clientList.filter(client => client.dataId != socketClient.id);
            if(clients !=4 ){
                clientList.forEach(function(client, id){
                    io.to(client.dataId).emit('lackOfPlayers');
                })
            }
        })
    }
    else{
        console.log("Phòng đủ người chơi!");
        io.to(socketClient.id).emit('full');
    }
})


