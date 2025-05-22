// @/hooks/use-mobile.tsx
"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Default to false (desktop-first approach) to ensure server and initial client render match.
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render (post-hydration).
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set the correct value on the client after mount
    checkDevice();

    // Listen for resize events
    window.addEventListener("resize", checkDevice);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", checkDevice);
  }, []); // Empty dependency array ensures this effect runs only once on mount and unmount.

  return isMobile;
}
