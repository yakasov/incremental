let clearSaveCounter = 0;

function save() {
  const requirementsToSave = {};
  for (const requirement of Object.keys(elementRequirements)) {
    requirementsToSave[requirement] = elementRequirements[requirement].isHidden;
  }

  const upgradesToSave = {};
  for (const upgrade of Object.keys(upgrades)) {
    upgradesToSave[upgrade] = upgrades[upgrade].count;
  }

  const saveObject = {
    currencies: currencies,
    requirements: requirementsToSave,
    upgrades: upgradesToSave,
  };

  const encodedSave = btoa(JSON.stringify(saveObject));

  localStorage.setItem("incrementalSave", encodedSave);

  return encodedSave;
}

function load(importedSave = null) {
  let saveObject;

  if (!importedSave) {
    const encodedSave = localStorage.getItem("incrementalSave");
    if (!encodedSave || encodedSave.length === 0) return;

    saveObject = JSON.parse(atob(encodedSave));
  } else {
    saveObject = importedSave;
  }
  currencies.money = saveObject.currencies.money ?? 0;
  currencies.mm = saveObject.currencies.mm ?? 0;

  for (const requirement of Object.keys(saveObject.requirements)) {
    elementRequirements[requirement].isHidden =
      saveObject.requirements[requirement];
  }

  for (const upgrade of Object.keys(saveObject.upgrades)) {
    upgrades[upgrade].count = saveObject.upgrades[upgrade];
    upgrades[upgrade].update();
  }
}

function loadFromSavebank(saveName) {
  return load(JSON.parse(atob(savebank[saveName])));
}

function clearSave() {
  if (clearSaveCounter < 2) {
    clearSaveCounter++;
  } else {
    localStorage.clear();
    location.reload();
  }
}

function getSaveBox() {
  return document.getElementById("save-text-box");
}

function importSave() {
  const input = getSaveBox().value;
  if (!input || input.length === 0) return;

  try {
    const decodedSave = atob(input);

    if (decodedSave[0] !== "{") {
      throw new Error(`Could not parse ${input} to JSON!`);
    }

    const save = JSON.parse(decodedSave);
    load(save);
  } catch (e) {
    console.error(e);
  }
}

function exportSave() {
  const encodedSave = save();
  getSaveBox().value = encodedSave;
}
