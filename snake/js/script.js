const FIELD_SIZE_X = 10;
const FIELD_SIZE_Y = 10;

let snake = [];

let gameIsRunning = false;
let direction = "y+";
let snakeSpeed = 300;
let snakeTimer;
let score = 0;


function init() {
	prepareGameField();
	document.getElementById("snake-start").addEventListener("click", startGame);
	document.getElementById("snake-renew").addEventListener("click", refreshGame);
	addEventListener("keydown",  changeDirection);
}

function startGame() {
	gameIsRunning = true;
	respawn();
	snakeTimer = setInterval(move, snakeSpeed);
	setTimeout(createFood, 3000);
}


function refreshGame() {
	location.reload();
}

function prepareGameField() {
	let gameTable = document.createElement("table");
	gameTable.setAttribute("class", "game-table");

	for(let i = 0; i < FIELD_SIZE_Y; i++){
		let row = document.createElement("tr");
		row.setAttribute("class", "game-table-row row-" + i);

		for(let j = 0; j < FIELD_SIZE_X; j++){
			let cell = document.createElement("td");
			cell.setAttribute("class", "game-table-cell cell-" + j + "-" + i);

			row.appendChild(cell);
		}

		gameTable.appendChild(row);
	}

	document.getElementById("snake-field").appendChild(gameTable);
}

function respawn() {

	let startCoordX = Math.floor(FIELD_SIZE_X / 2);
	let startCoordY = Math.floor(FIELD_SIZE_Y / 2);

	let snakeHead = document.getElementsByClassName("cell-" + startCoordX + "-" + startCoordY)[0];
	let prevSnakeHeadAttr = snakeHead.getAttribute("class");
	snakeHead.setAttribute("class", prevSnakeHeadAttr + " snake-unit");

	let snakeTail = document.getElementsByClassName("cell-" + startCoordX + "-" + (startCoordY - 1))[0];
	let prevSnakeTailAttr = snakeTail.getAttribute("class");
	snakeTail.setAttribute("class", prevSnakeTailAttr + " snake-unit");

	snake.push(snakeTail);

	snake.push(snakeHead);
}


function move() {
 
	let snakeHeadClasses = snake[snake.length - 1].getAttribute("class").split(" ");

	let newUnit;
	let snakeCoords = snakeHeadClasses[1].split("-");
	let coordX = parseInt(snakeCoords[1]);
	let coordY = parseInt(snakeCoords[2]);

	if(direction == "y+") {
		newUnit = document.getElementsByClassName("cell-" + coordX + "-" + (coordY + 1))[0];
	}
	else if(direction == "y-") {
		newUnit = document.getElementsByClassName("cell-" + coordX + "-" + (coordY - 1))[0];
	}
	else if(direction == "x+") {
		newUnit = document.getElementsByClassName("cell-" + (coordX + 1) + "-" + coordY)[0];
	}
	else if (direction == "x-") {
		newUnit = document.getElementsByClassName("cell-" + (coordX - 1) + "-" + coordY)[0];
	}
	if (!isSnakeUnit(newUnit) && newUnit !== undefined) {
		newUnit.setAttribute("class", newUnit.getAttribute("class") + " snake-unit");
		snake.push(newUnit);
		getScoreInHtml()
		if(!haveFood(newUnit)){
			let removed = snake.splice(0, 1)[0];
			let classes = removed.getAttribute("class").split(" ");
			removed.setAttribute("class", classes[0] + " " + classes[1]);
		}

	}
	else{
		finishTheGame();
	}
}

function isSnakeUnit(unit) {
	let check = false;

	if (snake.includes(unit)) {
		check = true;
	}

	return check;
}

function haveFood(unit) {
	let check = false;
	let unitClasses = unit.getAttribute("class").split(" ");

	if (unitClasses.includes("food-unit")) {
		check = true;

		unit.setAttribute("class", unitClasses[0] + " " + unitClasses[1] + " " + unitClasses[3]);

		createFood();

		score++;
	}

	return check;
}

function createFood() {
	let foodCreated = false;

	while (!foodCreated){
		let foodX = Math.floor(Math.random() * (FIELD_SIZE_X));
		let foodY = Math.floor(Math.random() * (FIELD_SIZE_Y));

		let foodCell = document.getElementsByClassName("cell-" + foodX + "-" + foodY)[0];
		let foodCellClasses = foodCell.getAttribute("class").split(" ");

		if (!foodCellClasses.includes("snake-unit")) {
			let classes = "";
			for (let i = 0; i < foodCellClasses.length; i++) {
				classes += foodCellClasses[i] + " ";
			}

			foodCell.setAttribute("class", classes + "food-unit");
			foodCreated = true;
		}
	}
}
function changeDirection(e) {
    switch (e.key){
		case "Left":
		case "ArrowLeft":            
			if (direction != "x+")
				direction = "x-";
            break;
		case "Up":
		case "ArrowUp":  
			if (direction != "y+")
				direction = "y-";
            break;
		case "Right":
		case "ArrowRight":  
			if (direction != "x-")
				direction = "x+";            
            break;
		case "Down":
		case "ArrowDown":  
            if (direction != "y-")
				direction = "y+"; 
            break;
    }
}

function getScoreInHtml() {
	let scoreInHtml = document.getElementById('score');
	scoreInHtml.innerHTML = ("Ваш счет: " + score);
}

function finishTheGame() {
	gameIsRunning = false;
	createFood = false;
	clearInterval(snakeTimer);
	console.log("Игра закончена, Вы собрали " + score + " шт. вкусняшек");
	alert("Игра закончена, Вы набрали " + score + " шт. вкусняшек");
}

window.onload = init;