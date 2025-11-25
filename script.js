const currencies = {
  money: 0,
  mm: 0,
};
let lastAutoclick = 0;
const autoclickInterval = 10;

load();

function buyUpgrade(id, currency = "money") {
  const up = upgrades[id];
  const max = typeof up.max === "function" ? up.max() : up.max;
  if (
    currencies[currency] >= getCost(up) &&
    ((max && up.count < max) || !max)
  ) {
    currencies[currency] -= getCost(up);
    up.count += 1;
    up.update();
  }
}

function moneyMultiplier() {
  let n = 1;
  n = n + upgrades["extra-dollar"].count;
  n = n + upgrades["bonus-dollars"].eff();
  n = n * upgrades["compress-dollars"].eff();
  n = n ** upgrades["smart-investments"].eff();
  return n;
}

function mmMultiplier() {
  if (currencies.money < 250_000_000) return 0;

  let n = currencies.money / 250_000_000;
  return n;
}

function moneyButtonPressed() {
  currencies.money += moneyMultiplier();
  updateDisplays();
}

function checkElementsToShow() {
  for (const info of Object.values(elementRequirements)) {
    let elements = [];
    if (info.elementIds) {
      elements = info.elementIds;
    } else {
      elements.push(info.elementId);
    }

    for (const elementId of elements) {
      const attributes = document.getElementById(elementId).attributes;
      if (
        (info.isHidden && info.requirement()) ||
        (!info.isHidden && attributes.getNamedItem("hidden"))
      ) {
        attributes.removeNamedItem("hidden");
        info.isHidden = false;
      }
    }
  }
}

function autoclick() {
  lastAutoclick += autoclickInterval;
  if (
    upgrades["hire-someone"].count > 0 &&
    1000 / upgrades["hire-someone"].count < lastAutoclick
  ) {
    moneyButtonPressed();
    lastAutoclick = 0;
  }
}

function convertMoneyToMM() {
  if (currencies.money >= 250_000_000) {
    currencies.mm = currencies.mm + mmMultiplier();
    currencies.money = 0;

    upgrades["mm-increases-multiplier"].update();
  }
}

function updateDisplays() {
  const updateText = (id, text) =>
    (document.getElementById(id).innerText = text);

  updateText("money-display", `You have $${f(currencies.money)}.`);
  updateText("eff-display", `Effective multiplier: ${f(moneyMultiplier())}x`);
  updateText(
    "auto-display",
    upgrades["hire-someone"].count > 0
      ? `Making $${f(
          moneyMultiplier() * upgrades["hire-someone"].count
        )} every second`
      : "???"
  );

  updateText(
    "mm-convert-display",
    `Convert for $MM ${f(mmMultiplier())}`
  );
  updateText("mm-display", `You have $MM ${f(currencies.mm)}.`);
}

function gameLoop() {
  checkElementsToShow();
  updateDisplays();
}

setInterval(gameLoop, 50);
setInterval(autoclick, autoclickInterval);
setInterval(save, 5000);
