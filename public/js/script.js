var socket = io.connect('192.168.1.96:8000');
var decksOfPlayer = [];
var pickedDecks = [];
var tempDecks = [];
socket.on('connect',function(){
    socket.on('randomDecks',function(data) {
        decksOfPlayer = data.decks;
        console.log(data.decks);
    });
    socket.on('myTurn',function(){
        $("#play").on("click",function(){
            console.log("Hello");
        });
        $("#next").on("click",function(){
            socket.emit('nextTurn',{
                playerTurn : []
            });
        });
    })
    socket.on('lackOfPlayers',function(data){
        console.log("Lack of Players");
    })
    socket.on('full',function(){
        console.log('Cannot join the room');
    })
});

function checkValidate(){
    pickedDecks.sort((a,b) =>a[0]*13+a[1]-b[0]*13-b[1] );
}