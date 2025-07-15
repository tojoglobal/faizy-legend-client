const channels = [
  {
    name: "DW News",
    stream:
      "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    backup:
      "https://dwstream6-lh.akamaihd.net/i/dwstream6_live@123962/master.m3u8",
    type: "live",
  },
  {
    name: "Bloomberg TV",
    stream: "https://www.bloomberg.com/media-manifest/streams/asia.m3u8",
    backup: "https://bloomberg-bloombergtv-1-eu.rakuten.wurl.tv/playlist.m3u8",
    type: "live",
  },
  {
    name: "Al Jazeera English",
    stream: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
    backup:
      "https://aljazeera-eng-hls-live.akamaized.net/hls/live/2003681/aljazeera-eng/index.m3u8",
    type: "live",
  },
  {
    name: "Arirang TV",
    stream:
      "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8",
    backup:
      "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/chunklist_b2592000_sleng.m3u8",
    type: "live",
  },
  {
    name: "Classic Movies",
    stream:
      "https://dai.google.com/linear/hls/event/Sid4xiTQTkCT1SLu6rjUSQ/master.m3u8",
    type: "live",
    category: "Movies",
  },
  {
    name: "Cooking with MasterChef",
    stream:
      "https://dai.google.com/linear/hls/event/Sid4xiTQTkCT1SLu6rjUSQ/master.m3u8",
    type: "live",
    category: "Food",
  },
  {
    name: "Lofi Hip Hop Radio",
    stream: "https://www.youtube.com/embed/jfKfPfyJRdk",
    type: "live",
    category: "Music",
    isYoutube: true,
  },
  {
    name: "Tears of Steel",
    stream:
      "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    backup: "",
    type: "recorded",
  },
  {
    name: "Veritasium",
    stream: "https://www.youtube.com/embed/BLOUFrncG7E",
    type: "recorded",
    category: "Science",
    isYoutube: true,
  },
  {
    name: "3Blue1Brown",
    stream: "https://www.youtube.com/embed/WUvTyaaNkzM",
    type: "recorded",
    category: "Math",
    isYoutube: true,
  },
  {
    name: "Big Buck Bunny (Blender Foundation)",
    stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    backup: "",
    type: "recorded",
    category: "Animated Short Film",
  },
  {
    name: "Sintel (Blender Foundation)",
    stream: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    backup: "",
    type: "recorded",
    category: "Animated Short Film",
  },
  {
    name: "TED-Ed Animations",
    stream: "https://www.youtube.com/embed/rBpaUICxEhk",
    type: "recorded",
    category: "Education",
    isYoutube: true,
  },
  {
    name: "National Geographic Shorts",
    stream: "https://www.youtube.com/embed/6lt2JfJdGSY",
    type: "recorded",
    category: "Documentary",
    isYoutube: true,
  },
  {
    name: "PBS Space Time",
    stream: "https://www.youtube.com/embed/7uiv6tKtoKg",
    type: "recorded",
    category: "Science",
    isYoutube: true,
  },
];

export default channels;
