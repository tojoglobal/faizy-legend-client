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
    name: "Cooking with MasterChef",
    stream:
      "https://dai.google.com/linear/hls/event/Sid4xiTQTkCT1SLu6rjUSQ/master.m3u8",
    type: "recorded",
    category: "Food",
  },
  {
    name: "Tears of Steel",
    stream:
      "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
    backup: "",
    type: "recorded",
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
];

export default channels;
