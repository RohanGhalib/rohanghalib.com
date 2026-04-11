import Hero from "@/sections/Hero";
import AboutMe from "@/sections/AboutMe";
import Footer from "@/sections/Footer";
import Link from "next/link";
import { db } from "@/app/das/firebase";
import { doc, getDoc } from "firebase/firestore";

// Metadata for social media
// Metadata for social media
export const metadata = {
  title: "Home", // Will become "Home | Rohan Ghalib" via template
  // Description falls back to layout.js if not specified, 
  // but keeping a specific one for home is good practice.
  description: "Everything About Me 🙂 - Rohan Ghalib's Personal Portfolio",
  openGraph: {
    title: "Home | Rohan Ghalib",
    description: "Everything About Me 🙂 - Welcome to my personal portfolio.",
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
      <Footer />
    </>
  );
}
