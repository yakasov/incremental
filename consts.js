const elementRequirements = {
  "extra-dollar": {
    requirement: () => currencies.money >= 10,
  },
  "hire-someone": {
    requirement: () => currencies.money >= 25,
  },
  "compress-dollars": {
    requirement: () => currencies.money >= 500,
  },
  "smart-investments": {
    requirement: () => currencies.money >= 10_000,
  },
  "bonus-dollars": {
    requirement: () => currencies.money >= 500_000,
  },
  "convert-money-to-mm": {
    elementId: "convert-money-to-mm",
    requirement: () => currencies.money >= 50_000_000,
  },
  "mm-elements": {
    elementIds: ["mm-divider", "mm-display", "mm-increases-multiplier-upgrade"],
    requirement: () => currencies.mm >= 1,
  },
  "raise-maxes": {
    requirement: () => currencies.mm >= 20,
  },
  "gain-1%-of-mm": {
    requirement: () => currencies.mm >= 100,
  },
  "raise-mm": {
    requirement: () => currencies.mm >= 1_000,
  },
  "double-mm-increases-multiplier": {
    requirement: () => currencies.mm >= 25_000,
  },
};

Object.keys(elementRequirements).forEach(
  (k) => (elementRequirements[k].isHidden = true)
);

function getCost(u) {
  return u.baseCost + (u.count > 0 ? u.costScale() : 0);
}

function disableButton(e, text) {
  e.disabled = true;
  e.innerText = text;
}

const upgrades = {
  "extra-dollar": {
    baseCost: 10,
    costScale: () =>
      Math.floor(15 ** (1 + upgrades["extra-dollar"].count / 10)),
    max: () => 20 + upgrades["raise-maxes"].count * 8,
    update: () => {
      const e = document.getElementById("extra-dollar-upgrade");
      const up = upgrades["extra-dollar"];

      e.children[1].disabled = "";
      e.children[1].innerText = `$${f(getCost(up))}`;
      e.children[2].innerText = `+${up.count}`;

      if (up.count >= up.max()) {
        disableButton(e.children[1], "Maxed!");
      }
    },
  },
  "hire-someone": {
    baseCost: 50,
    costScale: () =>
      Math.floor(10 ** (1 + upgrades["hire-someone"].count / 4.25)),
    max: () => 20 + upgrades["raise-maxes"].count * 4,
    update: () => {
      const e = document.getElementById("hire-someone-upgrade");
      const up = upgrades["hire-someone"];

      e.children[1].disabled = "";
      e.children[1].innerText = `$${f(getCost(up))}`;
      e.children[2].innerText = `${up.count}/s`;

      if (up.count >= up.max()) {
        disableButton(e.children[1], "Maxed!");
      }
    },
  },
  "compress-dollars": {
    baseCost: 1_000,
    costScale: () =>
      Math.floor(200 ** (1 + upgrades["compress-dollars"].count / 6)),
    eff: () =>
      1.25 ** upgrades["compress-dollars"].count *
      upgrades["mm-increases-multiplier"].eff(),
    max: 15,
    update: () => {
      const e = document.getElementById("compress-dollars-upgrade");
      const up = upgrades["compress-dollars"];
      e.children[1].innerText = `$${f(getCost(up))}`;
      e.children[2].innerText = `${f(up.eff())}x`;

      if (up.count >= up.max) {
        disableButton(e.children[1], "Maxed!");
      }
    },
  },
  "smart-investments": {
    baseCost: 25_000,
    costScale: () =>
      (50_000 *
        (upgrades["smart-investments"].count *
          (upgrades["smart-investments"].count + 1))) /
      2,
    eff: () => 1 + upgrades["smart-investments"].count / 13.333,
    max: 10,
    update: () => {
      const e = document.getElementById("smart-investments-upgrade");
      const up = upgrades["smart-investments"];
      e.children[1].innerText = `$${f(getCost(up))}`;
      e.children[2].innerText = `^${f(up.eff())}`;

      if (up.count >= up.max) {
        disableButton(e.children[1], "Maxed!");
      }
    },
  },
  "bonus-dollars": {
    baseCost: 1_000_000,
    eff: () =>
      upgrades["bonus-dollars"].count > 0
        ? Math.min(currencies.money / 100_000, 50)
        : 0,
    max: 1,
    update: () => {
      const e = document.getElementById("bonus-dollars-upgrade");
      const up = upgrades["bonus-dollars"];

      if (up.count >= up.max) {
        disableButton(e.children[1], "Bought!");
      }
    },
  },
  "mm-increases-multiplier": {
    baseCost: 10,
    costScale: () =>
      Math.floor(5 ** (1 + upgrades["mm-increases-multiplier"].count / 5)),
    eff: () =>
      1 +
      Math.max(
        Math.log10(currencies.mm) *
          (1 + upgrades["mm-increases-multiplier"].count / 3.33),
        0
      ) *
        upgrades["double-mm-increases-multiplier"].eff(),
    max: 10,
    update: () => {
      const e = document.getElementById("mm-increases-multiplier-upgrade");
      const up = upgrades["mm-increases-multiplier"];
      e.children[1].innerText = `$MM ${f(getCost(up))}`;
      e.children[2].innerText = `${f(up.eff())}x`;

      if (up.count >= up.max) {
        disableButton(e.children[1], "Maxed!");
      }

      upgrades["compress-dollars"].update();
    },
  },
  "raise-maxes": {
    baseCost: 50,
    costScale: () => Math.floor(10 ** (1 + upgrades["raise-maxes"].count / 4)),
    max: 10,
    update: () => {
      const e = document.getElementById("raise-maxes-upgrade");
      const up = upgrades["raise-maxes"];
      e.children[1].innerText = `$MM ${f(getCost(up))}`;
      e.children[2].innerText = `+${up.count * 8} extra dollars max, +${
        up.count * 4
      } auto pressing max`;

      if (up.count >= up.max) {
        disableButton(e.children[1], "Maxed!");
      }

      upgrades["extra-dollar"].update();
      upgrades["hire-someone"].update();
    },
  },
  "gain-1%-of-mm": {
    baseCost: 250,
    max: 1,
    update: () => {
      const e = document.getElementById("gain-1%-of-mm-upgrade");
      const up = upgrades["gain-1%-of-mm"];

      if (up.count >= up.max) {
        disableButton(e.children[1], "Bought!");
      }
    },
  },
  "raise-mm": {
    baseCost: 2000,
    eff: () => (upgrades["raise-mm"].count > 0 ? 1.25 : 1),
    max: 1,
    update: () => {
      const e = document.getElementById("raise-mm-upgrade");
      const up = upgrades["raise-mm"];

      if (up.count >= up.max) {
        disableButton(e.children[1], "Bought!");
      }
    },
  },
  "double-mm-increases-multiplier": {
    baseCost: 200_000,
    costScale: () =>
      25 ** (2.2 + upgrades["double-mm-increases-multiplier"].count),
    eff: () => 2 ** upgrades["double-mm-increases-multiplier"].count,
    max: 5,
    update: () => {
      const e = document.getElementById(
        "double-mm-increases-multiplier-upgrade"
      );
      const up = upgrades["double-mm-increases-multiplier"];
      e.children[1].innerText = `$MM ${f(getCost(up))}`;

      if (up.count >= up.max) {
        disableButton(e.children[1], "Maxed!");
      }
    },
  },
};

Object.keys(upgrades).forEach((k) => (upgrades[k].count = 0));
