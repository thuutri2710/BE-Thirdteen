module.exports.randomDecks = function(decks){
    for(let i=decks.length-1;i>0;i--){
        let index = Math.floor(Math.random()*(i+1));
        let temp = decks[i];
        decks[i] = decks[index];
        decks[index] = temp;
    }
    return decks;
}