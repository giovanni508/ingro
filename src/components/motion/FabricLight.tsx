"use client";

import { useEffect, useRef } from "react";
import { features } from "@/lib/site";

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

// Velvet folds (vertical, slightly wavy) lit by a soft moving follow-spot.
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;
float n(vec2 x){return fract(sin(dot(x,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float a=r.x/r.y;
  float x=uv.x*a*7.;
  float wave=sin(uv.y*3.1+t*.25)*.35+sin(uv.y*7.3-t*.18)*.12;
  float fold=sin(x+wave)*.5+.5;
  fold=pow(fold,1.6);
  float sheen=pow(sin(x*2.+wave*2.)*.5+.5,8.)*.25;
  vec2 c=vec2(m.x*a,m.y);
  float d=distance(vec2(uv.x*a,uv.y),c);
  float spot=smoothstep(.62,0.,d);
  vec3 base=vec3(.086,.039,.063);
  vec3 velvet=mix(vec3(.13,.03,.08),vec3(.34,.07,.2),fold);
  vec3 col=mix(base,velvet,.55+.45*spot);
  col+=vec3(1.,.86,.8)*sheen*spot;
  col+=vec3(1.,.93,.84)*spot*spot*.08;
  col*=.55+.45*smoothstep(1.2,.2,d);
  col+=(n(gl_FragCoord.xy+t)-.5)*.025;
  gl_FragColor=vec4(col,1.);
}`;

/**
 * Optional "light on fabric" shader behind a dark section. Desktop only
 * (fine pointer, ≥1024px, ≥4 cores, WebGL), never under reduced motion,
 * paused off-screen, rendered at reduced resolution. When any condition
 * fails, the section keeps its static velvet background.
 */
export function FabricLight({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !features.fabricShader) return;
    const ok =
      window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches &&
      (navigator.hardwareConcurrency ?? 0) >= 4;
    if (!ok) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");

    const SCALE = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.floor(canvas.clientHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uR, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const target = { x: 0.5, y: 0.6 };
    const cur = { x: 0.5, y: 0.6 };
    let pointerAt = 0;
    const host = canvas.parentElement!;
    const onMove = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      target.x = (e.clientX - b.left) / b.width;
      target.y = 1 - (e.clientY - b.top) / b.height;
      pointerAt = performance.now();
    };
    host.addEventListener("pointermove", onMove);

    let raf = 0;
    let visible = false;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      if (now - pointerAt > 2500) {
        target.x = 0.5 + Math.sin(t * 0.21) * 0.32;
        target.y = 0.55 + Math.sin(t * 0.13) * 0.18;
      }
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      gl.uniform1f(uT, t);
      gl.uniform2f(uM, cur.x, cur.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        canvas.style.opacity = "1";
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ${className}`} />;
}
