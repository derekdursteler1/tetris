document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const StartButton = document.querySelector('#start-button')
    const width = 10

    // Tetriminoes draw shape based off google sheet pics
    const lTetrimino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zTetrimino = [
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ]
    const tTetrimino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    const oTetrimino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]
    const iTetrimino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
    // all shapes in array
    const theTetriminoes = [lTetrimino, zTetrimino, tTetrimino, oTetrimino, iTetrimino]

    let currentPosition = 4
    let currentRotation = 0
    
    // randomly select a tetrimino and random rotation
    let random = Math.floor(Math.random()*theTetriminoes.length)
    let current = theTetriminoes[random][currentRotation]

    // drawing the tetrimino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino')
        })
    }

    // undraw the tetrimino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino')
        })
    }

    // make the tetriminos move down
    timerId = setInterval(moveDown, 1000)

    // move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // freeze function
    function freeze() {
        // checking the next space down from each tetrimino squares to see if it has the class 'taken'
        if(current.some(index => squares [currentPosition +index + width].classList.contains('taken'))) {
            // turn each tetrimino square into taken class if true
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start a new tetrimino falling after
            random = Math.floor(Math.random() * theTetriminoes.length)
            current = theTetriminoes[random][currentRotation]
            currentPosition = 4
            draw()
        }
    }

})