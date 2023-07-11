"use strict";
const selectIconBox = document.querySelector(".select__icons");
const vsCpu = document.querySelector(".select__cpu");
const vsPlayer = document.querySelector(".select__player");
const homeSection = document.querySelector(".home__section");
const gameSection = document.querySelector(".game__section");

const iconXBox = document.querySelector(".icon__x__box");
const iconOBox = document.querySelector(".icon__o__box");
const activeIconBox = document.querySelectorAll(".active__icon__box");
const cells = document.querySelectorAll(".game__tiles");

// console.log(selectIconBox);

selectIconBox.addEventListener("click", function (e) {
  // activeIconBox.classList.remove("active__icon__box");

  iconXBox.classList.remove("active__icon__box");
  iconOBox.classList.remove("active__icon__box");
  const iconBox = e.target;
  console.log(iconBox);
  if (iconBox.closest(".icon__x__box")) {
    iconBox.closest(".icon__x__box").classList.add("active__icon__box");
  }
  if (iconBox.closest(".icon__o__box")) {
    iconBox.closest(".icon__o__box").classList.add("active__icon__box");
  }
});

vsCpu.addEventListener("click", function (e) {
  homeSection.style.display = "none";
  gameSection.style.display = "flex";
});

let currentPlayer = "x";

const computerMove = function () {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * 9);

  // Check if the selected cell is empty
  if (
    !cells[randomIndex].classList.contains("game__tiles__x") &&
    !cells[randomIndex].classList.contains("game__tiles__o")
  ) {
    // Set the background image for the selected cell based on the current player
    cells[
      randomIndex
    ].style.backgroundImage = `url(assets/icon-${currentPlayer}.svg)`;

    // Add the corresponding class to the selected cell
    cells[randomIndex].classList.add(`game__tiles__${currentPlayer}`);

    // Switch the current player to the other symbol
    currentPlayer = currentPlayer === "x" ? "o" : "x";
  } else {
    // If the selected cell is not empty, try again
    computerMove();
  }
};

cells.forEach((cell, i) => {
  cell.addEventListener("click", function () {
    if (
      !cell.classList.contains("game__tiles__x") &&
      !cell.classList.contains("game__tiles__o") &&
      currentPlayer === "x"
    ) {
      // Set the background image for the selected cell to "x"
      cell.style.backgroundImage = "url(assets/icon-x.svg)";

      // Add the corresponding class to the selected cell
      cell.classList.add("game__tiles__x");

      // Switch the current player to "o"
      currentPlayer = "o";

      // Call the computer's move function
      computerMove();
    }
  });
});

// JavaScript code for the Tic-Tac-Toe game
// gameSection.addEventListener("click", function () {
//   const cells = document.querySelectorAll(".game__tiles");

//   // Game state
//   const gameState = {
//     board: ["", "", "", "", "", "", "", "", ""],
//     currentPlayer: "X",
//     scores: {
//       X: 0,
//       O: 0,
//       ties: 0,
//     },
//   };
//   console.log(gameState);

//   // Get game board cells

//   // Add event listeners to game board cells
//   cells.forEach(function (cell, index) {
//     cell.addEventListener("click", function () {
//       if (gameState.board[index] === "" && !isGameOver(gameState)) {
//         // Update game state
//         gameState.board[index] = gameState.currentPlayer;

//         // Update game board UI
//         cell.classList.add("game__tiles__x");

//         // Check for a win or tie
//         if (isGameOver(gameState)) {
//           var winner = getWinner(gameState);
//           if (winner === "X" || winner === "O") {
//             gameState.scores[winner]++;
//           } else {
//             gameState.scores.ties++;
//           }
//           updateScoresUI();
//           setTimeout(resetGame, 1000);
//         } else {
//           // Switch to the next player
//           gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";

//           // Let the computer make its move
//           setTimeout(computerMove, 1000);
//         }
//       }
//     });
//   });

//   // Computer's move
//   function computerMove() {
//     // Randomly select an empty cell for the computer's move
//     var emptyCells = gameState.board.reduce(function (acc, value, index) {
//       if (value === "") {
//         acc.push(index);
//       }
//       return acc;
//     }, []);
//     var randomIndex = Math.floor(Math.random() * emptyCells.length);
//     var computerIndex = emptyCells[randomIndex];

//     // Update game state
//     gameState.board[computerIndex] = gameState.currentPlayer;

//     // Update game board UI
//     cells[computerIndex].classList.add("game__tiles__o");

//     // Check for a win or tie
//     if (isGameOver(gameState)) {
//       var winner = getWinner(gameState);
//       if (winner === "X" || winner === "O") {
//         gameState.scores[winner]++;
//       } else {
//         gameState.scores.ties++;
//       }
//       updateScoresUI();
//       setTimeout(resetGame, 1000);
//     } else {
//       // Switch to the next player
//       gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
//     }
//   }

//   // Check if the game is over (win or tie)
//   function isGameOver(state) {
//     return (
//       getWinner(state) ||
//       state.board.every(function (cell) {
//         return cell !== "";
//       })
//     );
//   }

//   // Get the winner of the game
//   function getWinner(state) {
//     var winningCombos = [
//       [0, 1, 2],
//       [3, 4, 5],
//       [6, 7, 8], // Rows
//       [0, 3, 6],
//       [1, 4, 7],
//       [2, 5, 8], // Columns
//       [0, 4, 8],
//       [2, 4, 6], // Diagonals
//     ];
//     for (var i = 0; i < winningCombos.length; i++) {
//       var [a, b, c] = winningCombos[i];
//       if (
//         state.board[a] &&
//         state.board[a] === state.board[b] &&
//         state.board[a] === state.board[c]
//       ) {
//         return state.board[a];
//       }
//     }
//     return null;
//   }

//   // Update scores UI
//   function updateScoresUI() {
//     // Update scores display with the values from gameState.scores
//   }

//   // Reset the game state and UI
//   function resetGame() {
//     // Clear the game board
//     cells.forEach(function (cell) {
//       cell.textContent = "";
//     });

//     // Reset the game state
//     gameState.board = ["", "", "", "", "", "", "", "", ""];
//     gameState.currentPlayer = "X";
//   }
// });
