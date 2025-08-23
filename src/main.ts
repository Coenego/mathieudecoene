const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('bg') as HTMLCanvasElement | null;

if (!canvas) throw new Error('Canvas #bg not found');

interface WindowWithOffscreen extends Window {
  OffscreenCanvas?: typeof OffscreenCanvas;
  Worker?: typeof Worker;
}

const supportsOffscreen =
  (window as WindowWithOffscreen).OffscreenCanvas !== undefined &&
  (window as WindowWithOffscreen).Worker !== undefined;

if (!prefersReduced && supportsOffscreen) {
  // Vite-friendly worker import (bundled & hashed in build)
  const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

  // remove CSS fallback visuals once worker is live
  document.body.classList.remove('fallback');

  // Transfer control to worker
  // Note: transferControlToOffscreen must be called before postMessage with canvas
  const off = canvas.transferControlToOffscreen();
  worker.postMessage({
    type: 'init',
    canvas: off,
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1
  }, [off]);

  // Resize (throttled via rAF)
  let raf = 0, lastW = innerWidth, lastH = innerHeight;
  const onResize = () => {
    if (innerWidth === lastW && innerHeight === lastH) return;
    lastW = innerWidth; lastH = innerHeight;
    worker.postMessage({
      type: 'resize',
      width: innerWidth,
      height: innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1
    });
  };
  const handleResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(onResize); };
  addEventListener('resize', handleResize, { passive: true });

  // Respect reduced motion flips at runtime (simple approach: stop & restore fallback)
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const motionListener = () => {
    if (mq.matches) {
      worker.postMessage({ type: 'stop' });
      document.body.classList.add('fallback');
    } else {
      location.reload(); // re-init worker cleanly
    }
  };
  mq.addEventListener?.('change', motionListener);

  addEventListener('pagehide', () => worker.terminate(), { once: true });
} else {
  // Keep CSS fallback
  document.body.classList.add('fallback');
}
