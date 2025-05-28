const YoutubeShortsMockup = ({ videoUrl, title = "HEARVIEW GLASSES" }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mockup-phone border-2 border-gray-700 bg-black w-64 h-[480px] relative overflow-hidden">
        <div className="mockup-phone-camera absolute left-1/2 -translate-x-1/2 top-2 w-8 h-2 bg-gray-800 rounded-b-xl"></div>
        <div className="mockup-phone-display p-0 flex flex-col h-full w-full relative overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={videoUrl}
            title={title}
            frameBorder="0"
            allow="autoplay; fullscreen"
          ></iframe>
        </div>
      </div>
      <div className="mt-5 text-white font-bold tracking-widest text-lg uppercase md:text-xl">
        {title}
      </div>
    </div>
  );
};

export default YoutubeShortsMockup;
