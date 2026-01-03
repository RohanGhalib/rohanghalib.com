// List of images in the /photos folder
const imageFiles = [
  { filename: "dasda.png", alt: "Dasda", width: 800, height: 600 },
  { filename: "fahad bhai@2x.png", alt: "Fahad Bhai", width: 1200, height: 800 },
  { filename: "mainpost@2x.png", alt: "Main Post", width: 1200, height: 800 },
  { filename: "Screenshot 2025-12-02 214958.png", alt: "Screenshot", width: 1920, height: 1080 },
  { filename: "WhatsApp Image 2025-12-04 at 3.52.59 PM (1).jpeg", alt: "Photo 1", width: 1600, height: 1200 },
  { filename: "WhatsApp Image 2025-12-04 at 3.53.00 PM (2).jpeg", alt: "Photo 2", width: 1600, height: 1200 },
  { filename: "WhatsApp Image 2025-12-04 at 3.53.04 PM.jpeg", alt: "Photo 3", width: 1600, height: 1200 },
  { filename: "WhatsApp Image 2025-12-04 at 3.53.07 PM (1).jpeg", alt: "Photo 4", width: 1600, height: 1200 },
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
