
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  trigger: boolean;
  onDone?: () => void;
}

/**
 * Displays a burst of confetti whenever `trigger` becomes true.
 * Optionally calls `onDone` after the confetti animation ends.
 */
export const Celebration = ({ trigger, onDone }: CelebrationProps) => {
  useEffect(() => {
    if (trigger) {
      const duration = 1200;
      const end = Date.now() + duration;

      (function frame() {
        // Random burst confetti style
        confetti({
          particleCount: 45,
          angle: 76 + Math.random() * 28,
          spread: 70 + Math.random() * 25,
          origin: { x: Math.random(), y: 0.4 }
        });

        if (Date.now() < end) {
          setTimeout(frame, 170);
        } else if (onDone) {
          setTimeout(onDone, 200); // allow a bit of extra time for confetti to clear
        }
      })();
    }
  }, [trigger, onDone]);

  // Render nothing: this is a "headless" animation driven by canvas
  return null;
};
