'use client';

import { useEffect, useState } from "react";
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: load intrinsic dimensions in browser to preserve aspect ratio
  function getImageDimensions(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = src;
    });
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/photos");
        const data = await res.json();
        const files = data.files || [];

        const photosWithDims = await Promise.all(
          files.map(async (filename) => {
            const src = `/photos/${filename}`;
            const { width, height } = await getImageDimensions(src);
            const aspect = height / width;
            return {
              src,
              alt: filename.replace(/\.[^/.]+$/, ""),
              width,
              height,
              srcSet: [
                { src, width: 1080, height: Math.round(1200 * aspect) },
                { src, width: 800, height: Math.round(800 * aspect) },
                { src, width: 600, height: Math.round(600 * aspect) },
                { src, width: 400, height: Math.round(400 * aspect) },
              ],
            };
          })
        );

        setPhotos(photosWithDims);
      } catch (e) {
        console.error("Failed to load photos", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="photo-album-container">
        <h2 className="photo-album-heading" style={{ marginBottom: '2rem' }}>Visual Feed</h2>
        <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>Loading photos...</div>
      </div>
    );
  }

  return (
    <div className="photo-album-container">
      <h2 className="photo-album-heading" style={{ marginBottom: '2rem' }}>Visual Feed</h2>
      <ColumnsPhotoAlbum
        photos={photos}
        columns={3}
        spacing={16}
        padding={0}
      />
    </div>
  );
}
