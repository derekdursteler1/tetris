document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'yellow',
        'red',
        'purple',
        'green',
        'blue'
    ]

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
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    // undraw the tetrimino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }

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
    document.addEventListener('keydown', control)

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
            addScore()
            gameOver()
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
    const miniIndex = 0
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
            square.style.backgroundColor = ''
        })
        nextUpTetriminos[nextRandom].forEach(index => {
            miniSquares[miniIndex + index].classList.add('tetrimino')
            miniSquares[miniIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // add functionality to start/pause button
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetriminoes.length)
            displayShape()
        }
    })

    // score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 1
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrimino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }




})

