// GANTI DENGAN LINK VERCEL KAMU SETELAH DEPLOY
const PROXY_URL = "/proxy?url="; // Vercel otomatis pakai /api/proxy

const channels = {
  all: [
    { name: "RCTI HD", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000143/1024.m3u8", group: "mnc" },
    { name: "SCTV HD", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000144/1024.m3u8", group: "mnc" },
    { name: "ANTV HD", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000145/1024.m3u8", group: "mnc" },
    { name: "GTV HD", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000146/1024.m3u8", group: "mnc" },
    { name: "INEWS HD", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000147/1024.m3u8", group: "mnc" },
    { name: "TRANS TV", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000150/1024.m3u8", group: "lainnya" },
    { name: "TRANS 7", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000151/1024.m3u8", group: "lainnya" },
    { name: "NET. HD", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000152/1024.m3u8", group: "lainnya" },
    { name: "RTV HD", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000153/1024.m3u8", group: "lainnya" },
    { name: "TVKU", url: "http://202.80.222.20/cdn/iptv/Tvod/001/channel2000154/1024.m3u8", group: "lainnya" }
  ]
};

let player;
const video = document.getElementById('video-player');
const channelGrid = document.getElementById('channels');

function initPlayer() {
  player = videojs('video-player', {
    controls: true,
    fluid: true,
    html5: { hls: { withCredentials: false } }
  });
}

function renderChannels(category) {
  channelGrid.innerHTML = '';
  let list = category === 'all' ? channels.all : channels.all.filter(ch => ch.group === category);

  list.forEach((ch, i) => {
    const div = document.createElement('div');
    div.className = 'channel';
    div.textContent = ch.name;
    div.onclick = () => playChannel(ch.url, div);
    channelGrid.appendChild(div);

    if (i === 0) {
      setTimeout(() => playChannel(ch.url, div), 500);
    }
  });
}

function playChannel(rawUrl, element) {
  document.querySelectorAll('.channel').forEach(el => el.classList.remove('active'));
  element.classList.add('active');

  const proxyUrl = PROXY_URL + encodeURIComponent(rawUrl);

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(proxyUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => console.log("Play ditahan browser"));
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = proxyUrl;
    video.play();
  }
}

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderChannels(tab.dataset.category);
  };
});

// Init
initPlayer();
renderChannels('all');