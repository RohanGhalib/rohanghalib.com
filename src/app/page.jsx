import Hero from "@/sections/Hero";
import AboutMe from "@/sections/AboutMe";
import Footer from "@/sections/Footer";

// Metadata for social media
export const metadata = {
  title: "Home - Rohan Ghalib's Portfolio",
  description: "Everything About Me 🙂",
  openGraph: {
    title: "Home - Rohan Ghalib's Portfolio",
    description: "Everything About Me 🙂",
    type: "website",
    url: "https://rohanghalib.com",
    images: [
      {
        url: "https://rohanghalib.com/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Rohan Ghalib Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Ghalib - Developer Portfolio",
    description: "Welcome to Rohan Ghalib's personal website. Explore projects, skills, and contact information.",
    images: ["https://rohanghalib.com/og-image.jpg"],
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutMe />
      <Footer />
    </>
  );
}
