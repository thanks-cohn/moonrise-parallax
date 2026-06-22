const root = document.documentElement;
let latestProgress = 0;
let ticking = false;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0, edge1, value) => {
  const x = clamp((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};
const lerp = (start, end, amount) => start + (end - start) * amount;

function readScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable > 0 ? clamp(window.scrollY / scrollable) : 0;
}

function render() {
  ticking = false;
  latestProgress = readScrollProgress();

  // Continuous, restrained parallax moonrise: hidden low at first, fully risen by the finale.
  const moonEase = smoothstep(0, 1, latestProgress);
  const moonY = lerp(82, 27, moonEase); // vh units

  // Layer dusk and night gradients for a three-phase cinematic sky transition.
  const duskOpacity = Math.sin(Math.PI * clamp(latestProgress * 1.08));
  const nightOpacity = smoothstep(0.38, 1, latestProgress);

  // Tribute reveal begins around 80% and drifts upward 28px as it fades in.
  const textProgress = smoothstep(0.8, 1, latestProgress);

  root.style.setProperty('--progress', latestProgress.toFixed(4));
  root.style.setProperty('--moon-y', `${moonY.toFixed(2)}vh`);
  root.style.setProperty('--dusk-opacity', duskOpacity.toFixed(4));
  root.style.setProperty('--night-opacity', nightOpacity.toFixed(4));
  root.style.setProperty('--text-opacity', textProgress.toFixed(4));
  root.style.setProperty('--text-y', `${lerp(28, 0, textProgress).toFixed(2)}px`);
}

function requestRender() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(render);
  }
}

window.addEventListener('scroll', requestRender, { passive: true });
window.addEventListener('resize', requestRender);
window.addEventListener('load', requestRender);
requestRender();
