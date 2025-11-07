export default function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL tidak ditemukan');

  fetch(url, {
    headers: {
      'Referer': 'https://www.visionplustv.id/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'Origin': 'https://www.visionplustv.id'
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Stream error');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    response.body.pipe(res);
  })
  .catch(err => {
    res.status(502).send('Stream gagal: ' + err.message);
  });
}