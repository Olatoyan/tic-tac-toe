"use strict";
const selectIconBox = document.querySelector(".select__icons");
const vsCpu = document.querySelector(".select__cpu");
const vsPlayer = document.querySelector(".select__player");
const homeSection = document.querySelector(".home__section");
const gameSection = document.querySelector(".game__section");
const restartBox = document.querySelector(".restart__box");

const iconXBox = document.querySelector(".icon__x__box");
const iconOBox = document.querySelector(".icon__o__box");
const activeIconBox = document.querySelectorAll(".active__icon__box");
const cells = document.querySelectorAll(".game__tiles");
const thinkBox = document.querySelector(".think__box");
const modalBox = document.querySelector(".modal__box");
const modalContent = document.querySelector(".modal__content");
const winLoseText = document.querySelector(".win__lose__text");
const winnerIcon = document.querySelector(".winner__icon");
const winnerText = document.querySelector(".winner__text");
const displayTurnBox = document.querySelector(".display__turn__box");
const xScores = document.querySelector(".x__scores");
const oScores = document.querySelector(".o__scores");
const tiesScores = document.querySelector(".ties__score");
const restartModal = document.querySelector(".restart__modal");
const restartContainer = document.querySelector(".restart__container");
const restartText = document.querySelector(".restart__game");
const noRestart = document.querySelector(".no__restart");
const yesRestart = document.querySelector(".yes__restart");
const tiedModal = document.querySelector(".tied__modal");
const tiedContainer = document.querySelector(".tied__container");
const overlay = document.querySelector(".overlay");

let currentPlayer = "x";
let userChoice = "x";
let computerChoice = "o";
let gameMode;
const showThinkingMessage = function () {
  thinkBox.style.opacity = "1";
  gameSection.classList.add("computer-turn");

  setTimeout(function () {
    thinkBox.style.opacity = "0";

    if (currentPlayer === userChoice) {
      enableCellClicks();
    }
  }, 2000);
};

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

const updateGameScoresText = function (xText, oText) {
  const xPersonEl = document.querySelector(".x__name");
  const oPersonEl = document.querySelector(".o__name");

  xPersonEl.textContent = xText;
  oPersonEl.textContent = oText;
};

const updateIconBox = function (e) {
  const iconBox = e.target;
  if (iconBox.closest(".icon__x__box")) {
    iconBox.closest(".icon__x__box").classList.add("active__icon__box");
    iconOBox.classList.remove("active__icon__box");

    userChoice = "x";
    computerChoice = "o";
    currentPlayer = "x";
    if (vsPlayer.classList.contains("active")) {
      updateGameScoresText("x (p1)", "o (p2)");
      gameSection.classList.add("x-choice");
      gameSection.classList.remove("o-choice");
    } else {
      updateGameScoresText("x (you)", "o (cpu)");
      gameSection.classList.remove("o-choice");
      gameSection.classList.add("x-choice");
    }
  }
  if (iconBox.closest(".icon__o__box")) {
    iconBox.closest(".icon__o__box").classList.add("active__icon__box");
    iconXBox.classList.remove("active__icon__box");

    userChoice = "o";
    computerChoice = "x";
    currentPlayer = "x";
    if (vsPlayer.classList.contains("active")) {
      updateGameScoresText("x (p2)", "o (p1)");
      gameSection.classList.add("x-choice");
      gameSection.classList.remove("o-choice");
    } else {
      updateGameScoresText("x (cpu)", "o (you)");
      gameSection.classList.add("o-choice");
      gameSection.classList.remove("x-choice");
    }
  }
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
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
        text = `Oh no, you lost…`;
        winnerClass = `winner__${lostChoice}`;
      }

      winnerText.classList.remove(`winner__x`, `winner__o`);
      winnerIcon.src = `assets/${icon}`;
      winLoseText.textContent = text;
      winnerText.classList.add(winnerClass);
      if (currentPlayer !== userChoice) {
        disableCellClicks();
      }
      setTimeout(() => {
        showHiddenContainers(modalBox);
      }, 500);

      return true;
    }
  }

  const isBoardFull = Array.from(cells).every((cell) => {
    return (
      cell.classList.contains("game__tiles__x") ||
      cell.classList.contains("game__tiles__o")
    );
  });

  if (isBoardFull) {
    updateScores(null);
    setTimeout(() => {
      showHiddenContainers(tiedModal);
    }, 500);

    return true;
  }

  return false;
};
const checkWinnerVsPlayer = function () {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (
      cells[a].classList.contains(`game__tiles__x`) &&
      cells[b].classList.contains(`game__tiles__x`) &&
      cells[c].classList.contains(`game__tiles__x`)
    ) {
      updateScores("x");
      winnerText.classList.remove(`winner__x`, `winner__o`);
      winnerIcon.src = `assets/icon-x.svg`;
      winLoseText.textContent = "Player 1 (X) wins";
      winnerText.classList.add("winner__x");

      // Show the modal
      setTimeout(() => {
        showHiddenContainers(modalBox);
      }, 500);

      return true;
    }

    if (
      cells[a].classList.contains(`game__tiles__o`) &&
      cells[b].classList.contains(`game__tiles__o`) &&
      cells[c].classList.contains(`game__tiles__o`)
    ) {
      updateScores("o");
      winnerText.classList.remove(`winner__x`, `winner__o`);
      winnerIcon.src = `assets/icon-o.svg`;
      winLoseText.textContent = "Player 2 (O) wins";
      winnerText.classList.add("winner__o");

      // Show the modal
      setTimeout(() => {
        showHiddenContainers(modalBox);
      }, 500);

      return true;
    }
  }

  const isBoardFull = Array.from(cells).every((cell) => {
    return (
      cell.classList.contains("game__tiles__x") ||
      cell.classList.contains("game__tiles__o")
    );
  });

  if (isBoardFull) {
    updateScores(null);

    // Show the modal
    showHiddenContainers(tiedModal);

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

const playVsCpu = function (e) {
  homeSection.style.display = "none";
  gameSection.style.display = "grid";

  currentPlayer = userChoice === "x" ? "o" : "x";

  updateTurnDisplay();
  if (currentPlayer === "x") {
    computerMove();
  }

  gameMode = "vsCpu";
};
const computerMove = function () {
  if (checkWinner()) {
    return;
  }
  showThinkingMessage();
  disableCellClicks();

  disableCellClicks();
  setTimeout(function () {
    const randomIndex = Math.floor(Math.random() * 9);

    if (
      !cells[randomIndex].classList.contains("game__tiles__x") &&
      !cells[randomIndex].classList.contains("game__tiles__o")
    ) {
      cells[
        randomIndex
      ].style.backgroundImage = `url(assets/icon-${currentPlayer}.svg)`;

      cells[randomIndex].classList.add(
        `game__tiles__${currentPlayer}`,
        "game__tiles--filled",
        "computer-icon"
      );

      if (checkWinner()) {
        return;
      }

      currentPlayer = currentPlayer === "x" ? "o" : "x";

      updateTurnDisplay();

      if (userChoice === "o" && currentPlayer === "x") {
        computerMove();
      } else if (userChoice === "x" && currentPlayer === "o") {
        computerMove();
      }

      gameSection.classList.remove("computer-turn");
      enableCellClicks();
    } else {
      computerMove();
    }
  }, 2000);
};

const playerMove = function () {
  if (
    !this.classList.contains("game__tiles__x") &&
    !this.classList.contains("game__tiles__o") &&
    userChoice &&
    !checkWinner()
  ) {
    this.style.backgroundImage = `url(assets/icon-${userChoice}.svg)`;

    this.classList.add(`game__tiles__${userChoice}`, "game__tiles--filled");

    if (checkWinner()) return;

    currentPlayer = userChoice === "x" ? "o" : "x";

    updateTurnDisplay();
    if (userChoice === "o" && currentPlayer === "x") {
      computerMove();
    } else if (userChoice === "x" && currentPlayer === "o") {
      computerMove();
    }
  }
};

const playVsPlayer = function () {
  homeSection.style.display = "none";
  gameSection.style.display = "grid";

  currentPlayer = "x"; // Set the current player as "x" by default
  updateTurnDisplay(); // Update the turn display in the game header
  gameMode = "vsPlayer";
  gameSection.classList.remove("o-choice");
  gameSection.classList.add("x-choice");
};

const vsPlayerMove = function () {
  if (
    !this.classList.contains("game__tiles__x") &&
    !this.classList.contains("game__tiles__o") &&
    !checkWinnerVsPlayer()
  ) {
    this.style.backgroundImage = `url(assets/icon-${currentPlayer}.svg)`;

    this.classList.add(`game__tiles__${currentPlayer}`, "game__tiles--filled");

    if (checkWinnerVsPlayer()) return;

    currentPlayer = currentPlayer === "x" ? "o" : "x";

    updateTurnDisplay();

    if (currentPlayer === "x") {
      gameSection.classList.remove("o-choice");
      gameSection.classList.add("x-choice");
    } else {
      gameSection.classList.remove("x-choice");
      gameSection.classList.add("o-choice");
    }
  }
};

const disableCellClicks = function () {
  cells.forEach((cell) => {
    cell.removeEventListener("click", playerMove);
  });
  gameSection.classList.add("computer-turn");
};

const enableCellClicks = function () {
  cells.forEach((cell) => {
    cell.addEventListener("click", playerMove);
  });
  gameSection.classList.remove("computer-turn");
};

const resetGame = function () {
  selectIconBox.removeEventListener("click", updateIconBox);

  cells.forEach((cell) => {
    cell.style.backgroundImage = "";
    cell.classList.remove(
      "game__tiles__x",
      "game__tiles__o",
      "game__tiles--filled"
    );
  });

  const previousUserChoice = userChoice;

  currentPlayer = "x";
  userChoice = "x";
  computerChoice = "o";

  gameSection.classList.remove("o-choice");
  gameSection.classList.add("x-choice");

  enableCellClicks();

  selectIconBox.addEventListener("click", updateIconBox);

  if (previousUserChoice === "o") {
    userChoice = "o";
    computerChoice = "x";
    gameSection.classList.remove("x-choice");
    gameSection.classList.add("o-choice");
  }

  updateTurnDisplay();

  if (computerChoice === "x") {
    computerMove();
  }
};

const resetPlayerGame = function () {
  currentPlayer = "x";

  cells.forEach((cell) => {
    cell.style.backgroundImage = "";
    cell.classList.remove(
      "game__tiles__x",
      "game__tiles__o",
      "game__tiles--filled"
    );
  });
  gameSection.classList.remove("o-choice");
  gameSection.classList.add("x-choice");
  updateTurnDisplay();
};
const resetScores = function () {
  const xScores = document.querySelector(".x__scores");
  const oScores = document.querySelector(".o__scores");
  const tiesScore = document.querySelector(".ties__score");
  xScores.textContent = "0";
  oScores.textContent = "0";
  tiesScore.textContent = "0";
};

const showHiddenContainers = function (container) {
  container.style.opacity = "1";
  container.style.visibility = "visible";
  container.style.transform = "translateY(0)";
  overlay.style.display = "block";
};

const hideContainers = function (container) {
  container.style.opacity = "0";
  container.style.visibility = "hidden";
  container.style.transform = "translateY(100%)";
  overlay.style.display = "none";
};

const handleTiedResult = function (e) {
  const quit = e.target.classList.contains("quit__box");
  const nextRound = e.target.classList.contains("next__round");

  if (quit) {
    if (gameMode === "vsCpu") {
      resetGame();
    } else if (gameMode === "vsPlayer") {
      resetPlayerGame();
    }
    resetScores();
    location.reload();

    hideContainers(tiedModal);
  }

  if (nextRound) {
    if (gameMode === "vsCpu") {
      resetGame();
    } else if (gameMode === "vsPlayer") {
      resetPlayerGame();
    }
    hideContainers(tiedModal);
  }
};

const handleWinOrLoseResult = function (e) {
  const quitGame = e.target.classList.contains("quit__box");
  const nextRound = e.target.classList.contains("next__round");

  if (quitGame) {
    if (gameMode === "vsCpu") {
      resetGame();
    } else if (gameMode === "vsPlayer") {
      resetPlayerGame();
    }

    resetScores();
    location.reload();
    hideContainers(modalBox);
  }

  if (nextRound) {
    if (gameMode === "vsCpu") {
      resetGame();
    } else if (gameMode === "vsPlayer") {
      resetPlayerGame();
    }

    hideContainers(modalBox);
  }
};

const handleRestart = function (e) {
  const noRestart = e.target.classList.contains("no__restart");
  const yesRestart = e.target.classList.contains("yes__restart");

  if (noRestart) {
    hideContainers(restartModal);
  }

  if (yesRestart) {
    if (gameMode === "vsCpu") {
      resetGame();
    } else if (gameMode === "vsPlayer") {
      resetPlayerGame();
    }
    hideContainers(restartModal);
  }
};

modalContent.addEventListener("click", handleWinOrLoseResult);

restartBox.addEventListener("click", function () {
  showHiddenContainers(restartModal);
});

restartContainer.addEventListener("click", handleRestart);

tiedContainer.addEventListener("click", handleTiedResult);

selectIconBox.addEventListener("click", updateIconBox);

vsCpu.addEventListener("click", function () {
  playVsCpu();

  cells.forEach((cell) => {
    cell.addEventListener("click", playerMove);
  });
});

vsPlayer.addEventListener("click", function () {
  vsPlayer.classList.add("active");
  playVsPlayer();
  if (iconXBox.classList.contains("active__icon__box"))
    updateGameScoresText("x (p1)", "o (p2)");

  if (iconOBox.classList.contains("active__icon__box"))
    updateGameScoresText("x (p2)", "o (p1)");

  cells.forEach((cell) => {
    cell.addEventListener("click", vsPlayerMove);
  });

  vsCpu.classList.remove("active");
});
