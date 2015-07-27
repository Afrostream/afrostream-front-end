export default function () {
  return {
    "controls": true,
    "width": "100%",
    "height": "100%",
    "autoplay": true,
    "sr_options": {
      "ID_CLIENT": "ry-0gzuhlor",
      "TRACKER_URL": "http://tracker.streamroot.io:80"
    },
    "techOrder": ["streamroot", "srflash", "hls", "html5", "flash"],
    "sources": [
      {
        "src": "http://origin.digibos.fr/media/digibos/Black.Dynamite.2009.ism/Black.Dynamite.2009.mpd",
        "type": "video/dash"
      },
      {
        "src": "http://origin.digibos.fr/media/digibos/Black.Dynamite.2009.ism/Black.Dynamite.2009.m3u8",
        "type": "application/x-mpegURL"
      }
    ]
  };
}