// ----------------------------------
// MoneyQuest Kids — Story Upgrade
// ----------------------------------

let money = 20;
let level = 1;
let badges = [];
let upgrades = [];
let playerName = "";
let currentScene = 0;
let textSize = 16;

// ----------------------------------
// STORY DATA — LINEAR BUT MEANINGFUL
// ----------------------------------

const scenes = [
  {
    place: "🏠 Morning at Home",
    story:
      "{name}, today feels important. You’re saving for something special — something you really want.\n\nYou open your wallet. You have $20.\n\nBefore school, you feel hungry. What do you do?",
    choices: [
      {
        text: "🍳 Eat breakfast at home and pack lunch",
        money: -3,
        lesson: "Planning ahead saves money and helps your future self.",
        upgrade: "Planning 🧠"
      },
      {
        text: "🍔 Buy breakfast on the way",
        money: -10,
        lesson: "Convenience feels good, but it can cost more than you expect."
      },
      {
        text: "⏰ Skip breakfast to save money",
        money: 0,
        lesson: "Saving matters — but your health matters too.",
        badge: "Determined 💪"
      }
    ]
  },
  {
    place: "🏫 School Lunch",
    story:
      "At school, {name}, your friends are heading to the cafeteria.\n\nYou think about your goal and about the choice you made this morning.\n\nWhat do you do now?",
    choices: [
      {
        text: "🥪 Eat the lunch you packed",
        money: 0,
        lesson: "This is the reward of planning ahead.",
        badge: "Smart Saver 🏅"
      },
      {
        text: "🍕 Buy pizza with friends",
        money: -7,
        lesson: "Social moments are important — balance is key."
      },
      {
        text: "🤝 Share snacks with a friend",
        money: -3,
        lesson: "Creative thinking helps stretch your money.",
        upgrade: "Problem Solving 🧩"
      }
    ]
  },
  {
    place: "🏙️ After School",
    story:
      "After school, {name}, you walk past a store window full of cool things.\n\nFor a moment, you imagine owning them — then remember your bigger goal.\n\nWhat’s your move?",
    choices: [
      {
        text: "🛍️ Go inside just to look",
        money: -5,
        lesson: "Browsing can sometimes turn into spending."
      },
      {
        text: "🚶 Walk past and go home",
        money: 0,
        lesson: "Staying focused builds discipline.",
        badge: "Focused 🎯"
      },
      {
        text: "📱 Check prices online instead",
        money: 0,
        lesson: "Research helps you make smarter decisions.",
        upgrade: "Research 📚"
      }
    ]
  },
  {
    place: "💼 Opportunity",
    story:
      "That evening, {name}, your neighbor knocks on your door.\n\n\"Hey! I need help organizing my garage this weekend. I can pay you $15.\"",
    choices: [
      {
        text: "✅ Accept the job",
        money: +15,
        lesson: "Great choice! Earning money moves you closer to your goal.",
        badge: "Hard Worker 🛠️",
        upgrade: "Work Ethic 🔥"
      },
      {
        text: "🤔 Say maybe later",
        money: 0,
        lesson: "Opportunities don’t always wait."
      },
      {
        text: "❌ Decline — you want to rest",
        money: 0,
        lesson: "Rest is important — balance matters."
      }
    ]
  },
  {
    place: "🛒 The Big Decision",
    story:
      "{name}, a few days later, you finally see the exact thing you’ve been saving for.\n\nIt costs $35.\n\nYou check your wallet and take a deep breath.",
    choices: [
      {
        text: "💳 Try to buy it now",
        lesson: "Let’s see if you saved enough!"
      },
      {
        text: "⏳ Wait and save a little more",
        money: +5,
        lesson: "Patience usually leads to better outcomes.",
        upgrade: "Delayed Gratification ⏱️"
      },
      {
        text: "🔍 Look for a cheaper alternative",
        money: +3,
        lesson: "Flexibility helps stretch your money.",
        upgrade: "Smart Shopping 🛍️"
      }
    ]
  }
];

// ----------------------------------
// UI HELPERS
// ----------------------------------

function updateStats() {
  document.getElementById("money").innerText = money;
  document.getElementById("level").innerText = level;
  document.getElementById("badges").innerText =
    badges.length === 0 ? "None" : badges.join(", ");
  document.getElementById("upgrades").innerText =
    upgrades.length === 0 ? "None" : upgrades.join(", ");
}

function setStory(text) {
  document.getElementById("story").innerText = text;
}

function setPlaceTag(text) {
  document.getElementById("placeTag").innerText = text;
}

function setLesson(text) {
  document.getElementById("lesson").innerText = text;
}

function clearChoices() {
  document.getElementById("choices").innerHTML = "";
}

// ----------------------------------
// ACCESSIBILITY
// ----------------------------------

function toggleContrast() {
  document.getElementById("app").classList.toggle("high-contrast");
}

function changeTextSize(delta) {
  textSize += delta * 2;
  if (textSize < 14) textSize = 14;
  if (textSize > 24) textSize = 24;
  document.getElementById("app").style.fontSize = textSize + "px";
}

// ----------------------------------
// GAME FLOW
// ----------------------------------

function startGame() {
  const input = document.getElementById("nameInput").value.trim();
  if (input === "") {
    alert("Please enter your name 😊");
    return;
  }

  playerName = input;
  money = 20;
  level = 1;
  badges = [];
  upgrades = [];
  currentScene = 0;

  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("gameContent").style.display = "block";

  updateProgress();
  loadScene();
}

function loadScene() {
  const scene = scenes[currentScene];

  setPlaceTag(scene.place);
  setStory(scene.story.replaceAll("{name}", playerName));
  setLesson("");
  clearChoices();

  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;
    btn.onclick = () => chooseOption(choice);
    document.getElementById("choices").appendChild(btn);
  });

  updateStats();
}

function chooseOption(choice) {
  if (choice.money) money += choice.money;
  if (money < 0) money = 0;

  if (choice.badge && !badges.includes(choice.badge)) {
    badges.push(choice.badge);
  }

  if (choice.upgrade && !upgrades.includes(choice.upgrade)) {
    upgrades.push(choice.upgrade);
  }

  setLesson("💡 " + choice.lesson);
  updateStats();

  setTimeout(() => {
    currentScene++;
    level++;
    updateProgress();

    if (currentScene >= scenes.length) {
      showEnding();
    } else {
      loadScene();
    }
  }, 500);
}

// ----------------------------------
// PROGRESS BAR
// ----------------------------------

function updateProgress() {
  const percent = (currentScene / scenes.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// ----------------------------------
// ENDING
// ----------------------------------

function showEnding() {
  clearChoices();
  setPlaceTag("🏁 Your Ending");

  let endingText = "";

  if (money >= 35) {
    endingText = `🎉 Congratulations, ${playerName}!\n\nYou reached your goal and bought what you dreamed of — without stress or regret.\n\nFinal money: $${money}`;
    badges.push("Money Hero 🌟");
  } else if (money >= 20) {
    endingText = `😊 Great job, ${playerName}!\n\nYou didn’t reach your full goal yet, but you built powerful money habits.\n\nFinal money: $${money}`;
    badges.push("Growing Saver 🌱");
  } else {
    endingText = `💭 ${playerName}, this journey taught you something important.\n\nEven when goals aren’t reached, learning is powerful.\n\nFinal money: $${money}`;
    badges.push("Learning Hero 📘");
  }

  setStory(endingText);
  updateStats();

  document.getElementById("choices").innerHTML =
    `<button class="choice-btn" onclick="resetGame()">Play Again 🔄</button>`;
}

function resetGame() {
  document.getElementById("welcomeScreen").style.display = "block";
  document.getElementById("gameContent").style.display = "none";
}
