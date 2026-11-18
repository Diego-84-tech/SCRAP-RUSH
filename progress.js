const upgradeCost = {lights:1, hydraulics:2, guide:3};
let progress = {credits:0, trained:false, upgrades:{}};
try {
  const prior = JSON.parse(localStorage.getItem('scrap-rush-progress-v1'));
  if (prior && Number.isSafeInteger(prior.credits) && prior.credits >= 0 && prior.upgrades) progress = prior;
} catch {}

function refreshWorkshop() {
  document.getElementById('credits').textContent = progress.credits + ' shift credits';
  document.getElementById('training-stamp').textContent = progress.trained ? 'QUALIFIED' : 'TRAINING AVAILABLE';
  for (const button of document.querySelectorAll('[data-buy]')){
    const id = button.dataset.buy;
    button.disabled = Boolean(progress.upgrades[id]) || progress.credits < upgradeCost[id];
    button.dataset.owned = String(Boolean(progress.upgrades[id]));
  }
}
function saveProgress() {
  try { localStorage.setItem('scrap-rush-progress-v1',JSON.stringify(progress)); } catch {}
  refreshWorkshop();
}
document.getElementById('open-workshop').onclick=()=>{
  refreshWorkshop();
  document.getElementById('workshop').showModal();
};
for(const button of document.querySelectorAll('[data-buy]')) {
  button.onclick=()=>{
    const id=button.dataset.buy;
    if(progress.upgrades[id] || progress.credits<upgradeCost[id]) return;
    progress.credits-=upgradeCost[id];
    progress.upgrades[id]=true;
    saveProgress();
  };
}
refreshWorkshop();
