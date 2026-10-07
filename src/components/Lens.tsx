import { useId, forwardRef } from "react";
import { apertureBlades, openToGeometry } from "@/lib/aperture";

export interface LensProps {
  /** 0 (nearly closed) to 1 (wide open). Animate later with tweenAperture(svg, from, to). */
  open?: number;
  n?: number;
  className?: string;
  /** Provide for a meaningful image; omit to hide from assistive tech. */
  title?: string;
}

/** The FocusLab lens. Blades carry data-blade and the opening carries data-hole so applyAperture() can drive them. */
export const Lens = forwardRef<SVGSVGElement, LensProps>(function Lens(
  { open = 0.45, n = 7, className, title },
  ref
) {
  const uid = useId().replace(/:/g, "");
  const { r, rot } = openToGeometry(open);
  const { blades, hole } = apertureBlades({ n, R: 100, r, rot });
  return (
    <svg
      ref={ref}
      viewBox="-124 -124 248 248"
      className={className}
      data-lens=""
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <radialGradient id={`${uid}-blade`} gradientUnits="userSpaceOnUse" cx="-18" cy="-24" r="150">
          <stop offset="0" stopColor="#555A64" />
          <stop offset=".38" stopColor="#262930" />
          <stop offset="1" stopColor="#0B0C0F" />
        </radialGradient>
        <radialGradient id={`${uid}-glass`} cx="50%" cy="42%" r="62%">
          <stop offset="0" stopColor="#3A3F9A" />
          <stop offset=".45" stopColor="#14173A" />
          <stop offset="1" stopColor="#05060D" />
        </radialGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F5F7" />
          <stop offset=".5" stopColor="#7C818C" />
          <stop offset="1" stopColor="#F4F5F7" />
        </linearGradient>
        <clipPath id={`${uid}-disc`}><circle r="100" /></clipPath>
      </defs>
      <circle r="119" fill="#0B0C0F" />
      <circle r="118" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.4" />
      <circle r="110" fill="none" stroke="#2A2D34" strokeWidth="5" />
      <circle r="104" fill="#07080B" />
      <g clipPath={`url(#${uid}-disc)`}>
        {blades.map((b, i) => (
          <path key={i} data-blade="" d={b.d} fill={`url(#${uid}-blade)`} stroke="rgba(255,255,255,.22)" strokeWidth=".55" strokeLinejoin="round" />
        ))}
      </g>
      <path data-hole="" d={hole} fill={`url(#${uid}-glass)`} stroke="rgba(255,255,255,.4)" strokeWidth=".7" />
      <circle r="100" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth=".7" />
      <circle r="113.2" fill="none" stroke="#C03CFF" strokeOpacity=".30" strokeWidth=".9" />
      <circle r="115.6" fill="none" stroke="#35FFA5" strokeOpacity=".24" strokeWidth=".7" />
      <circle r="107.4" fill="none" stroke="#FFB84A" strokeOpacity=".22" strokeWidth=".7" />
    </svg>
  );
});
