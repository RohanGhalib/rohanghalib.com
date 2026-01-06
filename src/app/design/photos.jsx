// List of images in the /photos folder
const imageFiles = [
  { filename: "1.png", alt: "Fahad Bhai", width: 1200, height: 800 },

];

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

// Convert image files to photo album format
const photos = imageFiles.map(({ filename, alt, width, height }) => {
  const src = `/photos/${filename}`;
  const aspectRatio = height / width;

  return {
    src,
    width,
    height,
    alt: alt || filename,
    srcSet: breakpoints
      .filter((breakpoint) => breakpoint <= width)
      .map((breakpoint) => ({
        src,
        width: breakpoint,
        height: Math.round(breakpoint * aspectRatio),
      })),
  };
});

export default photos;
