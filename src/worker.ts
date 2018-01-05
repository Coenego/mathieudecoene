let ctx: OffscreenCanvasRenderingContext2D | null = null;
let w = 0, h = 0, dpr = 1, running = false;

const BASE = '#0b0e14';
const palette = [
  'rgba(28,36,48,0.70)', // dark blue-grey
  'rgba(45,54,66,0.65)', // slate
  'rgba(59,70,83,0.60)'  // warm grey-blue
];

type Msg =
  | { type: 'init'; canvas: OffscreenCanvas; width: number; height: number; devicePixelRatio: number }
  | { type: 'resize'; width: number; height: number; devicePixelRatio: number }
  | { type: 'stop' };

function draw(t: number) {
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = BASE;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'lighter';

  const time = t / 1000;
  const blobs = [
    { c: palette[0], r: 240 * dpr, speed: 0.05, ampX: 0.35, ampY: 0.30, phase: 0.0 },
    { c: palette[1], r: 200 * dpr, speed: 0.08, ampX: 0.30, ampY: 0.25, phase: 2.2 },
    { c: palette[2], r: 220 * dpr, speed: 0.06, ampX: 0.25, ampY: 0.35, phase: 4.1 },
  ];

  for (const b of blobs) {
    const cx = w * 0.5 + Math.cos(time * b.speed + b.phase) * w * b.ampX * 0.5;
    const cy = h * 0.5 + Math.sin(time * b.speed * 1.1 + b.phase) * h * b.ampY * 0.5;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
    grd.addColorStop(0, b.c);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function loop() {
  if (!running) return;
  draw(performance.now());
  setTimeout(loop, 16); // ~60fps; rAF is not available in workers (2D canvas)
}

self.onmessage = (e: MessageEvent<Msg>) => {
  const msg = e.data;
  if (msg.type === 'init') {
    const { canvas, width, height, devicePixelRatio } = msg;
    dpr = Math.max(1, devicePixelRatio || 1);
    w = Math.floor(width * dpr);
    h = Math.floor(height * dpr);
    ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (ctx) {
      (canvas as OffscreenCanvas).width = w;
      (canvas as OffscreenCanvas).height = h;
    }
    running = true;
    loop();
  } else if (msg.type === 'resize') {
    const { width, height, devicePixelRatio } = msg;
    dpr = Math.max(1, devicePixelRatio || 1);
    w = Math.floor(width * dpr);
    h = Math.floor(height * dpr);
    if (ctx && (ctx.canvas as OffscreenCanvas)) {
      (ctx.canvas as OffscreenCanvas).width = w;
      (ctx.canvas as OffscreenCanvas).height = h;
    }
  } else if (msg.type === 'stop') {
    running = false;
  }
};
