/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";

const AdsBanner = () => {
  const [adStatus, setAdStatus] = useState("loading");
  const adInitialized = useRef(false);

  useEffect(() => {
    const adElement = document.querySelector(
      '.adsbygoogle[data-ad-slot="9448608399"]'
    );

    if (window.adsbygoogle && !adInitialized.current) {
      adInitialized.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});

        // Check ad status every 500ms for 3 seconds
        const checkInterval = setInterval(() => {
          const status = adElement?.getAttribute("data-ad-status");
          if (status === "filled") setAdStatus("loaded");
          else if (status === "unfilled") setAdStatus("unfilled");
        }, 500);

        const timeout = setTimeout(() => {
          clearInterval(checkInterval);
          if (adStatus === "loading") setAdStatus("unfilled");
        }, 3000);

        return () => {
          clearInterval(checkInterval);
          clearTimeout(timeout);
        };
      } catch (e) {
        console.log(e);
        setAdStatus("error");
      }
    }
  }, []);

  return (
    <div className="relative w-full min-h-[190px]">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "180px" }}
        data-ad-client="ca-pub-3713767832812238"
        data-ad-slot="9448608399"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {adStatus === "unfilled" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-500 text-sm">
            Ad space available (no ads served yet)
          </span>
        </div>
      )}

      {adStatus === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <span className="text-gray-500 text-sm">Ad loading failed</span>
        </div>
      )}
    </div>
  );
};

export default AdsBanner;
