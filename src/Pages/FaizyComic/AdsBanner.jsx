import { useEffect } from "react";

const AdsBanner = () => {
  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsense error", e);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block rounded"
      style={{ display: "block", width: "100%", height: "190px" }}
      data-ad-client="ca-pub-3713767832812238"
      data-ad-slot="9448608399"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdsBanner;
