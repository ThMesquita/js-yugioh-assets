const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector(".score_points"),
  },
  cardSprites: {
    avatar: document.querySelector("#card-image"),
    name: document.querySelector("#card-name"),
    type: document.querySelector("#card-type"),
  },
  fieldCards: {
    player: document.querySelector("#player-field-card"),
    computer: document.querySelector("#computer-field-card"),
  },
  playersSide: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },

  actions: {
    button: document.querySelector("#next-duel"),
  },
};

const playersSide = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes white Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId() {
  const numberId = Math.floor(Math.random() * cardData.length);
  return numberId;
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === playersSide.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(idCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(idCard);
    });
  }

  return cardImage;
}

async function setCardsField(id) {
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();
  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[id].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(id, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "DRAW";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "WIN";
    state.score.playerScore++;
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "LOSE";
    state.score.computerScore++;
  }

  await playAudio(duelResults);

  return duelResults;
}

async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playersSide;
  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Atribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.cardSprites.name.innerText = "Selecione";
  state.cardSprites.type.innerText = "uma carta";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  try {
    audio.play();
  } catch {}
}

function init() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  drawCards(5, state.playersSide.player1);
  drawCards(5, state.playersSide.computer);

  const bgm = document.querySelector("#bgm");
  bgm.play();
}

init();
