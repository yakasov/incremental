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

  localStorage.setItem("incrementalSave", btoa(JSON.stringify(saveObject)));
}

function load() {
  const encodedSave = localStorage.getItem("incrementalSave");
  if (!encodedSave || encodedSave.length === 0) return;

  const save = JSON.parse(atob(encodedSave));
  currencies.money = save.currencies?.money ?? 0;
  currencies.mm = save.currencies?.mm ?? 0;

  for (const requirement of Object.keys(save.requirements)) {
    elementRequirements[requirement].isHidden = save.requirements[requirement];
  }

  for (const upgrade of Object.keys(save.upgrades)) {
    upgrades[upgrade].count = save.upgrades[upgrade];
    upgrades[upgrade].update();
  }
}

function clearSave() {
  localStorage.clear();
  location.reload();
}
