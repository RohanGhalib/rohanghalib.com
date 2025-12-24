import Hero from "@/sections/Hero";
import AboutMe from "@/sections/AboutMe";
import TopTracks from "@/sections/TopTracks";
import Footer from "@/sections/Footer";
import Link from "next/link";
import { db } from "@/app/das/firebase";
import { doc, getDoc } from "firebase/firestore";

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
    title: "Rohan Ghalib - Portfolio",
    description: "Welcome to Rohan Ghalib's personal website. Explore projects, skills, and contact information.",
    images: ["https://rohanghalib.com/profile.jpg"],
  },
};

async function getAboutMeContent() {
  const docRef = doc(db, 'siteContent', 'content');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().aboutMe;
  } else {
    console.log("No such document!");
    return "";
  }
}

export default async function Home() {
  const aboutMeContent = await getAboutMeContent();

  return (
    <>
      <Hero />
      <AboutMe content={aboutMeContent} />
      <TopTracks />
      <Footer />
    </>
  );
}
