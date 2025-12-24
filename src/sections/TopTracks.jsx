'use client';

import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TopTracks() {
  const { data, error } = useSWR('/api/top-tracks', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            My Top Spotify Tracks
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Here's what I'm currently listening to.
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {data.tracks.map((track) => (
              <div key={track.songUrl} className="text-center">
                <a href={track.songUrl} target="_blank" rel="noopener noreferrer">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{track.title}</p>
                  <p className="text-md text-gray-500 dark:text-gray-400">{track.artist}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
