function dragControl(element, move, reset) {
  let pointer;
  function release() {
    const previous = pointer;
    pointer = undefined;
    if (previous !== undefined && element.hasPointerCapture(previous)) {
      element.releasePointerCapture(previous);
    }
    reset();
  }
  element.addEventListener('pointerdown', event => {
    if (pointer !== undefined || event.button !== 0) return;
    event.preventDefault();
    pointer = event.pointerId;
    element.setPointerCapture(pointer);
    move(event, element.getBoundingClientRect(), true);
  });
  element.addEventListener('pointermove', event => {
    if (event.pointerId === pointer) move(event, element.getBoundingClientRect(), false);
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    element.addEventListener(name, event => {
      if (event.pointerId === pointer) release();
    });
  }
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', release);
  return release;
}

const arcadeStick = { x: 0, y: 0 };
const stick = document.getElementById('arcade-stick');
const stickGrip = stick.firstElementChild;
const releaseArcadeStick = dragControl(stick, (event, bounds) => {
  const radius = bounds.width * .33;
  const x = (event.clientX - bounds.left - bounds.width / 2) / radius;
  const y = (event.clientY - bounds.top - bounds.height / 2) / radius;
  const length = Math.hypot(x, y);
  const scale = Math.max(1, length);
  arcadeStick.x = x / scale;
  arcadeStick.y = y / scale;
  stickGrip.style.transform = `translate(${arcadeStick.x * radius}px,${arcadeStick.y * radius}px)`;
}, () => {
  arcadeStick.x = arcadeStick.y = 0;
  stickGrip.style.transform = '';
});

const wheel = document.getElementById('shift-wheel');
let wheelAngle = 0;
let lastWheelAngle;
let wheelTarget = 0;
const maxWheelAngle = 1.48;

function wheelValue(value) {
  wheelTarget = Math.max(-maxWheelAngle, Math.min(maxWheelAngle, value));
}
const releaseWheel = dragControl(wheel, (event, bounds, start) => {
  const x = event.clientX - bounds.left - bounds.width / 2;
  const y = event.clientY - bounds.top - bounds.height / 2;
  if (Math.hypot(x, y) < bounds.width * .1) {
    lastWheelAngle = undefined;
    return;
  }
  const angle = Math.atan2(y, x);
  if (!start && lastWheelAngle !== undefined) {
    const change = angle - lastWheelAngle;
    wheelValue(wheelTarget + Math.atan2(Math.sin(change), Math.cos(change)) * 1.35);
  }
  lastWheelAngle = angle;
}, () => {
  lastWheelAngle = undefined;
  wheelValue(0);
});
wheel.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.key === 'Home') wheelValue(-maxWheelAngle);
  if (event.key === 'End') wheelValue(maxWheelAngle);
  if (event.key === 'ArrowLeft') wheelValue(wheelTarget - .15);
  if (event.key === 'ArrowRight') wheelValue(wheelTarget + .15);
});
wheel.addEventListener('keyup', () => wheelValue(0));
wheel.addEventListener('blur', releaseWheel);
function updateWheel(dt, keyboardSteer) {
  const target = keyboardSteer ? -keyboardSteer * maxWheelAngle : wheelTarget;
  wheelAngle += (target - wheelAngle) * Math.min(1, dt * 13);
  const steer = wheelAngle / maxWheelAngle;
  wheel.style.setProperty('--wheel-angle', `${wheelAngle}rad`);
  wheel.setAttribute('aria-valuenow', String(Math.round(steer * 100)));
  return Math.abs(steer) < .01 ? 0 : -steer;
}
