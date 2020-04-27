<<<<<<< HEAD
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
=======
var socket = io.connect('192.168.1.96:8000');
var decksOfPlayer = [];
var pickedDecks = [];
var isWin = false;
var tempTurn = {
    tempDecks : [],
    check : []
};
socket.on('connect',(data) =>{
    socket.on('randomDecks',(data) => {
        decksOfPlayer = data.decks;
        console.log(data.decks);
    });
    socket.on('yourTurn',(data) => {
        // setTimeout(()=>{
        //     socket.emit('passTurn');
        // },2000);
        if(!isWin){
            tempTurn.tempDecks = data.currentDecks;
            tempTurn.check = checkValidate(tempTurn.tempDecks);
            $("#play").on("click", (data) =>{
                pickedDecks.sort((a,b) => a[0] * 13 + a[1] - b[0] * 13 - b[1] );
                let checkPickedDecks = checkValidate(pickedDecks);
                if(checkPickedDecks[1]){
                    //play my new turn and turn is reseted
                    if (data.isFirst){
                        let idx = decksOfPlayer.findIndex(e => e[0] * 13 + e[1] == pickedDecks[0] * 13 + pickedDecks[1]);
                        decksOfPlayer.splice(idx, pickedDecks.length);
                        isWin = !decksOfPlayer.length;
                        socket.emit('passTurn',{
                            playerTurn : pickedDecks,
                            id : socket.id,
                            isWin : !decksOfPlayer.length
                        })
                    }
                    // play my turn
                    else{
                        let checkCurrentDecks = tempTurn.check;
                        if(checkBigger(pickedDecks, currentDecks, checkPickedDecks[0], checkCurrentDecks[0])){
                            let idx = decksOfPlayer.findIndex(e => e[0] * 13 + e[1] == pickedDecks[0] * 13 + pickedDecks[1]);
                            decksOfPlayer.splice(idx, pickedDecks.length);
                            isWin = !decksOfPlayer.length;
                            socket.emit('passTurn',{
                                playerTurn : pickedDecks,
                                id : socket.id,
                                isWin : !decksOfPlayer.length
                            })
                        }
                    }
                }
            });
            if(!data.isFirst){
                $("#next").on("click",(data) =>{
                    console.log("1");
                    socket.emit('passTurn',{
                        playerTurn : [],
                        id : socket.id,
                        isWin : false
                    });
                });
            }
        }
        else{
            socket.emit('passTurn',{
                playerTurn : [],
                id : socket.id,
                isWin : false
            });
        }
    })
    socket.on('winner',(data) => console.log(data));
    socket.on('endTurn',(data) =>{
        $("#play").prop('onclick',null).off("click");
        $("#next").prop('onclick',null).off("click");
    })
    socket.on('lackOfPlayers',() =>{
        console.log("Lack of Players");
    })
    socket.on('full',() =>{
        console.log('Cannot join the room');
    })
});

// this function check valid of picked decks and their type
function checkValidate(decks){
    returnValue = [];
    switch(true){
        case decks.length == 0:
            returnValue = ['none', false];
            break;
        case decks.length == 1:
            returnValue = ['single', true];
            break;
        case decks.length == 2:
            let isDouble =decks[0][0] == decks[1][0];
            if (isDouble){
                returnValue = ['double', isDouble];
            }
            else{
                returnValue = ['none', isDouble];
            }
            break;
        case decks.length == 3:
            if (decks[0][0] == decks[1][0]){
                let isTriple = decks.every(e => e[0] == decks[0][0]);
                returnValue = [isTriple ? 'triple' : 'none', isTriple];
            }
            else if ((decks[1][0] - decks[0][0]) == 1){
                let isSequence = decks.every((e, idx) => idx == 0 ? true : (decks[idx][0] - decks[idx-1][0]) == 1) && decks[3][0] < 15;
                returnValue = [isSequence ? 'sequence' : 'none', isSequence];
            }
            else{
                returnValue = ['none', false];
            }
            break;
        case decks.length == 4:
            if (decks[0][0] == decks[1][0]){
                let isQuadra = decks.every(e => e[0] == decks[0][0]);
                return [isQuadra ? 'quadra' : 'none', isQuadra];
            }
            else if ((decks[1][0] - decks[0][0]) == 1){
                let isSequence = decks.every((e, idx) => idx == 0 ? true : (decks[idx][0] - decks[idx-1][0]) == 1) && decks[3][0] < 15;
                return [isSequence ? 'sequence' : 'none', isSequence];
            }
            else{
                return ['none', false];
            }
            break;
        case (decks.length % 2 == 1 ) && (decks.length < 13 ):
            if ((decks[1][0] - decks[0][0]) == 1){
                let isSequence = decks.every((e, idx) => idx == 0 ? true : (decks[idx][0] - decks[idx-1][0]) == 1) && decks[4][0] < 15;
                return [isSequence ? 'sequence' : 'none', isSequence];
            }
            else{
                returnValue = ['none', false];
            }
            break;
        case (decks.length % 2 == 0) && (decks.length < 13):
            //check sequence double with length %2 == 0 and bigger than 4
            if (decks[0][0] == decks[1][0]){
                let isDouble = decks.every((e, idx) => idx % 2 == 1 ? decks[idx][0] == decks[idx-1][0] : (decks[idx][0] + 1) == decks[idx+1][0] );
                return [isDouble ? 'double' : 'none', isDouble];
            }
            else if ((decks[1][0] - decks[0][0]) == 1){
                let isSequence = decks.every((e, idx) => idx == 0 ? true : (decks[idx][0] - decks[idx-1][0]) == 1) && decks[3][0] < 15;
                return [isSequence ? 'sequence' : 'none', isSequence];
            }
            else{
                return ['none', false];
            }
            break;
    }
    return returnValue;
}


// this function compare pickedDecks with currentDecks
function checkBigger(firstDecks, secondDecks, firstType, secondType){
    let firstLength = firstDecks.length;
    let secondLength = secondDecks.length;
    if(( firstLength == secondLength ) && (firstType == secondType)){
        if((firstDecks[firstLength-1][0] * 13 + firstDecks[firstLength-1][1]) > (secondDecks[secondLength-1][0] * 13 + secondDecks[secondLength-1][1])){
            return true;
        }
        else{
            return false;
        }
    }
    else if(( firstLength != secondLength ) && (firstType != secondType)){
        let isTrue = true;
        switch(true){
            //if the card is single and its value is 2 (we need quadra or k-sequence double (k>=3))
            case secondType == 'single' && secondDecks[0][0] == 15:
                if(firstLength > 2 && (firstType == 'double' || firstType == 'quadra')){
                    isTrue = true;
                }
                else{
                    isTrue = false;
                }
                break;
            // if the cards is double 2 or quadra ( we need k-sequence double (k>=4))
            case (secondType == 'double' && secondLength == 2 && secondDecks[0][0] == 15) || secondType == 'quadra':
                if(firstType == 'double' && firstLength > 6){
                    isTrue = true;
                }
                else{
                    isTrue = false;
                }
                break;
            default :
                isTrue = false;
                break;
        }
        return isTrue;
    }
    else{
        return false;
    }
}
>>>>>>> dev
