'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TopTracks() {
  const { data, error } = useSWR('/api/top-tracks', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>My Top Tracks</h2>
      <div className="row">
        {data.tracks.map((track, index) => (
          <div className="col-lg-6" key={index}>
            <div className="card-project card-pink">
              <a href={track.songUrl} target="_blank" rel="noopener noreferrer">
                <h3 className='card-heading-dark'>{track.title}</h3>
                <p className='card-heading-dark'>{track.artist}</p>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
