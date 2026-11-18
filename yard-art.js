/* Static texture and lighting are baked once. Gameplay objects use world coordinates. */
const yard = document.createElement('canvas');
yard.width = W;
yard.height = H;
const ground = yard.getContext('2d');
function bakeYard() {
  ground.fillStyle='#343841';
  ground.fillRect(0,0,W,H);
  if(materialTiles.asphalt) {
    ground.globalAlpha=.78;
    ground.fillStyle=ground.createPattern(materialTiles.asphalt,'repeat');
    ground.fillRect(0,0,W,H);
    ground.globalAlpha=1;
  }
  ground.strokeStyle='#65717b';
  ground.lineWidth=4;
  ground.strokeRect(13,13,W-26,H-26);
  ground.setLineDash([24,14]);
  ground.strokeStyle='#d7aa5771';
  ground.strokeRect(197,39,873,571);
  ground.setLineDash([]);
  for(let x=214;x<W-20;x+=30) {
    ground.fillStyle='#18202a';
    ground.fillRect(x,0,24,14);
    ground.fillStyle='#55545c';
    ground.fillRect(x,1,22,4);
    ground.fillRect(x,629,22,5);
  }
  for (const [x,y] of [[80,30],[545,18],[1030,26],[45,628],[620,630],[1055,603]]) {
    const light=ground.createRadialGradient(x,y,3,x,y,155);
    light.addColorStop(0,'#fff1b3a8');
    light.addColorStop(.27,'#f9a64f61');
    light.addColorStop(1,'#ffbb6600');
    ground.fillStyle=light;
    ground.fillRect(x-155,y-155,310,310);
    ground.fillStyle='#fff3c3';
    ground.fillRect(x-9,y-5,18,10);
  }
}
bakeYard();
materialsReady.then(bakeYard);

function polygon(points, color) {
  ctx.fillStyle=color;
  ctx.beginPath();
  points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  ctx.closePath();
  ctx.fill();
}
function container(o,i) {
  const {x,y,w,h}=o;
  const [roof,wall,lip]=[
    ['#435867','#253844','#91a9b1'],['#795044','#492c24','#bd8462'],
    ['#5b6468','#323b3f','#a6b5b6'],['#3d596e','#263341','#88a2b6'],
    ['#725441','#483128','#bb906c']
  ][i];
  rect(x+8,y+12,w+12,h+12,'#05080ea8');
  rect(x-5,y+h-2,w+10,12,'#b99446');
  for(let n=0;n<w;n+=14) polygon([[x+n,y+h],[x+n+6,y+h],[x+n+1,y+h+10],[x+n-5,y+h+10]],'#342b23');
  rect(x,y,w,h,wall);
  polygon([[x,y],[x+7,y-11],[x+w+7,y-11],[x+w,y]],lip);
  polygon([[x+w,y],[x+w+7,y-11],[x+w+7,y+h-11],[x+w,y+h]],'#1d2a33');
  rect(x+4,y+3,w-8,h-21,roof);
  for(let n=7;n<w-4;n+=10){
    rect(x+n,y+5,4,h-28,lip);
    rect(x+n+4,y+5,3,h-28,'#1019217e');
  }
  rect(x+1,y+h-17,w-2,3,lip);
  for(const edge of [x+4,x+w-8]) rect(edge,y+2,4,h-4,'#c6b49f73');
  ctx.fillStyle='#ded4bb';ctx.textAlign='left';ctx.font='bold 13px monospace';
  ctx.fillText('DS / 0'+(i+1),x+10,y+22);
}
const vehicleArt = new Image();
vehicleArt.src = 'assets/vehicles.png';

function drawVehicle(vehicle, angle, forklift) {
  ctx.save();
  ctx.translate(vehicle.x, vehicle.y);
  ctx.rotate(angle);
  const beam = ctx.createLinearGradient(20,0,110,0);
  beam.addColorStop(0, forklift ? '#ffc4778a' : '#f5f9b0ae');
  beam.addColorStop(1, '#fffad800');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(19,-12); ctx.lineTo(110,-34); ctx.lineTo(110,34); ctx.lineTo(19,12); ctx.fill();
  ctx.fillStyle = '#070b10a6';
  ctx.beginPath();
  ctx.ellipse(1, 4, 28, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  if(vehicleArt.complete && vehicleArt.naturalWidth){
    const w=vehicleArt.naturalWidth, h=vehicleArt.naturalHeight;
    const left=forklift?.55:.028;
    const width=forklift?.43:.41;
    ctx.drawImage(vehicleArt,w*left,h*.284,w*width,h*.481,
      forklift?-25:-32,-24,forklift?72:64,48);
  } else {
    rect(-23,-16,46,32,forklift?'#dc974a':'#cced60');
    if(forklift){
      rect(21,-12,23,4,'#cad2d9');
      rect(21,8,23,4,'#cad2d9');
    } else {
      rect(-20,-12,20,24,'#28312c');
      rect(7,-12,7,24,'#314c61');
    }
  }
  if(!forklift) {
    for(let i=0;i<load.length;i++) {
      const color=load[i]===100?'#ffca58':load[i]===45?'#e5a078':'#a5c3cc';
      rect(-25+(i%3)*6,-10+Math.floor(i/3)*4,5,3,color);
    }
  }
  ctx.restore();
}
function draw() {
  ctx.drawImage(yard, 0, 0);
  rect(depot.x-4,depot.y-4,depot.w+8,depot.h+8,'#bef258');
  rect(depot.x+11,depot.y+12,depot.w,depot.h,'#0a1314a3');
  rect(depot.x,depot.y,depot.w,depot.h,'#1e392d');
  const bayLight=ctx.createLinearGradient(0,depot.y,0,depot.y+depot.h);
  bayLight.addColorStop(0,'#affc5cbb');
  bayLight.addColorStop(1,'#affc5c00');
  ctx.fillStyle=bayLight;
  ctx.fillRect(depot.x+10,depot.y+37,depot.w-20,depot.h-37);
  rect(depot.x+2,depot.y+8,12,143,'#374d49');
  rect(depot.x+depot.w-14,depot.y+8,12,143,'#374d49');
  rect(depot.x+9,depot.y+12,depot.w-18,36,'#111d19');
  ctx.textAlign='center';
  ctx.font='bold 24px system-ui';
  ctx.fillStyle='#c9f57a';
  ctx.shadowColor='#aefa66';ctx.shadowBlur=13;
  ctx.fillText('CASH IN',112,300);
  ctx.shadowBlur=0;
  for(let y=322;y<400;y+=22) rect(48,y,128,2,'#a5d4652b');
  obstacles.forEach(container);
  for (const part of parts) {
    const color = part.value===100 ? '#ffdb66' : part.value===45 ? '#ffa36e' : '#d5e3e8';
    ctx.save();ctx.translate(part.x,part.y);ctx.rotate(part.x);
    ctx.shadowColor=color;ctx.shadowBlur=10;
    if(part.value===45){
      ctx.strokeStyle=color;ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.stroke();
    } else if(part.value===100) {
      rect(-7,-3,14,7,color);rect(-4,-7,8,4,'#fff0a6');
    } else {
      rect(-7,-5,14,10,color);rect(-2,-5,3,10,'#526473');
    }
    ctx.restore();
  }
  for(const e of enemies) drawVehicle(e,e.axis==='x'?(e.v>0?0:Math.PI):(e.v>0?Math.PI/2:-Math.PI/2),true);
  ctx.globalAlpha=invulnerable>0&&Math.sin(elapsed*30)>0?.45:1;
  drawVehicle(truck,truck.angle,false);
  ctx.globalAlpha=1;
  rect(truck.x-19,truck.y+28,38,4,'#0a1117');
  rect(truck.x-19,truck.y+28,38*boost/100,4,'#ddf886');
  for(const p of particles){ctx.globalAlpha=p.life/.6;rect(p.x,p.y,4,4,p.color)}
  ctx.globalAlpha=1;
}

requestAnimationFrame(frame);
