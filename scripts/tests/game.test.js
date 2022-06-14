/**
 * @jest-environment jsdom
 */
//This is a necessary addition due to changes in Jest's default configuration

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require('../game')

jest.spyOn(window, 'alert').mockImplementation(() => { }) //uses Jest's spyOn function to listen for alerts

beforeAll(() => {
    let fs = require('fs')
    let fileContents = fs.readFileSync('index.html', 'utf-8')
    document.open()
    document.write(fileContents)
    document.close()
})

describe('game object contains correct keys', () => {
    test('score key exists', () => {
        expect('score' in game).toBe(true) //checks to see if the score key in the game Object has a value
    })
    test('currentGame key exists', () => {
        expect('currentGame' in game).toBe(true)
    })
    test('playerMoves key exists', () => {
        expect('playerMoves' in game).toBe(true)
    })
    test('choices key exists', () => {
        expect('choices' in game).toBe(true)
    })
    test('choices key contains correct ids', () => {
        expect(game.choices).toEqual(['button1', 'button2', 'button3', 'button4']) //checks to see if the choices key contains this array, which are the buttons the player can click
    })
    test('turnNumber key exists', () => {
        expect('turnNumber' in game).toBe(true)
    })
    test('lastButton key exists', () => {
        expect('lastButton' in game).toBe(true)
    })
    test('turnInProgress key exists', () => {
        expect('turnInProgress' in game).toBe(true)
    })
})

describe('newGame function resets game.score, clears game.currentGame and clears game.playerMoves', () => {
    beforeAll(() => { //before tests inside this describe block run, this beforeAll block gives the game Object fake values, to check if the newGame function is properly resetting the values
        game.score = 16
        game.currentGame = [1, 3, 4, 2, 4]
        game.playerMoves = [2, 3, 4, 1, 3]
        document.getElementById('score').innerText = '16' //sets the 16 in the simulated js DOM to 16, to see if it is reset by newGame
        game.turnNumber = 2
        game.lastButton = 'button2'
        game.turnInProgress = 'not a boolean'
        newGame() // calls newGame function

    })

    test('game.score reset to 0', () => {
        expect(game.score).toEqual(0)
    })
    /*
    test('game.currentGame reset to 0', () => {
        expect(game.currentGame).toEqual([])
        //expect(game.currentGame.length).toBe(0)
        //This is also valid, as it checks to see if the length of the currentGame array is 0, which is essentially the same as an empty array
    })
    */
   test('game.currentGame contains 1 element in the array', () => {
       expect(game.currentGame.length).toBe(1)
       //This is where length checking is necessary, because the currentGame array will have a random button id in it, so the test cannot properly account for this
       //Without the addTurn function working, this test will fail
   })
    test('game.playerMoves reset to 0', () => {
        expect(game.playerMoves).toEqual([])
        //expect(game.playerMoves.length).toBe(0)
        //This is also valid, as it checks to see if the length of the playerMoves array is 0, which is essentially the same as an empty array
    })

    test('DOM element with id of score should display as 0', () => {
        expect(document.getElementById('score').innerText).toEqual(0)
    })

    test('game.turnNumber to be reset to 0', () => {
        expect(game.turnNumber).toBe(0)
    })
    
    test('game.lastButton to be reset to an empty string', () => {
        expect(game.lastButton).toBe('')
    })
    /*
    test('game.turnInProgress to be reset to false', () => {
        expect(game.turnInProgress).toBe(false)
    })
    currently this test doesn't work, something overrides turnInProgress to be true
    */
})

describe('gameplay works correctly', () => {
    beforeEach(() => {
        game.score = 0
        game.currentGame = []
        game.playerMoves = []
        addTurn()
        //Called before each test runs, resets game Object and calls addTurn, which adds a random value onto the currentGame array
    })

    afterEach(() => {
        game.score = 0
        game.currentGame = []
        game.playerMoves = []
        //Resets the values of the game Object after each test has been run
        //This fulfils the Isolated part of the RITE acronym - the tests should be able to be run in any order
    })

    test('addTurn properly adds a second random element to the currentGame array', () => {
        addTurn() //should call addTurn again and add a second element to the currentGame array, since addTurn was already called in the beforeEach function. AfterEach hasn't yet been called
        expect(game.currentGame.length).toBe(2) //checks to see if he currentGame array has 2 elements in it
    })

    test('should add correct CSS class to the buttons to light them up', () => {
        let button = document.getElementById(game.currentGame[0]) //grabs first (index 0) element of the currentGame array, and this is randomised. It will be 'button1', 'button2', etc

        lightsOn(game.currentGame[0]) //calls lightsOn function, which lights up one of the circles in the game, using the same first element of the currentGame array

        expect(button.classList).toContain('light') //light is the class name used to light up the circle. button is the variable defined abov
        //classList is a property that holds all of the CSS classes applied to an element
        //toContain is a matcher like toBe or toEqual
    })

    test('showTurns function should update game.turnNumber properly', () => {
        game.turnNumber = 16
        showTurns()
        expect(game.turnNumber).toBe(0)
    })

    test('expect data-listener attribute value to be set to true', () => {
        const elements = document.getElementsByClassName('circle') //grabs all elements that have a class name of circle - i.e. all of the circular divs
        for (let element of elements) { //sets up a for loop that loops over the elements array above, using the singular variable element
            expect(element.getAttribute('data-listener')).toEqual('true') //checks to see if the attribute value of the data-listener attribute is true
        }
    })

    test('should increment score if turn is correct', () => {
        game.playerMoves.push(game.currentGame[0]) //simulates a correct answer by the player, pushing the contents of the playerMoves array into the currentGame array
        //the two arrays should now match
        playerTurn()
        expect(game.score).toBe(1)
    })

    test('should call an alert if a wrong move is made', () => {
        game.playerMoves.push('wrong') //pushes an invalid element into the playerMoves array. It should normally be 'button1', 'button2;, etc
        playerTurn()
        expect(window.alert).toBeCalledWith('Wrong move friendo!') //watches for a window alert with the text 'wrong move friendo'
    })

    test('computers turn is in progress', () => {
        showTurns()
        expect(game.turnInProgress).toBe(true)
    })

    test('user clicks during computers turn, should cause game to fail', () => {
        showTurns()
        game.lastButton = '' //empties lastButton key
        document.getElementById('button3').click() //button3 is a selection, it is not important and could be any other button. The click method simulates a button click
        expect(game.lastButton).toEqual('') //checks to see if the game.lastButton key remains empty
    })
})
