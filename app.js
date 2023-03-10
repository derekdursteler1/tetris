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
        'blue',
        'orange',
        'green', 
        'red', 
        'purple',
        'yellow',
        'teal' 
    ]

    // Tetriminoes draw shape based off google sheet pics
    const lTetrimino = [ // blue 
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const lTetromino2 = [ // orange
        [0, width, width*2, width*2+1],
        [0, 1, 2, width],
        [0, 1, width+1, width*2+1],
        [2, width, width+1, width+2]
      ]
    const zTetrimino = [ // green
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ]
    const zTetromino2 = [ // red
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2]
      ]
    const tTetrimino = [ // purple
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    const oTetrimino = [ // yellow
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]
    const iTetrimino = [ // teal
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
    // all shapes in array
    const theTetriminoes = [lTetrimino, lTetromino2, zTetrimino, zTetromino2, tTetrimino, oTetrimino, iTetrimino]

    let currentPosition = 4
    let currentRotation = 0
    
    // randomly select a tetrimino and random rotation
    let random = Math.floor(Math.random()*theTetriminoes.length)
    let current = theTetriminoes[random][currentRotation]

    // drawing the tetrimino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino')
            squares[currentPosition + index].classList.add(colors[random])
        })
    }

    // undraw the tetrimino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino')
            squares[currentPosition + index].classList.remove(colors[random])
        })
    }

    // assign functions to keycodes left arrow 37, up 38, right 39, down 40
    function control(e) {
        if(e.keyCode === 37 && (timerId)) {
            moveLeft()
        } else if(e.keyCode === 38 && (timerId)) {
            rotate()
        } else if(e.keyCode === 39 && (timerId)) {
            moveRight()
        } else if(e.keyCode === 40 && (timerId)) {
            moveDown()
        }
    }
    document.addEventListener('keydown', control)

    // move down function
    function moveDown() {
        if(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
          undraw()
          currentPosition += width
          draw()
        } else {
          freeze();  
        }
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
            addScore()
            draw()
            displayShape()
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

    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
      }
      
      function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
      }
      
      function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
          if (isAtRight()){            //use actual position to check if it's flipped over to right side
            currentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
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
        checkRotatedPosition()
        draw()
    }

    // show next-up tetrimino in the mini grid
    const miniSquares = document.querySelectorAll('.mini-grid div')
    const miniWidth = 4
    const miniIndex = 0
    // array of 5 tetriminos for mini grid to show
    const nextUpTetriminos = [
        [1, miniWidth+1, miniWidth*2+1, 2], // L shape
        [0, miniWidth, miniWidth*2, miniWidth*2+1], // l shape 2
        [0+1 , miniWidth+1, miniWidth+2, miniWidth*2+2], // Z shape
        [1, miniWidth, miniWidth+1, miniWidth*2], // z shape 2
        [miniWidth+1, miniWidth*2, miniWidth*2+1, miniWidth*2+2], // t shape
        [miniWidth+1, miniWidth+2, miniWidth*2+1, miniWidth*2+2], // o shape
        [1, miniWidth+1, miniWidth*2+1, miniWidth*3+1] // i shape
    ]

    // display the shape in the mini grid display
    function displayShape () {
        // remove tetris shape from mini grid
        miniSquares.forEach(square => {
            square.classList.remove('tetrimino')
            square.classList.remove(colors[random])
            square.style.backgroundColor = ''
            square.style.border = ''
        })
        nextUpTetriminos[nextRandom].forEach(index => {
            miniSquares[miniIndex + index].classList.add('tetrimino')
            miniSquares[miniIndex + index].classList.add(colors[nextRandom])
            
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
                    squares[index].removeAttribute('class')
                    squares[index].style.backgroundColor = ''
                    squares[index].style.border = ''
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
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
        }
    }




})

