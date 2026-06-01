import { type RefObject, useEffect } from "react";

type CanvasRef = RefObject<HTMLCanvasElement | null>;

type SeedPoint = {
  x: number;
  y: number;
};

type Point = {
  bx: number;
  by: number;
  phase: number;
  amp: number;
};

const seedPoints: SeedPoint[] = [
  { x: 0.58, y: 0.2 },
  { x: 0.78, y: 0.32 },
  { x: 0.9, y: 0.18 },
  { x: 0.7, y: 0.55 },
  { x: 0.88, y: 0.66 },
  { x: 0.62, y: 0.8 },
  { x: 0.82, y: 0.88 },
];

export function useScatter(canvasRef: CanvasRef) {
  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!canvasElement) {
      return undefined;
    }

    const context = canvasElement.getContext("2d");

    if (!context) {
      return undefined;
    }

    const canvas = canvasElement;
    const ctx = context;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;
    let points: Point[] = [];
    let animationFrame = 0;
    let stopped = false;
    let start = performance.now();

    function resize() {
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      points = seedPoints.map((seed, index) => ({
        bx: seed.x * width,
        by: seed.y * height,
        phase: index * 1.3,
        amp: 7 + (index % 3) * 4,
      }));
    }

    function pointPosition(point: Point, time: number) {
      if (reduceMotion) {
        return { x: point.bx, y: point.by };
      }

      return {
        x: point.bx + Math.sin(time * 0.18 + point.phase) * point.amp,
        y: point.by + Math.cos(time * 0.14 + point.phase) * point.amp,
      };
    }

    function paint(now: number) {
      const time = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      const positions = points.map((point) => pointPosition(point, time));

      ctx.lineCap = "round";
      for (let i = 0; i < positions.length - 1; i += 1) {
        const a = positions[i];
        const b = positions[i + 1];
        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        gradient.addColorStop(0, "rgba(68,224,206,0.10)");
        gradient.addColorStop(1, "rgba(91,141,239,0.07)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      positions.forEach((point, index) => {
        const twinkle = reduceMotion
          ? 1
          : 0.6 + Math.sin(time * 0.7 + index) * 0.4;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,155,181,${0.5 * twinkle})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(68,224,206,${0.06 * twinkle})`;
        ctx.fill();
      });
    }

    function animate(now: number) {
      paint(now);

      if (!reduceMotion && !stopped) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    window.addEventListener("resize", resize);

    resize();
    start = performance.now();
    animationFrame = requestAnimationFrame(animate);

    if (reduceMotion) {
      paint(start);
    }

    return () => {
      stopped = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}
