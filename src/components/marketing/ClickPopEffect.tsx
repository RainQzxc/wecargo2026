"use client";

import { useEffect, useState } from "react";

type Pop = {
  id: number;
  x: number;
  y: number;
};

export default function ClickPopEffect() {
  const [pops, setPops] = useState<Pop[]>([]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || target.closest("a, button, input, textarea, select, label")) {
        return;
      }

      const id = window.performance.now();
      setPops((current) => [...current, { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setPops((current) => current.filter((pop) => pop.id !== id));
      }, 560);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {pops.map((pop) => (
        <span
          key={pop.id}
          className="click-pop absolute h-9 w-9 rounded-full border-2 border-[#06bbb4] bg-[#06bbb4]/10"
          style={{ left: pop.x, top: pop.y }}
        />
      ))}
    </div>
  );
}
