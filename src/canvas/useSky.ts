import { type RefObject, useEffect } from "react";

type CanvasRef = RefObject<HTMLCanvasElement | null>;

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  a: number;
  tw: number;
  tws: number;
  vx: number;
  vy: number;
  blue: boolean;
};

type NodePoint = {
  bx: number;
  by: number;
  d: number;
  star?: boolean;
};

type Edge = {
  a: number;
  b: number;
  delay: number;
};

const constellationNodes = [
  { x: 0.725, y: 0.27, d: 0, star: true },
  { x: 0.6, y: 0.4, d: 0.35 },
  { x: 0.83, y: 0.42, d: 0.3 },
  { x: 0.665, y: 0.57, d: 0.45 },
  { x: 0.875, y: 0.255, d: 0.28 },
  { x: 0.545, y: 0.265, d: 0.4 },
  { x: 0.915, y: 0.595, d: 0.5 },
  { x: 0.755, y: 0.715, d: 0.55 },
];

const constellationEdges = [
  [0, 1],
  [0, 4],
  [0, 5],
  [1, 3],
  [3, 7],
  [4, 2],
  [2, 6],
  [1, 2],
];

const edgeDuration = 1.1;
const edgeStagger = 0.14;

export function useSky(canvasRef: CanvasRef) {
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
    let stars: Star[] = [];
    let nodes: NodePoint[] = [];
    let edges: Edge[] = [];
    let northStar: NodePoint | undefined;
    let animationFrame = 0;
    let stopped = false;
    let start = performance.now();

    const mouse = {
      tx: 0,
      ty: 0,
      x: 0,
      y: 0,
    };

    function build() {
      stars = [];
      const count = Math.round((width * height) / 6200);

      for (let i = 0; i < count; i += 1) {
        const z = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.35 + z * 1.25,
          a: 0.22 + Math.random() * 0.5,
          tw: Math.random() * Math.PI * 2,
          tws: 0.3 + Math.random() * 0.7,
          vx: -(0.015 + z * 0.03),
          vy: 0.004 + z * 0.004,
          blue: Math.random() < 0.1,
        });
      }

      nodes = constellationNodes.map((node) => ({
        bx: node.x * width,
        by: node.y * height,
        d: node.d,
        star: node.star,
      }));
      edges = constellationEdges.map(([a, b], index) => ({
        a,
        b,
        delay: index * edgeStagger,
      }));
      northStar = nodes[0];
    }

    function resize() {
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      build();
    }

    function projectedPoint(node: NodePoint, parallax: { x: number; y: number }) {
      return {
        x: node.bx + parallax.x * node.d,
        y: node.by + parallax.y * node.d,
      };
    }

    function easeOut(value: number) {
      return 1 - (1 - value) ** 3;
    }

    function drawSpike(
      x: number,
      y: number,
      length: number,
      lineWidth: number,
      direction: "v" | "h" | "d1" | "d2",
    ) {
      let dx = 0;
      let dy = 0;

      if (direction === "v") {
        dy = 1;
      } else if (direction === "h") {
        dx = 1;
      } else if (direction === "d1") {
        dx = 0.707;
        dy = 0.707;
      } else {
        dx = 0.707;
        dy = -0.707;
      }

      [1, -1].forEach((side) => {
        const ex = x + dx * length * side;
        const ey = y + dy * length * side;
        const gradient = ctx.createLinearGradient(x, y, ex, ey);
        gradient.addColorStop(0, "rgba(255,244,225,0.85)");
        gradient.addColorStop(0.4, "rgba(240,201,135,0.35)");
        gradient.addColorStop(1, "rgba(240,201,135,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      });
    }

    function drawNorthStar(x: number, y: number, time: number) {
      const pulse = reduceMotion ? 1 : 1 + Math.sin(time * 1.1) * 0.1;
      const reveal = reduceMotion
        ? 1
        : Math.max(0, Math.min(1, (time - 0.2) / 1.4));

      const glow = ctx.createRadialGradient(x, y, 0, x, y, 95 * pulse);
      glow.addColorStop(0, `rgba(240,201,135,${0.42 * reveal})`);
      glow.addColorStop(0.25, `rgba(240,201,135,${0.16 * reveal})`);
      glow.addColorStop(1, "rgba(240,201,135,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 95 * pulse, 0, Math.PI * 2);
      ctx.fill();

      const length = 60 * pulse * reveal;
      drawSpike(x, y, length, 1.6, "v");
      drawSpike(x, y, length, 1.6, "h");
      drawSpike(x, y, length * 0.5, 1, "d1");
      drawSpike(x, y, length * 0.5, 1, "d2");

      const core = ctx.createRadialGradient(x, y, 0, x, y, 6 * pulse);
      core.addColorStop(0, `rgba(255,248,235,${reveal})`);
      core.addColorStop(0.5, `rgba(240,201,135,${reveal})`);
      core.addColorStop(1, "rgba(240,201,135,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, 6 * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    function paint(now: number) {
      const time = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const maxShift = 26;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const parallax = {
        x: mouse.x * maxShift,
        y: mouse.y * maxShift,
      };

      stars.forEach((star) => {
        if (!reduceMotion) {
          star.x += star.vx;
          star.y += star.vy;
          if (star.x < -2) {
            star.x = width + 2;
          }
          if (star.y > height + 2) {
            star.y = -2;
          }
        }

        const twinkle = reduceMotion
          ? 1
          : 0.7 + Math.sin(time * star.tws + star.tw) * 0.3;
        const x = star.x + parallax.x * star.z * 0.6;
        const y = star.y + parallax.y * star.z * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.blue
          ? `rgba(91,141,239,${star.a * twinkle})`
          : `rgba(234,241,251,${star.a * twinkle})`;
        ctx.fill();
      });

      ctx.lineCap = "round";
      edges.forEach((edge) => {
        const a = projectedPoint(nodes[edge.a], parallax);
        const b = projectedPoint(nodes[edge.b], parallax);
        const rawProgress = reduceMotion ? 1 : (time - edge.delay) / edgeDuration;
        const progress = Math.max(0, Math.min(1, rawProgress));

        if (progress <= 0) {
          return;
        }

        const endX = a.x + (b.x - a.x) * easeOut(progress);
        const endY = a.y + (b.y - a.y) * easeOut(progress);
        const shimmer = reduceMotion
          ? 0.5
          : 0.4 + Math.sin(time * 0.6 + edge.delay * 6) * 0.12;
        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        gradient.addColorStop(0, `rgba(68,224,206,${0.3 * shimmer})`);
        gradient.addColorStop(1, `rgba(91,141,239,${0.2 * shimmer})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      const nodeProgress = reduceMotion
        ? 1
        : Math.max(0, Math.min(1, (time - 0.5) / 1.6));
      nodes.slice(1).forEach((node, index) => {
        const point = projectedPoint(node, parallax);
        const pulse = reduceMotion
          ? 1
          : 0.7 + Math.sin(time * 0.8 + index + 1) * 0.3;

        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(68,224,206,${0.85 * nodeProgress * pulse})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(68,224,206,${0.1 * nodeProgress})`;
        ctx.fill();
      });

      if (northStar) {
        drawNorthStar(northStar.bx, northStar.by, time);
      }
    }

    function animate(now: number) {
      paint(now);

      if (!reduceMotion && !stopped) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      mouse.tx = event.clientX / window.innerWidth - 0.5;
      mouse.ty = event.clientY / window.innerHeight - 0.5;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
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
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}
