'use strict';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
const W=1100,H=650,keys=new Set(),depot={x:35,y:260,w:155,h:160};
let state='ready',mode='rush',bank=0,earned=0,load=[],capacity=8,health=100,time=90,truck,parts=[],enemies=[],particles=[],elapsed=0,invulnerable=0,boost=100,bankedParts=0,job=1,last=0,toastTimer=0,sound=false,audio;
const records={rush:0,work:0,copper:0};
let legacyBest=0;
try {
  legacyBest=Number(localStorage.getItem('scrap-rush-best'))||0;
  for(const name of Object.keys(records)) records[name]=Number(localStorage.getItem('scrap-rush-best-'+name))||0;
}catch{}
function showRecord(){
  $('best').textContent=`BEST $${records[mode]}${legacyBest ? ' · LEGACY $'+legacyBest : ''}`;
}
showRecord();
const rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const originalObstacles=[{x:260,y:100,w:170,h:75},{x:650,y:80,w:85,h:145},{x:370,y:360,w:140,h:90},{x:730,y:440,w:180,h:65},{x:925,y:190,w:90,h:140}];
const copperObstacles=[{x:295,y:70,w:130,h:190},{x:555,y:300,w:185,h:85},{x:815,y:85,w:95,h:145},{x:900,y:455,w:130,h:105},{x:260,y:465,w:145,h:80}];
let obstacles=originalObstacles;
let bankedCopper=0;
function blocked(x,y,r=22){return obstacles.some(o=>x>o.x-r&&x<o.x+o.w+r&&y>o.y-r&&y<o.y+o.h+r)}
function spawn(){let p;do{p={x:rand(230,W-35),y:rand(40,H-35),type:Math.random()}}while(blocked(p.x,p.y,30));p.value=p.type>.9?100:p.type>.6?45:20;return p}
function reset(){keys.clear();releaseArcadeStick();$('toast').style.opacity=0;toastTimer=0;bank=0;earned=0;load=[];capacity=8;health=100;bankedCopper=0;obstacles=mode==='copper'?copperObstacles:originalObstacles;time=mode==='rush'?90:mode==='copper'?120:240;elapsed=0;invulnerable=0;boost=100;bankedParts=0;job=1;truck={x:115,y:340,angle:0};parts=Array.from({length:32},spawn);enemies=[{x:520,y:260,v:120,axis:'x'},{x:600,y:530,v:-100,axis:'y'},{x:850,y:360,v:-140,axis:'x'}];if(mode==='copper'){
  for(const [i,[x,y]] of [[525,125],[630,215],[820,314],[950,365],[520,510]].entries()) parts[i]={x,y,value:45};
}
particles=[];updateHUD()}
function beep(freq=440){if(!sound)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;g.gain.setValueAtTime(.04,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.13);o.start();o.stop(audio.currentTime+.13)}catch{}}
function toast(s){$('toast').textContent=s;$('toast').style.opacity=1;toastTimer=2}
function updateHUD(){$('time').innerHTML=Math.max(0,Math.ceil(time))+'<span>s</span>';$('bank').textContent='$'+bank;$('load').textContent=load.length+' / '+capacity;$('health').textContent=Math.ceil(health)+'%';$('health').style.color=health<35?'#ff8466':'';$('jobTitle').textContent=job===1?'A little metal. A lot of potential.':`Job ${job}: keep the yard moving.`;$('jobText').textContent=`Bank ${job*12} parts to complete this job. Bonus: $${job*300}. (${' '+bankedParts+' / '+job*12})`;$('jobProgress').style.width=Math.min(100,bankedParts/(job*12)*100)+'%';
if(mode==='copper'){
  $('jobTitle').textContent='Copper Crossing';
  $('jobText').textContent='Bank copper coils · '+bankedCopper+' / 5';
  $('jobProgress').style.width=Math.min(100,bankedCopper*20)+'%';
}$('upgrade').innerHTML=`BIGGER BED <span>$${250+(capacity-8)*50} · +4 CAPACITY</span>`}
function start(){reset();state='playing';$('arcade-mode').dataset.state=state;$('overlay').style.display='none';$('pause').style.display='block';beep(300)}
function finish(){state='over';$('arcade-mode').dataset.state=state;keys.clear();releaseArcadeStick();if(earned>records[mode]){
    records[mode]=earned;
    try{localStorage.setItem('scrap-rush-best-'+mode,String(earned))}catch{}
  }
  showRecord();
  $('overlayTitle').innerHTML=health<=0?'TRUCK<br><em>WRECKED.</em>':mode==='copper'&&bankedCopper<5?'TARGET<br><em>MISSED.</em>':'SHIFT<br><em>COMPLETE.</em>';$('overlayText').textContent=`You earned $${earned}, spent $${earned-bank}, and banked ${bankedParts} parts.${mode==='copper'?' Copper: '+bankedCopper+' / 5.':''}`;$('start').innerHTML='ANOTHER ROUND <span>↗</span>';$('overlay').style.display='flex';$('pause').style.display='none';beep(180)}
function pause(){if(state==='playing'){state='paused';$('arcade-mode').dataset.state=state;keys.clear();releaseArcadeStick();$('overlayTitle').innerHTML='TAKE A<br><em>BREATHER.</em>';$('overlayText').textContent='Your haul is safe. Jump back in when you’re ready.';$('start').textContent='RESUME SHIFT ↗';$('overlay').style.display='flex'}else if(state==='paused'){state='playing';$('arcade-mode').dataset.state=state;$('overlay').style.display='none'}}
$('start').onclick=()=>state==='paused'?pause():start();
$('pause').onclick=pause;
function openArcade(order) {
  mode=order;
  $('arcade-title').textContent=order==='rush'?'Rush Run':order==='copper'?'Copper Crossing':'Work Shift';
  showRecord();
  start();
}
function stopArcade() {
  state='ready';
  keys.clear();
  releaseArcadeStick();
}
$('sound').onclick=()=>{
  sound=!sound;
  $('sound').textContent=sound?'Sound on':'Sound off';
  $('sound').setAttribute('aria-pressed',String(sound));
  beep();
};
$('upgrade').onclick=()=>{if(state!=='playing')return;let cost=250+(capacity-8)*50;if(bank<cost)return toast(`Need $${cost} banked for a bigger bed`);bank-=cost;capacity+=4;toast('BED UPGRADED · +4 CAPACITY');beep(700);updateHUD()};
$('repair').onclick=()=>{if(state!=='playing')return;if(health>=100)return toast('Truck is already in top shape');if(bank<100)return toast('Need $100 banked for repairs');bank-=100;health=100;toast('GOOD AS NEW');updateHUD()};
window.addEventListener('keydown',e=>{if($('arcade-mode').hidden||(e.key===' '&&e.target.closest('button')))return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d'].includes(e.key)){e.preventDefault();keys.add(e.key)}if(e.key==='Escape'||e.key.toLowerCase()==='p')pause()});window.addEventListener('keyup',e=>keys.delete(e.key));document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')pause()});window.addEventListener('blur',()=>{keys.clear();if(state==='playing')pause()});
document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>keys.delete(b.dataset.key))});
function burst(x,y,color){for(let i=0;i<10;i++)particles.push({x,y,vx:rand(-100,100),vy:rand(-100,100),life:.6,color})}
function update(dt){elapsed+=dt;time-=dt;invulnerable=Math.max(0,invulnerable-dt);let dx=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0),dy=(keys.has('ArrowDown')||keys.has('s')?1:0)-(keys.has('ArrowUp')||keys.has('w')?1:0);if(!dx&&!dy){dx=arcadeStick.x;dy=arcadeStick.y}let moving=dx||dy,boosting=keys.has(' ')&&boost>0&&moving;boost=clamp(boost+(boosting?-45:22)*dt,0,100);if(moving){let len=Math.hypot(dx,dy);dx/=Math.max(1,len);dy/=Math.max(1,len);let speed=(boosting?360:215)*(1-load.length/(capacity*7));let nx=clamp(truck.x+dx*speed*dt,22,W-22),ny=clamp(truck.y+dy*speed*dt,22,H-22);if(!blocked(nx,truck.y))truck.x=nx;if(!blocked(truck.x,ny))truck.y=ny;truck.angle=Math.atan2(dy,dx)}
for(let i=parts.length-1;i>=0;i--){let p=parts[i];if(Math.hypot(truck.x-p.x,truck.y-p.y)<32&&load.length<capacity){load.push(p.value);burst(p.x,p.y,'#d7f75b');parts[i]=spawn();beep(480+p.value*3);if(load.length===capacity)toast('LOAD FULL · HEAD TO THE DEPOT')}}
if(truck.x>depot.x&&truck.x<depot.x+depot.w&&truck.y>depot.y&&truck.y<depot.y+depot.h&&load.length){let cash=load.reduce((a,b)=>a+b,0);bankedCopper+=load.filter(value=>value===45).length;bankedParts+=load.length;bank+=cash;earned+=cash;load=[];beep(850);
let bonus=0;
while(bankedParts>=job*12){bonus+=job*300;job++}
bank+=bonus;earned+=bonus;
toast(`HAUL SOLD +$${cash}${bonus ? ' · JOB BONUS +$'+bonus : ''}`)}
for(const e of enemies){e[e.axis]+=e.v*dt;const min=e.axis==='x'?230:250,max=e.axis==='x'?1000:590;if(e[e.axis]<min||e[e.axis]>max)e.v*=-1;if(Math.hypot(e.x-truck.x,e.y-truck.y)<39&&invulnerable<=0){health-=25;invulnerable=1.5;load.splice(-Math.min(2,load.length));burst(truck.x,truck.y,'#fa8455');toast('FORKLIFT HIT · -25 HEALTH');beep(100)}}
particles=particles.filter(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;return p.life>0});updateHUD();if(time<=0||health<=0||(mode==='copper'&&bankedCopper>=5))finish()}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function frame(now){const dt=Math.min((now-last)/1000,.04);last=now;if(state==='playing')update(dt);if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)$('toast').style.opacity=0}if(!$("arcade-mode").hidden)draw();requestAnimationFrame(frame)}reset();
