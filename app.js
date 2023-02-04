document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const StartButton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0

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

    // assign functions to keycodes left arrow 37, up 38, right 39, down 40
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if(e.keyCode === 38) {
            rotate()
        } else if(e.keyCode === 39) {
            moveRight()
        } else if(e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

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
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetriminoes.length)
            current = theTetriminoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
        }
    }

    // move tetris piece left unless its at the edge or blocked
    function moveLeft() {
        undraw()
        // mod by width equals zero means the piece is near or at edge
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width == 0)
        // if shape is not at the edge
        if (!isAtLeftEdge) currentPosition -= 1
        // if shape runs into a square with 'taken' we will stay the same by adding one
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }
    // move tetris piece right unless its at the edge or blocked
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width == width - 1 )
        if (!isAtRightEdge) currentPosition += 1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }
    // rotate tetrimino
    function rotate() {
        undraw()
        currentRotation ++
        // if rotation gets to four reset to 0
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetriminoes[random][currentRotation]
        draw()
    }

    // show next-up tetrimino in the mini grid
    const miniSquares = document.querySelectorAll('.mini-grid div')
    const miniWidth = 4
    let miniIndex = 0

    // array of 5 tetriminos for mini grid to show
    const nextUpTetriminos = [
        [1, miniWidth+1, miniWidth*2+1, 2], // L shape
        [0, miniWidth, miniWidth+1, miniWidth*2+1], // Z shape
        [1, miniWidth, miniWidth+1, miniWidth+2], // t shape
        [0, 1, miniWidth, miniWidth+1], // o shape
        [1, miniWidth+1, miniWidth*2+1, miniWidth*3+1] // i shape
    ]

    // display the shape in the mini grid display
    function displayShape () {
        // remove tetris shape from mini grid
        miniSquares.forEach(square => {
            square.classList.remove('tetrimino')
        })
        nextUpTetriminos[nextRandom].forEach(index => {
            miniSquares[miniIndex + index].classList.add('tetrimino')
        })
    }
})

