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
const thinkBox = document.querySelector(".think__box");
const modalBox = document.querySelector(".modal__box");
const winLoseText = document.querySelector(".win__lose__text");
const winnerIcon = document.querySelector(".winner__icon");
const winnerText = document.querySelector(".winner__text");
const displayTurnBox = document.querySelector(".display__turn__box");
const xScores = document.querySelector(".x__scores");
const oScores = document.querySelector(".o__scores");
const tiesScores = document.querySelector(".ties__score");
const restartModal = document.querySelector(".restart__modal");
const restartText = document.querySelector(".restart__game");
const noRestart = document.querySelector(".no__restart");
const yesRestart = document.querySelector(".yes__restart");
const tiedModal = document.querySelector(".tied__modal");
const overlay = document.querySelector(".overlay");

const showThinkingMessage = function () {
  thinkBox.style.display = "flex";

  setTimeout(function () {
    thinkBox.style.display = "none";
  }, 2000); // Delay for 2 seconds (2000 milliseconds)
};

let currentPlayer = "x";
let userChoice = "x";
const updateTurnDisplay = function () {
  displayTurnBox.innerHTML = `
    <svg class="select__turn__${currentPlayer ? currentPlayer : "x"}">
      <use xlink:href="assets/icon-${
        currentPlayer ? currentPlayer : "x"
      }-select.svg#icon-${currentPlayer ? currentPlayer : "x"}"></use>
    </svg>
    <p class="turn__name">turn</p>
  `;
};

const updateIconDisplay = function (e) {
  iconXBox.classList.remove("active__icon__box");
  iconOBox.classList.remove("active__icon__box");

  const iconBox = e.target;
  if (iconBox.closest(".icon__x__box")) {
    iconBox.closest(".icon__x__box").classList.add("active__icon__box");
    userChoice = "x";
    gameSection.classList.remove("o-choice");
    gameSection.classList.add("x-choice");
  }
  if (iconBox.closest(".icon__o__box")) {
    iconBox.closest(".icon__o__box").classList.add("active__icon__box");
    userChoice = "o";
    gameSection.classList.add("o-choice");
    gameSection.classList.remove("x-choice");
  }
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

const checkWinner = function () {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      cells[a].classList.contains(`game__tiles__${currentPlayer}`) &&
      cells[b].classList.contains(`game__tiles__${currentPlayer}`) &&
      cells[c].classList.contains(`game__tiles__${currentPlayer}`)
    ) {
      updateScores(currentPlayer);
      let icon, text, winnerClass;
      if (currentPlayer === userChoice) {
        icon = `icon-${userChoice}.svg`;
        text = "You won";
        winnerClass = `winner__${userChoice}`;
      } else {
        const lostChoice = userChoice === "x" ? "o" : "x";
        icon = `icon-${lostChoice}.svg`;
        text = `Oh no, you lost to ${lostChoice.toUpperCase()}…`;
        winnerClass = `winner__${lostChoice}`;
      }
      winnerIcon.src = `assets/${icon}`;
      winLoseText.textContent = text;
      winnerText.classList.add(winnerClass);

      // Show the modal
      modalBox.style.opacity = "1";
      modalBox.style.visibility = "visible";
      modalBox.style.transform = "translateY(0)";
      overlay.style.display = "block";

      return true;
    }
  }

  // No winner found, check if it's a tie
  const isBoardFull = Array.from(cells).every((cell) => {
    return (
      cell.classList.contains("game__tiles__x") ||
      cell.classList.contains("game__tiles__o")
    );
  });

  if (isBoardFull) {
    // It's a tie
    // Perform any necessary actions for a tie game
    updateScores(null);

    // Show the modal
    tiedModal.style.opacity = "1";
    tiedModal.style.visibility = "visible";
    tiedModal.style.transform = "translateY(0)";
    overlay.style.display = "block";

    console.log("It's a tie!");

    return true;
  }

  return false;
};
const updateScores = function (winner) {
  let xScore = parseInt(xScores.textContent);
  let oScore = parseInt(oScores.textContent);
  let tiesScore = parseInt(tiesScores.textContent);

  if (winner === "x") {
    xScore += 1;
  } else if (winner === "o") {
    oScore += 1;
  } else {
    tiesScore += 1;
  }

  xScores.textContent = xScore;
  oScores.textContent = oScore;
  tiesScores.textContent = tiesScore;
};

const computerMove = function () {
  if (checkWinner()) {
    return;
  }
  showThinkingMessage();

  setTimeout(function () {
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
      cells[randomIndex].classList.add(
        `game__tiles__${currentPlayer}`,
        "game__tiles--filled"
      );

      // Call the checkWinner function to check if there is a winner
      if (checkWinner()) {
        return;
      }

      // Switch the current player to the other symbol
      currentPlayer = currentPlayer === "x" ? "o" : "x";

      // Update the turn display in the game header
      updateTurnDisplay();

      // Check if it's the computer's turn to move (currentPlayer is "x" or "o" based on user choice)
      if (userChoice === "o" && currentPlayer === "x") {
        computerMove();
      } else if (userChoice === "x" && currentPlayer === "o") {
        computerMove();
      }
    } else {
      // If the selected cell is not empty, try again
      computerMove();
    }
  }, 2000);
};

const playVsCpu = function (e) {
  homeSection.style.display = "none";
  gameSection.style.display = "flex";

  currentPlayer = userChoice === "x" ? "o" : "x"; // Set the current player based on the user's choice

  updateTurnDisplay(); // Update the turn display in the game header

  if (currentPlayer === "x") {
    // If the current player is "x", it's the computer's turn to play first
    computerMove();
  }
};

// console.log(selectIconBox);

selectIconBox.addEventListener("click", updateIconDisplay);

vsCpu.addEventListener("click", playVsCpu);

cells.forEach((cell, i) => {
  cell.addEventListener("click", function () {
    if (
      !cell.classList.contains("game__tiles__x") &&
      !cell.classList.contains("game__tiles__o") &&
      userChoice &&
      !checkWinner()
    ) {
      // Set the background image for the selected cell based on the current player (userChoice)
      cell.style.backgroundImage = `url(assets/icon-${userChoice}.svg)`;

      // Add the corresponding class to the selected cell
      cell.classList.add(`game__tiles__${userChoice}`, "game__tiles--filled");

      // Call the checkWinner function to check if there is a winner
      if (checkWinner()) return;

      // Switch the current player to the other symbol
      currentPlayer = userChoice === "x" ? "o" : "x";

      updateTurnDisplay();
      // Check if it's the computer's turn to move (currentPlayer is "x" or "o" based on user choice)
      if (userChoice === "o" && currentPlayer === "x") {
        computerMove();
      } else if (userChoice === "x" && currentPlayer === "o") {
        computerMove();
      }
    }
  });
});
