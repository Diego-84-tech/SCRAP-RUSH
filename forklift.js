(() => {
  const arcade = document.getElementById('arcade-mode');
  const shift = document.getElementById('forklift-mode');
  const view = document.getElementById('shift-view');
  const objective = document.getElementById('shift-step');
  const arcadeTab = document.getElementById('open-arcade');
  const shiftTab = document.getElementById('open-forklift');
  let runtime;

  function switchMode(showShift) {
    if (showShift && state === 'playing') pause();
    releaseArcadeStick();
    arcade.hidden = showShift;
    shift.hidden = !showShift;
    arcadeTab.setAttribute('aria-pressed', String(!showShift));
    shiftTab.setAttribute('aria-pressed', String(showShift));
    if (showShift && !runtime) {
      try {
        runtime = createShift();
      } catch (error) {
        objective.textContent = 'This browser could not start 3D. Arcade Yard is still available.';
        console.warn(error);
      }
    }
    runtime?.clear();
  }

  arcadeTab.onclick = () => switchMode(false);
  shiftTab.onclick = () => switchMode(true);
  document.getElementById('shift-reset').onclick = () => runtime?.reset();

  function createShift() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111c2a);
    scene.fog = new THREE.FogExp2(0x111c2a, .019);
    const camera = new THREE.PerspectiveCamera(64, 1, .035, 70);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    view.prepend(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xc3d6ff, 0x6b4931, 1.55));
    const dusk = new THREE.DirectionalLight(0xcae1ff, 1.65);
    dusk.position.set(-7, 12, 8);
    scene.add(dusk);

    function box(parent, w, h, d, color, x, y, z, texture) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color, map: texture || null, roughness: .8 })
      );
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    }

    const textures = Object.fromEntries(['asphalt','paint','wood','steel'].map(name => {
      const texture = new THREE.Texture();
      texture.encoding = THREE.sRGBEncoding;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      return [name, texture];
    }));
    textures.asphalt.repeat.set(6, 8);
    const groundMesh = box(scene, 21, .12, 26, 0x5d646c, 0, -.065, -4);
    const surfaces = [[groundMesh, 'asphalt', 0xc1c5c8]];
    function textureSurface(mesh, name, tint) {
      surfaces.push([mesh, name, tint]);
      return mesh;
    }
    materialsReady.then(() => {
      for (const [mesh, name, tint] of surfaces) {
        if (!materialTiles[name]) continue;
        const texture = textures[name];
        texture.image = materialTiles[name];
        texture.needsUpdate = true;
        mesh.material.color.set(tint);
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
      }
    });
    const sheet = (parent,w,h,d,color,x,y,z) =>
      textureSurface(box(parent,w,h,d,color,x,y,z),'paint',0xa4b1bd);
    const metal = (parent,w,h,d,color,x,y,z) =>
      textureSurface(box(parent,w,h,d,color,x,y,z),'steel',color);
    const wood = (parent,w,h,d,color,x,y,z) =>
      textureSurface(box(parent,w,h,d,color,x,y,z),'wood',0xd7bd9a);

    const warehouse = 0x354653;
    box(scene, 18, 6, .35, warehouse, 0, 3, -15);
    box(scene, .35, 5, 23, warehouse, -9, 2.5, -4);
    box(scene, .35, 5, 23, warehouse, 9, 2.5, -4);
    for(let x=-8;x<=8;x+=2) {
      box(scene,.18,5.9,.24,0x46515c,x,2.94,-14.72);
    }
    sheet(scene,4.7,3.6,.16,0x303d42,0,1.83,-14.71);
    for(let y=.19;y<3.65;y+=.22) box(scene,4.68,.016,.045,0x182329,0,y,-14.60);
    for(const x of [-2.48,2.48]){
      box(scene,.22,3.7,.34,0x7d662c,x,1.85,-14.57);
      for(let y=.2;y<=2.0;y+=.38) box(scene,.24,.15,.36,0x242825,x,y,-14.56);
    }
    for(const z of [-1,-7,-13]){
      box(scene,18,.19,.23,0x45515b,0,4.97,z);
      box(scene,3.25,.10,.25,0xb9aa8c,0,4.9,z);
    }

    for (const side of [-1, 1]) {
      for(let row = 0; row < 5; row++) {
        const x = side * 7.4, z = 5 - row * 4;
        box(scene, 2, 2.45, 2.85, row % 2 ? 0x843e24 : 0x295568, x, 1.22, z);
        for(const end of [-1,1]){
          box(scene,2.07,.12,.10,0x555c5d,x,.12,z+end*1.44);
          box(scene,2.07,.11,.10,0x555c5d,x,2.38,z+end*1.44);
        }
        for(let rib = 0; rib < 8; rib++) {
          box(scene, .055, 2.26, .055, 0x293640, x-side*1.02, 1.22, z-1.2+rib*.34);
        }
      }
      for(const z of [4,-5,-13]) {
        box(scene, .16, 4.6, .16, 0x2b3033, side*5.1, 2.3, z);
        const lamp = box(scene, .72, .16, .26, 0xffd18e, side*5.1, 4.58, z);
        lamp.material.emissive.set(0xffb768);
        const pool = new THREE.PointLight(0xffb775, 2.8, 12, 1.3);
        pool.position.set(side*5.1, 4.5, z);
        scene.add(pool);
      }
    }
    for(const [x,z] of [[-3.8,1.2],[3.7,-2.5],[-4.2,-7.4],[4,-10.4]]) {
      box(scene,.14,.52,.14,0xd99538,x,.26,z);
      box(scene,.145,.1,.145,0x292f36,x,.30,z);
      box(scene,.145,.065,.145,0xead5a7,x,.466,z);
    }
    for(const [x,z] of [[-5.8,2],[-5.8,1.3],[6,-3.6],[6,-4.3]]) {
      const drum=new THREE.Mesh(new THREE.CylinderGeometry(.30,.30,.83,14),
        new THREE.MeshStandardMaterial({color:0x784830,roughness:.78}));
      drum.position.set(x,.42,z);
      scene.add(drum);
      for(const y of [.19,.65]){
        const hoop=new THREE.Mesh(new THREE.CylinderGeometry(.316,.316,.036,14),
          new THREE.MeshStandardMaterial({color:0x353b41}));
        hoop.position.set(x,y,z);
        scene.add(hoop);
      }
    }
    sheet(scene,1.55,.67,1.2,0x34434a,-3.9,.35,-2.6);
    for (let i=0;i<6;i++) {
      const scrap=metal(scene,.17,.12,.68,0x827878,-4.45+i*.2,.72,-2.66);
      scrap.rotation.y=(i%3-1)*.24;
    }
    const targetZ = -9;
    const shade = document.createElement('canvas');
    shade.width = shade.height = 128;
    const shadowPaint = shade.getContext('2d');
    const fade = shadowPaint.createRadialGradient(64,64,10,64,64,62);
    fade.addColorStop(0,'rgba(9,13,18,.85)');
    fade.addColorStop(1,'rgba(9,13,18,0)');
    shadowPaint.fillStyle=fade;
    shadowPaint.fillRect(0,0,128,128);
    const cargoShadow = new THREE.Mesh(new THREE.PlaneGeometry(2.8,2.25),
      new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shade),transparent:true,depthWrite:false}));
    cargoShadow.rotation.x=-Math.PI/2;
    scene.add(cargoShadow);
    const targetColor = 0xbaf85d;
    for(const x of [-1.32,1.32]) box(scene,.075,.012,2.05,targetColor,x,.012,targetZ);
    for(const z of [targetZ-1,targetZ+1]) box(scene,2.7,.012,.075,targetColor,0,.012,z);
    for(const x of [-.87,.87]) box(scene,.075,.012,2.3,0xfab84b,x,.013,1);
    for(const x of [-3.2,3.2]) {
      for(let z = 7; z > -14; z -= 1.5) box(scene,.055,.01,.55,0xe0a14c,x,.01,z);
    }

    const sign = document.createElement('canvas');
    sign.width = 512;
    sign.height = 128;
    const lettering = sign.getContext('2d');
    lettering.fillStyle='#253629';lettering.fillRect(0,0,512,128);
    lettering.fillStyle='#c8f476';lettering.font='bold 66px system-ui';lettering.textAlign='center';
    lettering.fillText('BAY 03',256,88);
    const label = new THREE.Mesh(new THREE.PlaneGeometry(4.7,1.17),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sign)}));
    label.position.set(0,3.85,-14.58);
    scene.add(label);

    const pallet = new THREE.Group();
    scene.add(pallet);
    for(const x of [-.62,0,.62]) wood(pallet,.15,.15,1.02,0x835331,x,.075,0);
    for(const z of [-.41,-.21,0,.21,.41]) wood(pallet,1.44,.055,.19,0xc39462,0,.175,z);
    metal(pallet,1.25,.63,.88,0xa69e87,0,.52,0);
    metal(pallet,1.30,.048,.93,0xb0a792,0,.838,0);
    metal(pallet,1.30,.055,.93,0x888477,0,.224,0);
    for (const x of [-.57,.57]) {
      metal(pallet,.065,.60,.025,0x807c70,x,.53,.446);
      for(const y of [.28,.77]) box(pallet,.09,.06,.026,0x5c574b,x,y,.46);
    }
    for (const x of [-.63,0,.63]) {
      box(pallet,.024,.018,.022,0x41362f,x,.198,.438);
    }
    for(const x of [-.39,.39]) box(pallet,.09,.65,.90,0xa4bd4a,x,.52,0);
    box(pallet,.32,.15,.012,0x26332e,0,.55,.448);

    const vehicle = new THREE.Group();
    scene.add(vehicle);
    vehicle.add(camera);
    camera.position.set(0,1.57,.18);
    camera.rotation.x = -.26;
    for(const x of [-.45,.45]) {
      sheet(vehicle,.086,1.93,.12,0x313941,x,1.03,-.75);
      metal(vehicle,.027,1.75,.028,0x69777c,x*.91,1.0,-.672);
      box(vehicle,.046,1.69,.048,0x25272a,x*1.13,1.04,-.73);
    }
    box(vehicle,1,.06,.08,0x3b454a,0,1.99,-.75);
    box(vehicle,1.18,.19,.43,0x222a30,0,.84,-.22);
    box(vehicle,.84,.018,.23,0x384047,0,.943,-.27);
    for(const x of [-.13,-.04,.05,.14]){
      const indicator=box(vehicle,.057,.012,.024,0x9dc350,x,.958,-.30);
      indicator.material.emissive.set(0x566b13);
    }
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.245,.023,8,30),
      new THREE.MeshStandardMaterial({color:0x1b1c1d,roughness:.75}));
    rim.position.set(0,.96,-.24);
    rim.rotation.x=-1.14;
    vehicle.add(rim);
    box(vehicle,.23,.055,.19,0x8ca842,0,.945,-.26);
    const workLight = new THREE.SpotLight(0xffe1b6,2.1,8,.58,.6,1.2);
    workLight.position.set(0,1.22,-.50);
    workLight.target.position.set(0,.22,-3.5);
    vehicle.add(workLight,workLight.target);
    const forks = new THREE.Group();
    vehicle.add(forks);
    box(forks,.89,.13,.08,0x4d5961,0,.08,-.77);
    for(const x of [-.32,.32]) {
      metal(forks,.135,.055,1.22,0xadb9bf,x,0,-1.40);
      metal(forks,.135,.031,.13,0xd0dbdf,x,-.011,-2.04);
      metal(forks,.10,.25,.09,0x8e9a9f,x,.13,-.81);
    }

    const inputs = new Set();
    const keyboard = new Set();
    const pointers = new Map();
    const keyMap = { ArrowUp:'forward',w:'forward',ArrowDown:'reverse',s:'reverse',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',r:'lift',f:'lower' };
    const down = name => keyboard.has(name) || inputs.has(name);
    let yaw, height, seated, carried, complete, lastFrame;
    const offset = new THREE.Vector3();
    const local = new THREE.Vector3();

    function clear() {
      keyboard.clear();
      inputs.clear();
      pointers.clear();
      releaseWheel();
    }

    function reset() {
      clear();
      yaw = 0;
      height = .09;
      seated = carried = complete = false;
      vehicle.position.set(0,0,4);
      vehicle.rotation.y = 0;
      forks.position.y = height;
      pallet.position.set(0,0,0);
      pallet.rotation.y = 0;
      objective.textContent = 'Line up both forks with the pallet slots';
    }

    function relativePallet(position) {
      return local.copy(pallet.position).sub(position).applyAxisAngle(THREE.Object3D.DEFAULT_UP,-yaw);
    }

    function simulate(dt) {
      const throttle = Number(down('forward')) - Number(down('reverse'));
      const steer = updateWheel(dt, Number(down('left')) - Number(down('right')));
      yaw += steer * dt * throttle * 1.24;
      vehicle.rotation.y = yaw;

      if (throttle) {
        offset.set(0,0,-throttle * dt * (carried ? 1.6 : 1.3));
        offset.applyAxisAngle(THREE.Object3D.DEFAULT_UP,yaw).add(vehicle.position);
        offset.x = clamp(offset.x,-5.7,5.7);
        offset.z = clamp(offset.z,-12,7.3);
        const rel = relativePallet(offset);
        const aligned = Math.abs(rel.x)<.12 && Math.cos(yaw-pallet.rotation.y)>.99;
        const forkSlot = aligned && height<.13;
        const reach = forkSlot ? 1.68 : 2.42;
        const blockedByPallet = !carried && Math.abs(rel.x)<1 && rel.z<-0.30 && rel.z>-reach;
        if (!blockedByPallet || throttle<0) vehicle.position.copy(offset);
      }

      const rel = relativePallet(vehicle.position);
      seated = !carried && Math.abs(rel.x)<.12 && rel.z>-1.93 && rel.z<-1.62 &&
        Math.cos(yaw-pallet.rotation.y)>.99 && height<.15 && pallet.position.y===0;
      const lifting = Number(down('lift')) - Number(down('lower'));
      if (seated && lifting>0 && !complete) carried = true;
      height = clamp(height + lifting*dt*.42,.065,.95);
      forks.position.y = height;
      if (carried) {
        offset.set(0, Math.max(0,height-.09), -1.77).applyAxisAngle(THREE.Object3D.DEFAULT_UP,yaw);
        pallet.position.copy(vehicle.position).add(offset);
        pallet.rotation.y = yaw;
        if (lifting<0 && height<=.09) {
          carried = false;
          complete = Math.abs(pallet.position.x)<.48 &&
            Math.abs(pallet.position.z-targetZ)<.46 && Math.cos(yaw)>.96;
        }
      }

      cargoShadow.position.set(pallet.position.x,.009,pallet.position.z);
      let message;
      if (complete) message = rel.z < -2.2 ? 'Delivery complete' : 'Pallet delivered · reverse to clear the forks';
      else if (carried) message = height>.32 ? 'Lower the load for travel' :
        Math.abs(pallet.position.z-targetZ)<.46 && Math.abs(pallet.position.x)<.48 ?
          'Lower the pallet inside Bay 03' : 'Carry low to the green outline in Bay 03';
      else if (seated) message = 'Forks seated · lift the pallet';
      else message = height>.13 ? 'Lower the forks to slot height' : 'Line up both forks with the pallet slots';
      if (objective.textContent!==message) objective.textContent=message;
    }

    window.addEventListener('keydown', event => {
      const action = keyMap[event.key];
      if (shift.hidden || !action) return;
      event.preventDefault();
      keyboard.add(action);
    });
    window.addEventListener('keyup', event => keyboard.delete(keyMap[event.key]));
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    view.querySelectorAll('[data-drive]').forEach(button => {
      button.addEventListener('pointerdown', event => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId,button.dataset.drive);
        inputs.add(button.dataset.drive);
      });
      for(const name of ['pointerup','pointercancel','lostpointercapture']){
        button.addEventListener(name,event=>{
          pointers.delete(event.pointerId);
          if (![...pointers.values()].includes(button.dataset.drive)) inputs.delete(button.dataset.drive);
        });
      }
    });

    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(.035,(now-(lastFrame||now))/1000);
      lastFrame = now;
      if (shift.hidden || document.hidden) return;
      const width = view.clientWidth, height = view.clientHeight;
      if (width && height && camera.aspect!==width/height) {
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        renderer.setSize(width,height,false);
      }
      simulate(dt);
      renderer.render(scene,camera);
    }

    reset();
    requestAnimationFrame(frame);
    return { reset, clear };
  }
})();
