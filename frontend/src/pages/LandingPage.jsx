import React from "react";
import DarkVeil from "../components/external/DarkVeil.jsx";
import SplitText from "../components/external/text-animation/SplitText.jsx";

const LandingPage = () => {
  return (
    <div className="w-screen h-screen font-[font] relative">
      <DarkVeil />
      <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative text-center">
              <div className="w-full">
                <div className="max-w-4xl mx-auto">
                  <SplitText
                    text="Your Personal Vault"
                    className="text-7xl text-white font-medium leading-tight"
                    delay={50}
                    duration={0.8}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />

                  <SplitText
                    text={"For\u00A0React\u00A0Components"}
                    className="text-7xl text-white font-medium -mt-2 leading-tight"
                    delay={50}
                    duration={0.8}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                </div>

                <div className="w-full mt-8 flex justify-center">
                  <SplitText
                    text={
                      "Upload, organize, and retrieve your components instantly with our CLI and dashboard"
                    }
                    className="text-lg text-white/90 font-light max-w-3xl leading-tight text-center"
                    delay={20}
                    duration={1}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default LandingPage;
