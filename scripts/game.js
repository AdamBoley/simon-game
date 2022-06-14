
let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    choices: ['button1', 'button2', 'button3', 'button4'],
    turnNumber: 0,
    lastButton: '',
    turnInProgress: false
}

function newGame() {
    //reset score
    //reset player moves
    //reset current game
    game.score = 0
    game.currentGame = []
    game.playerMoves = []
    game.turnNumber = 0
    let circles = document.getElementsByClassName('circle') //defines an array that holds the elements that have a class name of circle
    for (let circle of circles) { //sets up a for loop 
        if (circle.getAttribute('data-listener') !== 'true') { //checks to see if the element has a data-listener attribute value of not true
            circle.addEventListener('click', (event) => { //if so, adds a click event listener 
                if(game.currentGame.length > 0 && !game.turnInProgress === true ) { //checks to see if the length of the currentGame array is > 0, i.e. if there is a game in progress
                    //the !game.turninProgress === true checks to see if the computer is taking its turn
                    let move = event.target.getAttribute('id') // gets id of that element
                    game.lastButton = move
                    lightsOn(move) //calls the lightsOn function, passing in the argument of that element, so that the element lights up
                    game.playerMoves.push(move) //adds that move to the playerMoves array
                    playerTurn()
                }
                
            })
            circle.setAttribute('data-listener','true') //sets the attribute value of data-listener to true
        }
    }
    game.lastButton = ''
    game.turnInProgress = false
    showScore()
    addTurn()
}

function showScore() {
    //displays score, as stored in the game object
    document.getElementById('score').innerText = game.score
}

function addTurn() {
    //clears playerMoves array
    //selects a random button
    //pushes that selected button into the currentGame array
    // call showTurns function
    game.playerMoves = []
    game.currentGame.push(game.choices[(Math.floor(Math.random() * 4))]) // generates a random number between 0 and 3, then uses that to push the corresponding index of the game.choices array onto the currentGame array
    showTurns()
}

function lightsOn(circle) { //circle is an argument, and will be an element of the currentGame array - 'button1', 'button2', etc 
    document.getElementById(circle).classList.add('light')
    setTimeout(() => {
        document.getElementById(circle).classList.remove('light') //removes the light class
    }, 400) //400 is a time in milliseconds, after which the light CSS class will be removed
}

function showTurns() {
    //step through currentGame array
    //turn on the light
    //turn off the light
    game.turnInProgress = true //sets game.turnInProgress to true, indicating that the computer's turn is in progress
    game.turnNumber = 0 // the game Object doesn't contain a turnNumber key, so this command creates it
    let turns = setInterval(() => { //uses setInterval to set a pause between invocations of the lightsOn function
        lightsOn(game.currentGame[game.turnNumber]) //calls lightsOn function
        game.turnNumber++ //increments turnNumber

        if (game.turnNumber >= game.currentGame.length) {
            clearInterval(turns)
            game.turnInProgress = false // sets game.turnInProgress to false, indicating that the computer's turn is over
        }

    }, 800)
}

function playerTurn() {
    let index = game.playerMoves.length - 1 //grabs last element of the playerMoves array 
    if (game.currentGame[index] === game.playerMoves[index]) { //checks if the last element of the currentGame index is the same as the last element of the playerMoves array
        if (game.currentGame.length == game.playerMoves.length) { // checks to see if the length of both arrays is the same. if so, the player must have got the sequence correct
            game.score++
            showScore()
            addTurn()
        }
    }
    else {
        alert('Wrong move friendo!')
        newGame()
    }
}


module.exports = { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } //curly braces used for the export is because this file exports more than 1 thing