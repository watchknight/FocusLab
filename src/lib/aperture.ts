export type Pt = [number, number];
export interface ApertureOpts { n?: number; R?: number; r?: number; rot?: number }
export interface Blade { d: string; angle: number; apex: Pt }

/** Tangent-line iris: n blades, outer radius R, opening radius r, rotation rot (radians). */
export function apertureBlades({ n = 7, R = 100, r = 20, rot = 0 }: ApertureOpts = {}) {
  const step = (Math.PI * 2) / n;
  const rho = r / Math.cos(Math.PI / n);
  const alpha = Math.acos(Math.min(1, r / R));
  const pt = (rad: number, ang: number): Pt => [rad * Math.cos(ang), rad * Math.sin(ang)];
  const V: Pt[] = [];
  const O: Pt[] = [];
  for (let k = 0; k < n; k++) {
    const th = rot + k * step;
    V.push(pt(rho, th + step / 2));
    O.push(pt(R, th + alpha));
  }
  const f = (p: Pt) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const blades: Blade[] = [];
  for (let k = 0; k < n; k++) {
    const prev = (k - 1 + n) % n;
    const a0 = rot + prev * step + alpha;
    const a1 = rot + k * step + alpha;
    blades.push({ d: `M${f(V[prev])} L${f(O[prev])} A${R} ${R} 0 0 1 ${f(O[k])} Z`, angle: (a0 + a1) / 2, apex: V[prev] });
  }
  return { blades, hole: `M${V.map(f).join(" L")} Z`, V };
}

/** open: 0 (nearly closed) to 1 (wide open). */
export const openToGeometry = (open: number) => ({ r: 8 + open * 62, rot: -0.35 + open * 0.55 });

/** Update an <svg> that contains [data-blade] paths and one [data-hole] path. */
export function applyAperture(svg: SVGSVGElement, open: number, n = 7) {
  const { r, rot } = openToGeometry(open);
  const { blades, hole } = apertureBlades({ n, R: 100, r, rot });
  svg.querySelectorAll<SVGPathElement>("[data-blade]").forEach((p, i) => p.setAttribute("d", blades[i].d));
  svg.querySelector<SVGPathElement>("[data-hole]")?.setAttribute("d", hole);
}
