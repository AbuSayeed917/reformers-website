import type { SVGProps } from "react";
import { brand } from "@/config/brand";

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={brand.mark.viewBox}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {brand.mark.parts.map((part) => (
        <path key={part.id} data-part={part.id} d={part.path} />
      ))}
    </svg>
  );
}
