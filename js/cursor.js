/**
 * Smooth Custom Trailing Target Cursor
 * Inspired by ReactBits Target Cursor / Splash Follower
 * Bizumuremyi Augustin Portfolio
 */

(function () {
  // Check if touch device or coarse pointer
  const isTouchDevice = () => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  };

  if (isTouchDevice()) {
    console.log("Touch device detected: Disabling custom target cursor.");
    return;
  }

  // Create cursor DOM elements
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';

  const cursorTarget = document.createElement('div');
  cursorTarget.className = 'custom-cursor-target';
  cursorTarget.innerHTML = `
    <div class="target-corner tl"></div>
    <div class="target-corner tr"></div>
    <div class="target-corner bl"></div>
    <div class="target-corner br"></div>
    <div class="target-reticle"></div>
  `;

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorTarget);

  let mouseX = -100;
  let mouseY = -100;
  let targetX = -100;
  let targetY = -100;
  let dotX = -100;
  let dotY = -100;
  let isHovering = false;
  let isClicking = false;
  let isVisible = false;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursorDot.style.opacity = '1';
      cursorTarget.style.opacity = '1';
    }
  });

  window.addEventListener('mouseleave', () => {
    isVisible = false;
    cursorDot.style.opacity = '0';
    cursorTarget.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    isVisible = true;
    cursorDot.style.opacity = '1';
    cursorTarget.style.opacity = '1';
  });

  window.addEventListener('mousedown', () => {
    isClicking = true;
    cursorTarget.classList.add('clicking');
  });

  window.addEventListener('mouseup', () => {
    isClicking = false;
    cursorTarget.classList.remove('clicking');
  });

  // Attach hover triggers dynamically with delegation
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('a, button, input, select, textarea, .media-card, .btn, .tag-chip, .filter-btn, .clickable, .theme-toggle-btn');
    if (target) {
      isHovering = true;
      cursorTarget.classList.add('hovering');
      cursorDot.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('a, button, input, select, textarea, .media-card, .btn, .tag-chip, .filter-btn, .clickable, .theme-toggle-btn');
    if (target) {
      isHovering = false;
      cursorTarget.classList.remove('hovering');
      cursorDot.classList.remove('hovering');
    }
  });

  // Smooth animation loop using lerp (linear interpolation)
  const lerp = (start, end, factor) => start + (end - start) * factor;

  function render() {
    // Dot moves snappy with slight smoothing
    dotX = lerp(dotX, mouseX, 0.4);
    dotY = lerp(dotY, mouseY, 0.4);
    cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

    // Target reticle trails smoothly behind
    const trailFactor = isHovering ? 0.25 : 0.18;
    targetX = lerp(targetX, mouseX, trailFactor);
    targetY = lerp(targetY, mouseY, trailFactor);
    cursorTarget.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
