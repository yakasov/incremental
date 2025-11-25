const elementRequirements = {
  "extra-dollar": {
    elementId: "extra-dollar-upgrade",
    isHidden: true,
    requirement: () => currencies.money >= 10,
  },
  "hire-someone": {
    elementId: "hire-someone-upgrade",
    isHidden: true,
    requirement: () => currencies.money >= 50,
  },
  "compress-dollars": {
    elementId: "compress-dollars-upgrade",
    isHidden: true,
    requirement: () => currencies.money >= 500,
  },
  "smart-investments": {
    elementId: "smart-investments-upgrade",
    isHidden: true,
    requirement: () => currencies.money >= 10_000,
  },
  "bonus-dollars": {
    elementId: "bonus-dollars-upgrade",
    isHidden: true,
    requirement: () => currencies.money >= 500_000,
  },
  "convert-money-to-mm": {
    elementId: "convert-money-to-mm",
    isHidden: true,
    requirement: () => currencies.money >= 50_000_000,
  },
  "mm-elements": {
    elementIds: ["mm-divider", "mm-display", "mm-increases-multiplier-upgrade"],
    isHidden: true,
    requirement: () => currencies.mm >= 1,
  },
  "raise-maxes": {
    elementId: "raise-maxes-upgrade",
    isHidden: true,
    requirement: () => currencies.mm >= 20,
  },
};

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
    count: 0,
    costScale: () =>
      Math.floor(15 ** (1 + upgrades["extra-dollar"].count / 10)),
    max: () => 20 + upgrades["raise-maxes"].count * 4,
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
    count: 0,
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
    count: 0,
    costScale: () =>
      Math.floor(200 ** (1 + upgrades["compress-dollars"].count / 6)),
    eff: () =>
      round(
        1.25 ** upgrades["compress-dollars"].count *
          upgrades["mm-increases-multiplier"].eff()
      ),
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
    count: 0,
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
    count: 0,
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
    count: 0,
    costScale: () =>
      Math.floor(5 ** (1 + upgrades["mm-increases-multiplier"].count / 5)),
    eff: () =>
      1 +
      Math.max(
        Math.log10(currencies.mm) *
          (1 + upgrades["mm-increases-multiplier"].count / 2.5),
        0
      ),
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
    baseCost: 35,
    count: 0,
    costScale: () => Math.floor(10 ** (1 + upgrades["raise-maxes"].count / 4)),
    max: 10,
    update: () => {
      const e = document.getElementById("raise-maxes-upgrade");
      const up = upgrades["raise-maxes"];
      e.children[1].innerText = `$MM ${f(getCost(up))}`;
      e.children[2].innerText = `+${up.count * 4}`;

      if (up.count >= up.max) {
        disableButton(e.children[1], "Maxed!");
      }

      upgrades["extra-dollar"].update();
      upgrades["hire-someone"].update();
    },
  },
};
