let arr = [];
let click_seq = [];
let start = false;

const body = document.querySelector("body");
const level = document.querySelector("h2");
const restartBtn = document.querySelector("#restartBtn");

const boxes = [
    document.querySelector(".small_box_1"),
    document.querySelector(".small_box_2"),
    document.querySelector(".small_box_3"),
    document.querySelector(".small_box_4")
];

const colors = boxes.map(box => getComputedStyle(box).backgroundColor);

// ---------- Core Functions ----------

function changeLevel() {
    level.innerText = `Level ${arr.length + 1}`;
}

function flashBox(box, color) {
    box.style.backgroundColor = "white";
    setTimeout(() => {
        box.style.backgroundColor = color;
    }, 200);
}

function addNextColor() {
    let n = Math.floor(Math.random() * 4);
    arr.push(boxes[n]);
    flashBox(boxes[n], colors[n]);
}

function checkWin() {
    return arr.every((box, i) => box === click_seq[i]);
}

function startGame() {
    if (start) return;
    start = true;
    arr = [];
    click_seq = [];
    changeLevel();
    addNextColor();
}

function gameOver() {
    body.style.backgroundColor = "red";
    setTimeout(() => body.style.backgroundColor = "white", 200);

    // Show losing message clearly
    level.innerHTML = `You lost at Level ${arr.length}`;

    start = false;
    startCountdown();
}


function startCountdown() {
    let count = 5;
    const heading = document.createElement("h2");
    heading.innerText = "New game starts in ";
    const counter = document.createElement("span");
    counter.innerText = count;
    heading.appendChild(counter);
    body.appendChild(heading);

    const id = setInterval(() => {
        count--;
        counter.innerText = count;

        if (count === 0) {
            clearInterval(id);
            heading.remove();
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    arr = [];
    click_seq = [];
    start = false;
    level.innerText = "Press any key to start";
}

// ---------- Event Handling ----------

// Box clicking
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!start) return;

        flashBox(box, colors[index]);
        click_seq.push(box);

        // ❗ NEW: Immediately check current click
        let currentIndex = click_seq.length - 1;

        if (click_seq[currentIndex] !== arr[currentIndex]) {
            gameOver(); // wrong move instantly loses
            return;
        }

        // If sequence fully correct → next level
        if (click_seq.length === arr.length) {
            click_seq = [];
            setTimeout(() => {
                changeLevel();
                addNextColor();
            }, 500);
        }
    });
});


// Start game with keypress
document.addEventListener("keypress", startGame);

// Restart button
restartBtn.addEventListener("click", () => {
    resetGame();
});
