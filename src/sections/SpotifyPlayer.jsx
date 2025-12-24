'use client';

import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SpotifyPlayer() {
  const { data, error } = useSWR('/api/top-tracks', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="spotify-player-container">
      {data.tracks.map((track, index) => (
        <div key={index} className="spotify-track">
          <a href={track.songUrl} target="_blank" rel="noopener noreferrer">
            <img src={track.imageUrl} alt={`${track.title} by ${track.artist}`} />
            <div className="spotify-track-info">
              <p>{track.title}</p>
              <p>{track.artist}</p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}
