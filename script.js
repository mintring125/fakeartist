const keywords = [
  "공룡", "강아지", "고양이", "토끼", "판다", "호랑이", "사자", "여우", "코끼리", "기린",
  "원숭이", "햄스터", "병아리", "펭귄", "고래", "돌고래", "문어", "상어", "거북이", "개구리",
  "무지개", "구름", "해님", "달", "별", "화산", "눈사람", "바다", "섬", "폭포",
  "우주선", "로켓", "비행기", "기차", "자동차", "자전거", "잠수함", "열기구", "소방차", "경찰차",
  "로봇", "마법사", "공주", "왕관", "해적", "슈퍼히어로", "외계인", "드래곤", "유니콘", "요정",
  "아이스크림", "피자", "햄버거", "떡볶이", "치킨", "핫도그", "도넛", "케이크", "수박", "딸기",
  "바나나", "포도", "복숭아", "사탕", "팝콘", "초콜릿", "김밥", "라면", "만두", "쿠키",
  "축구공", "농구공", "야구배트", "스케이트", "수영장", "미끄럼틀", "그네", "트램펄린", "연", "보물상자",
  "크리스마스트리", "생일케이크", "선물상자", "풍선", "캠핑텐트", "놀이공원", "회전목마", "관람차", "성", "다리",
  "연필", "책가방", "공책", "시계", "안경", "우산", "모자", "양말", "장갑", "칫솔",
  "엄마", "선생님", "유튜버", "유재석"
];

const setupScreen = document.getElementById("setup-screen");
const revealScreen = document.getElementById("reveal-screen");
const timerScreen = document.getElementById("timer-screen");
const resultScreen = document.getElementById("result-screen");

const playerCountSelect = document.getElementById("player-count");
const generateButton = document.getElementById("generate-button");
const customToggleButton = document.getElementById("custom-toggle-button");
const customPanel = document.getElementById("custom-panel");
const customKeywordInput = document.getElementById("custom-keyword");
const customGenerateButton = document.getElementById("custom-generate-button");
const roundLabel = document.getElementById("round-label");
const playerLabel = document.getElementById("player-label");
const instructionLabel = document.getElementById("instruction-label");
const secretCard = document.getElementById("secret-card");
const secretPlaceholder = document.getElementById("secret-placeholder");
const secretContent = document.getElementById("secret-content");
const secretRole = document.getElementById("secret-role");
const secretWord = document.getElementById("secret-word");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");
const turnStatus = document.getElementById("turn-status");
const timerInstruction = document.getElementById("timer-instruction");
const timerDisplay = document.getElementById("timer-display");
const timerButtons = Array.from(document.querySelectorAll(".timer-button"));
const revealFakeButton = document.getElementById("reveal-fake-button");
const fakeResultText = document.getElementById("fake-result-text");
const finalWord = document.getElementById("final-word");

let gameState = null;
let timerId = null;

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function showScreen(target) {
  [setupScreen, revealScreen, timerScreen, resultScreen].forEach((screen) => {
    screen.classList.toggle("active", screen === target);
  });
}

function createGame(keywordOverride = "") {
  const playerCount = Number(playerCountSelect.value);
  const fakeArtist = Math.floor(Math.random() * playerCount);
  const keyword = keywordOverride || pickRandom(keywords);

  gameState = {
    playerCount,
    fakeArtist,
    keyword,
    currentPlayer: 0,
    revealed: false,
    turnCount: 0,
    totalTurns: playerCount * 2,
    timerRunning: false
  };

  updateRevealScreen();
  showScreen(revealScreen);
}

function toggleCustomPanel() {
  const isHidden = customPanel.classList.toggle("hidden");
  customToggleButton.textContent = isHidden ? "커스텀 주제어" : "닫기";
  if (!isHidden) {
    customKeywordInput.focus();
  }
}

function createCustomGame() {
  const keyword = customKeywordInput.value.trim();
  if (!keyword) {
    customKeywordInput.focus();
    return;
  }
  createGame(keyword);
}

function updateRevealScreen() {
  const index = gameState.currentPlayer;

  roundLabel.textContent = `${index + 1}번째 확인`;
  playerLabel.textContent = `${index + 1}번 플레이어`;
  instructionLabel.textContent = "혼자만 확인하세요. 큰 카드를 눌러 역할을 봅니다.";
  secretPlaceholder.classList.remove("hidden");
  secretContent.classList.add("hidden");
  nextButton.classList.add("hidden");
  gameState.revealed = false;
}

function revealRole() {
  if (!gameState || gameState.revealed) {
    return;
  }

  const isFakeArtist = gameState.currentPlayer === gameState.fakeArtist;

  secretRole.textContent = isFakeArtist ? "당신은 가짜예술가" : "당신의 주제어";
  secretWord.textContent = isFakeArtist ? "비밀입니다!" : gameState.keyword;

  secretPlaceholder.classList.add("hidden");
  secretContent.classList.remove("hidden");
  nextButton.classList.remove("hidden");
  instructionLabel.textContent = isFakeArtist
    ? "주제어를 모른 척하고 그림 흐름을 잘 따라가세요."
    : "주제어를 기억한 뒤 다음 사람에게 태블릿을 넘기세요.";

  nextButton.textContent = gameState.currentPlayer === gameState.playerCount - 1
    ? "게임 시작하기"
    : "다음 사람에게 넘기기";

  gameState.revealed = true;
}

function goNext() {
  if (!gameState || !gameState.revealed) {
    return;
  }

  if (gameState.currentPlayer === gameState.playerCount - 1) {
    prepareTimerScreen();
    showScreen(timerScreen);
    return;
  }

  gameState.currentPlayer += 1;
  updateRevealScreen();
}

function updateTimerScreen() {
  turnStatus.textContent = `${gameState.turnCount + 1} / ${gameState.totalTurns} 차례`;
  timerDisplay.textContent = "준비";
  timerInstruction.textContent = "시간 버튼을 누르면 해당 차례 타이머가 시작됩니다.";
  revealFakeButton.classList.toggle("hidden", gameState.turnCount < gameState.totalTurns);
  timerButtons.forEach((button) => {
    button.disabled = gameState.turnCount >= gameState.totalTurns;
  });
}

function prepareTimerScreen() {
  gameState.turnCount = 0;
  gameState.timerRunning = false;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  updateTimerScreen();
}

function formatTime(seconds) {
  if (seconds >= 60 && seconds % 60 === 0) {
    return `${seconds / 60}분`;
  }
  return `${seconds}초`;
}

function startTimer(seconds) {
  if (!gameState || gameState.timerRunning || gameState.turnCount >= gameState.totalTurns) {
    return;
  }

  gameState.timerRunning = true;
  timerButtons.forEach((button) => {
    button.disabled = true;
  });

  let remaining = seconds;
  timerInstruction.textContent = `${gameState.turnCount + 1}번째 차례 진행 중`;
  timerDisplay.textContent = remaining;

  timerId = setInterval(() => {
    remaining -= 1;

    if (remaining > 0) {
      timerDisplay.textContent = remaining;
      return;
    }

    clearInterval(timerId);
    timerId = null;
    gameState.turnCount += 1;
    gameState.timerRunning = false;

    if (gameState.turnCount >= gameState.totalTurns) {
      turnStatus.textContent = `${gameState.totalTurns} / ${gameState.totalTurns} 차례 완료`;
      timerInstruction.textContent = "모든 차례가 끝났습니다. 가짜 예술가를 확인하세요.";
      timerDisplay.textContent = "끝";
      revealFakeButton.classList.remove("hidden");
      return;
    }

    turnStatus.textContent = `${gameState.turnCount + 1} / ${gameState.totalTurns} 차례`;
    timerInstruction.textContent = `${formatTime(seconds)} 종료. 다음 차례 시간을 선택하세요.`;
    timerDisplay.textContent = "준비";
    timerButtons.forEach((button) => {
      button.disabled = false;
    });
  }, 1000);
}

function revealFakeArtist() {
  if (!gameState || gameState.turnCount < gameState.totalTurns) {
    return;
  }

  fakeResultText.textContent = `가짜 예술가는 ${gameState.fakeArtist + 1}번째 사람이었습니다.`;
  finalWord.textContent = gameState.keyword;
  showScreen(resultScreen);
}

generateButton.addEventListener("click", () => {
  createGame();
});
customToggleButton.addEventListener("click", toggleCustomPanel);
customGenerateButton.addEventListener("click", createCustomGame);
secretCard.addEventListener("click", revealRole);
nextButton.addEventListener("click", goNext);
timerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startTimer(Number(button.dataset.seconds));
  });
});
revealFakeButton.addEventListener("click", revealFakeArtist);
restartButton.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  customKeywordInput.value = "";
  showScreen(setupScreen);
});
