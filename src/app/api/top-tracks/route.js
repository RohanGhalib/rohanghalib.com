import { getTopTracks } from '@/lib/spotify';

export async function GET(request) {
  const response = await getTopTracks();
  const { items } = await response.json();

  const tracks = items.slice(0, 10).map((track) => ({
    artist: track.artists.map((_artist) => _artist.name).join(', '),
    songUrl: track.external_urls.spotify,
    title: track.name,
  }));

  return new Response(JSON.stringify({ tracks }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
