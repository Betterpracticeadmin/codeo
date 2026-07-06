"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Curseur custom (cercle qui suit la souris et grossit au survol des liens).
// Uniquement sur desktop (pointeur fin) et si les animations sont autorisées.
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 25, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 350, damping: 25, mass: 0.5 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-none");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("a, button, input, textarea, select, [data-cursor]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("cursor-none");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ translateX: sx, translateY: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[100] -ml-3 -mt-3"
    >
      <motion.div
        animate={{ scale: hovering ? 2.4 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-6 w-6 rounded-full border mix-blend-difference"
        style={{ borderColor: "#ffffff" }}
      />
    </motion.div>
  );
}
