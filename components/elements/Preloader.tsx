"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide the preloader once the page has loaded. The state change is deferred
    // to the next frame so it never runs synchronously inside the effect.
    if (document.readyState === "complete") {
      const frame = requestAnimationFrame(() => setLoading(false));
      return () => cancelAnimationFrame(frame);
    }
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-wrap">
        <div className="preloader">
            <div id="handle-preloader" className="handle-preloader">
                <div className="layer layer-one">
                    <span className="overlay"></span>
                </div>
                <div className="layer layer-three">
                    <span className="overlay"></span>
                </div>
                <div className="layer layer-two">
                    <span className="overlay"></span>
                </div>
                <div className="animation-preloader">
                    <div className="spinner"></div>
                </div>
            </div>
        </div>
    </div>
  );
}
