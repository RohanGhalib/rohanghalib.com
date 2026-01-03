'use client';
import { useState, useEffect } from 'react';
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

// List of image filenames in the /photos folder
const imageFiles = [
  "dasda.png",
  "fahad bhai@2x.png",
  "mainpost@2x.png",
  "Screenshot 2025-12-02 214958.png",
  "WhatsApp Image 2025-12-04 at 3.52.59 PM (1).jpeg",
  "WhatsApp Image 2025-12-04 at 3.53.00 PM (2).jpeg",
  "WhatsApp Image 2025-12-04 at 3.53.04 PM.jpeg",
  "WhatsApp Image 2025-12-04 at 3.53.07 PM (1).jpeg",
];

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

// Function to get image dimensions
function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const photoPromises = imageFiles.map(async (filename) => {
          const src = `/photos/${filename}`;
          const { width, height } = await getImageDimensions(src);
          const aspectRatio = height / width;

          return {
            src,
            width,
            height,
            alt: filename.replace(/\.[^/.]+$/, ""), // Remove file extension for alt text
            srcSet: breakpoints
              .filter((breakpoint) => breakpoint <= width)
              .map((breakpoint) => ({
                src,
                width: breakpoint,
                height: Math.round(breakpoint * aspectRatio),
              })),
          };
        });

        const loadedPhotos = await Promise.all(photoPromises);
        setPhotos(loadedPhotos);
        setLoading(false);
      } catch (error) {
        console.error('Error loading photos:', error);
        setLoading(false);
      }
    }

    loadPhotos();
  }, []);

  if (loading) {
    return (
      <div className="photo-album-wrapper">
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading photos...</div>
      </div>
    );
  }

  return (
    <div className="photo-album-wrapper">
      <h2 className="photo-album-heading">My Captures</h2>
      <RowsPhotoAlbum photos={photos} />
    </div>
  );
}
