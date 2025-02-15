import React, { useEffect, useRef } from "react";
import "../css/Splashscreen.css";
import gsap from "gsap";

const Splashscreen = ({ setSplashEnded }) => {
  const textRef = useRef(null);
  const loaderRef = useRef(null);
  const loadingScreenMainRef = useRef(null);

  useEffect(() => {
    if (loaderRef.current && textRef.current) {
      breakLoaderText(textRef.current);
      const tl = gsap.timeline({ onComplete: () => setSplashEnded(true) }); // Fix the onComplete callback

      // Set initial width to 0
      tl.set(loaderRef.current, { width: "0%" });

      // Animate width from 0% to 100%
      tl.to(loaderRef.current, {
        width: "100%",
        duration: 2,
        ease: "power2.out",
      });

      // Animate the text span elements
      tl.fromTo(
        textRef.current.querySelectorAll("span"),
        {
          opacity: 0,
          y: 50,
          display: "inline-block",
        },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          stagger: 0.05,
          ease: "power2.out",
        },
        "<"
      );

      // Fade out the splash screen
      tl.to(loadingScreenMainRef.current, {
        opacity: 0,
        duration: 1,
        delay: 1, // Add a delay to ensure it fades out after the text animation
      });
    }
  }, [setSplashEnded]);

  const breakLoaderText = (element) => {
    const textElement = element.innerText;
    const letters = textElement.split("");
    const cluster = letters.map((letter) => `<span>${letter}</span>`).join("");
    element.innerHTML = cluster;
  };

  return (
    <div
      ref={loadingScreenMainRef}
      className="w-full h-screen flex items-center justify-center flex-col gap-y-3"
    >
      <div className="mb-20 relative">
        <h1 ref={textRef} className="text-8xl">
          Jobly
        </h1>
      </div>
      <div ref={loaderRef} className="w-full inline-block h-1 loader"></div>
    </div>
  );
};

export default Splashscreen;
