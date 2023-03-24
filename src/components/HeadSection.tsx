import React, { useEffect } from "react";
import Typed from "typed.js";

export const HeadSection = () => {
  useEffect(() => {
    new Typed(".typing-element", {
      strings: ["Personalize Your Event Tickets with AI-Generated Art"],
      typeSpeed: 50,
      startDelay: 1000,
      showCursor: true,
    });
  }, []);

  return (
    <div className="flex items-center justify-center h-24 md:h-48 text-white text-center">
      <h1 className="text-xl mx-10 md:text-5xl font-bold typing-element"></h1>
    </div>
  );
};
