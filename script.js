// Очікуємо завантаження DOM і запускаємо гру
document.addEventListener("DOMContentLoaded", () => {
    candyCrushGame();
});

// Основна функція гри
function candyCrushGame() {
    const grid = document.querySelector(".grid"); 
    const scoreDisplay = document.getElementById("score");  
    const width = 8; 
    const squares = [];  
    let score = 0;  

    // Масив з кольорами цукерок
    const candyColors = [  
        "url(images/red-candy.png)",
        "url(images/blue-candy.png)",
        "url(images/green-candy.png)",
        "url(images/brown-candy.png)",
        "url(images/orange-candy.png)",
        "url(images/purple-candy.png)",
    ];

    scoreDisplay.innerHTML = score; 

    // Функція для створення початкової сітки
    function createBoard() {
        squares.length = 0;
        grid.innerHTML = "";

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div"); 
            square.setAttribute("draggable", true); 
            square.setAttribute("id", i);  
            let randomColor = Math.floor(Math.random() * candyColors.length);  
            square.style.backgroundImage = candyColors[randomColor]; 
            grid.appendChild(square); 
            squares.push(square); 
        }
    }

    // Функція для створення валідної сітки без комбінацій
    function createValidBoard() {
        createBoard();
        while (checkForMatches(true)) {  
            squares.forEach((square) => (square.style.backgroundImage = ""));  
            createBoard();  
        }
    }

    createValidBoard(); 

    // Функція для перевірки на комбінації
    function checkForMatches(initialCheck = false) {
        let validMatch = false;

        // Перевірка комбінацій по рядках та стовпцях
        for (let i = 0; i < width * width; i++) {
            let rowOfMatch = [];
            let columnOfMatch = [];

            // Перевірка рядка на можливі комбінації
            for (let j = 0; j < 5; j++) {
                if (i + j < width * width && (i % width) + j < width) {
                    rowOfMatch.push(i + j);
                }
            }

            // Перевірка стовпця на можливі комбінації
            for (let j = 0; j < 5; j++) { 
                if (i + j * width < width * width) { 
                    columnOfMatch.push(i + j * width);
                }
            }

            // Перевірка на комбінації по рядку
            for (let j = 0; j < rowOfMatch.length - 2; j++) {
                let matchLength = 0;
                while (rowOfMatch[j + matchLength] && squares[rowOfMatch[j + matchLength]].style.backgroundImage === squares[i].style.backgroundImage && squares[rowOfMatch[j + matchLength]].style.backgroundImage !== "") {
                    matchLength++;
                }
                if (matchLength >= 3) { 
                    validMatch = true;
                    rowOfMatch.slice(j, j + matchLength).forEach(index => squares[index].style.backgroundImage = "");
                    if (!initialCheck) {
                        score += matchLength;  
                        scoreDisplay.innerHTML = score;
                    }
                }
            }

            // Перевірка на комбінації по стовпцю
            for (let j = 0; j < columnOfMatch.length - 2; j++) {
                let matchLength = 0;
                while (columnOfMatch[j + matchLength] && squares[columnOfMatch[j + matchLength]].style.backgroundImage === squares[i].style.backgroundImage && squares[columnOfMatch[j + matchLength]].style.backgroundImage !== "") {
                    matchLength++;
                }
                if (matchLength >= 3) {  
                    validMatch = true;
                    columnOfMatch.slice(j, j + matchLength).forEach(index => squares[index].style.backgroundImage = "");
                    if (!initialCheck) {
                        score += matchLength;  
                        scoreDisplay.innerHTML = score;
                    }
                }
            }
        }

        return validMatch;
    }

    // Функція для руху елементів вниз після видалення комбінацій
    function moveIntoSquareBelow() {
        for (let i = 0; i < width * (width - 1); i++) {
            if (squares[i + width] && squares[i + width].style.backgroundImage === "") {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = "";
            }
    
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && squares[i].style.backgroundImage === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }

    // Функція для заповнення порожніх клітин
    function fillEmptyCells() {
        for (let i = 0; i < width; i++) {
            if (squares[i].style.backgroundImage === "") {
                let randomColor = Math.floor(Math.random() * candyColors.length);
                squares[i].style.backgroundImage = candyColors[randomColor];
            }
        }
    }

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    // Події для перетягування цукерок
    squares.forEach((square) =>
        square.addEventListener("dragstart", dragStart)
    );
    squares.forEach((square) => square.addEventListener("dragend", dragEnd));
    squares.forEach((square) => square.addEventListener("dragover", dragOver));
    squares.forEach((square) =>
        square.addEventListener("dragenter", dragEnter)
    );
    squares.forEach((square) => square.addEventListener("drageleave", dragLeave));
    squares.forEach((square) => square.addEventListener("drop", dragDrop));

    // Функція для початку перетягування
    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    // Функція для дозволу на перетягування
    function dragOver(e) {
        e.preventDefault();
    }

    // Функція для заходу цукерки на нову клітину
    function dragEnter(e) {
        e.preventDefault();
    }

    // Функція для виходу з клітини
    function dragLeave() {
        this.style.backgroundImage = "";
    }

    // Функція для завершення перетягування
    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    // Функція для перевірки валідних рухів
    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            let isMatch = checkForMatches();  // перевірка на комбінації після руху
            if (isMatch) {
                setTimeout(checkMatches, 100);  // перевірка комбінацій після затримки
            } else {
                squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
                squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
            }
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
    }

    // Функція для перевірки всіх комбінацій
    function checkMatches() {
        checkRowForFive();
        checkColumnForFive();
        checkRowForFour();
        checkColumnForFour();
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquareBelow();
        fillEmptyCells();
    }
    
    // Функції для перевірки комбінацій по рядках та стовпцях на 5, 4, 3 елементи
    function checkRowForFive() {
        for (i = 0; i < 56; i++) {
            let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
    
            const notValid = [
                5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55
            ];
            if (notValid.includes(i)) continue;
    
            if (rowOfFive.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 5;
                scoreDisplay.innerHTML = score;
                rowOfFive.forEach((index) => squares[index].style.backgroundImage = "");
            }
        }
    }
    
    function checkColumnForFive() {
        for (i = 0; i < 39; i++) {
            let columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
    
            if (columnOfFive.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 5; 
                scoreDisplay.innerHTML = score;
                columnOfFive.forEach((index) => squares[index].style.backgroundImage = ""); 
            }
        }
    }
    
    
    function checkRowForFour() {
        for (let i = 0; i < 60; i++) {
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
    
            const notValid = [
                5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55
            ];
            if (notValid.includes(i)) continue;
    
            if (rowOfFour.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                rowOfFour.forEach((index) => squares[index].style.backgroundImage = ""); 
            }
        }
    }
    
    function checkColumnForFour() {
        for (let i = 0; i < 39; i++) {
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";
    
            if (columnOfFour.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 4;
                scoreDisplay.innerHTML = score;
                columnOfFour.forEach((index) => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkRowForThree() {
        for (i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            const notValid = [
                6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55
            ];
            if (notValid.includes(i)) continue;

            if (rowOfThree.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach((index) => squares[index].style.backgroundImage = "");
            }
        }
    }

    function checkColumnForThree() {
        for (i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === "";

            if (columnOfThree.every((index) => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach((index) => squares[index].style.backgroundImage = "");
            }
        }
    }

    // перевірка комбінацій через кожну секунду
    window.setInterval(checkMatches, 100);
}