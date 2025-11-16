import React from "react";
import DarkVeil from "../components/external/DarkVeil.jsx";
import SplitText from "../components/external/text-animation/SplitText.jsx";

const LandingPage = () => {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };
  return (
    <div className="w-screen h-screen font-[font] relative">
      <DarkVeil />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative text-center">
              <div className="w-full">
                <div className="max-w-4xl mx-auto">
                  <SplitText
                    text="Your Personal Vault"
                    className="text-7xl text-white font-semibold leading-tight"
                    delay={50}
                    duration={0.8}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />

                  <SplitText
                    text={"For\u00A0React\u00A0Components"}
                    className="text-7xl text-white font-semibold -mt-2 leading-tight"
                    delay={50}
                    duration={0.8}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />
                </div>

                <div className="w-full mt-8 flex justify-center">
                  <SplitText
                    text={
                      "Upload, organize, and retrieve your components instantly with our CLI and dashboard"
                    }
                    className="text-xl text-white/90 font-medium max-w-3xl leading-relaxed text-center"
                    delay={200}
                    duration={0.6}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                    onLetterAnimationComplete={handleAnimationComplete}
                  />
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default LandingPage;
