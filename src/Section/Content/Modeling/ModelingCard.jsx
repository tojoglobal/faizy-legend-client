const ModelingCard = ({ img, title, location, photographer }) => {
  return (
    <div className="relative w-full max-w-[320px] mx-auto group">
      {/* Main Card Container */}
      <div className="relative bg-[#232323] rounded-[15px] shadow-none transition-transform duration-500  group-hover:scale-[1.03]">
        {/* Gray right overlay UNDER the image */}
        <div
          className="absolute top-2 right-0 h-[95%] w-[18%] bg-[#707070] z-10 pointer-events-none rounded-r-[15px]"
          style={{ right: "-10px" }}
        ></div>

        <img
          src={`${import.meta.env.VITE_OPEN_APIURL}/${img}`}
          alt={title}
          className="w-full h-full rounded-[15px] object-cover z-20 relative"
          style={{ minHeight: "180px" }}
        />

        {/* Top-right 10px border */}
        <div className="absolute top-[10px]  right-[10px] z-30 flex">
          {/* Top border */}
          <div className="block h-[1px] bg-[#e5e5e5]  w-[60px] group-hover:min-w-[298px] transition-all duration-300"></div>
          {/* Right border */}
          <div className="block w-[1px] bg-[#e5e5e5] group-hover:h-[320px] h-[60px]   transition-all duration-300"></div>
        </div>
        {/* Bottom-left 10px border */}
        <div className="absolute bottom-[10px] left-[10px] z-30 flex flex-col items-start">
          {/* Left border */}
          <div className="block w-[1px] group-hover:h-[319px] h-[60px]  bg-[#e5e5e5] transition-all duration-300"></div>
          {/* Bottom border */}
          <div className="block h-[1px] group-hover:min-w-[298px] w-[60px]  bg-[#e5e5e5] transition-all duration-300"></div>
        </div>

        {/* Caption OVER the image */}
        <div className="absolute z-40 left-0 bottom-0 w-full px-5 pb-5 pt-12 flex flex-col items-start justify-end bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent">
          <div className="text-white font-bold text-[1.08rem] tracking-[1.2px] leading-tight mb-1 uppercase font-oswald drop-shadow">
            {title}
          </div>
          <div className="text-[#e5e5e5] text-[0.98rem] font-light tracking-wide drop-shadow">
            {location} | @ {photographer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelingCard;
