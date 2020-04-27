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
var currentTurn = {
    currentDecks : [],
    id : '',
};
var clients = 0;
var order = 1;
var _turn = 0;
var current_turn = 1; //init for the first turn
let timeOut;
const MAX_WAITING = 5000;

var server = app.listen(port,()=>{
    console.log("Server on port " + port);
})

var io = require("socket.io")(server);
var clientList = [];

app.get('/',function(req,res){
    res.sendfile('public/html/index.html');
})

io.on('connection', function(socketClient){
    if (clients<4){
        clients++;
        clientList.push(socketClient);
        if(clients == 4){
            newDecks = functions.randomDecks(decks);
            var partOfDecks = [];
            clientList.forEach(function(client, id){
                partOfDecks = newDecks.slice(id*13,id*13+13);
                client.emit('randomDecks',
                    {
                        decks : partOfDecks,
                        id : id
                    }
                );
            })
            let i = 0;
            console.log("Start-");
            clientList[_turn].emit('yourTurn',{
                currentDecks : [],
                // id : socketClient.id,
                isFirst : true
            });
            // socketClient.on('nextTurn',(data){
            //     if(data.length != 0){
            //         console.log(i);
            //     }
            //     i++;
            // })
        }
        socketClient.on('passTurn', (data) =>{
            if(clientList[_turn].id == socketClient.id){
                // after pass turn , update current Turn 
                currentTurn.currentDecks = data.playerTurn || currentTurn.currentDecks;
                currentTurn.id = data.playerTurn ? data.id : currentTurn.id;
                socketClient.emit('endTurn');
                if(data.isWin){
                    let msg = 'The player ' + _turn + 'win ' + order;
                    io.emit('winner', msg);
                    order++;
                }
                console.log(_turn);
                _turn = current_turn++ % clientList.length;
                //reset new round 
                if (currentTurn.id == clientList[_turn].id){
                    clientList[_turn].emit('yourTurn', {
                        currentDecks : currentTurn.currentDecks,
                        // id : clientList[_turn].id,
                        isFirst : true
                    });
                }
                else{
                    clientList[_turn].emit('yourTurn', {
                        currentDecks : currentTurn.currentDecks,
                        // id : clientList[_turn].id,
                        isFirst : false
                    });
                }
            }
        })
        socketClient.on('disconnect',()=>{
            clients--;
            clientList = clientList.filter(client => client.id != socketClient.id);
            if(clients !=4 ){
                clientList.forEach(function(client, id){
                    client.emit('lackOfPlayers');
                })
            }
        })
    }
    else{
        io.emit('full');
    }
})


function nextTurn(){
    _turn = current_turn++ % clientList.length;
    clientList[_turn].emit('yourTurn');
    triggerTimeout();
}

function triggerTimeout(){
    timeOut = setTimeout(()=>{
        nextTurn();let idx = decksOfPlayer.findIndex(e => e[0] * 13 + e[1] == pickedDecks[0] * 13 + pickedDecks[1]);
        decksOfPlayer.splice(idx, pickedDecks.length);
    },MAX_WAITING);
}

function resetTimeout(){
    if(typeof timeOut === 'object'){
        console.log("timeout reset");
        clearTimeout(timeOut);
    }
}