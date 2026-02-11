import React from 'react';
import Footer from '@/sections/Footer';
import Link from 'next/link';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/das/firebase";

// Metadata for social media
// Metadata for social media
export const metadata = {
  title: "Articles",
  description: "Everything About Me 🙂 - Read my latest articles and thoughts.",
  openGraph: {
    title: "Articles | Rohan Ghalib",
    description: "Everything About Me 🙂 - Read my latest articles and thoughts.",
    url: "https://rohanghalib.com/articles",
    type: "website",
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

async function getArticles() {
  try {
    const articlesCol = collection(db, "articles");
    const articleSnapshot = await getDocs(articlesCol);
    const articles = articleSnapshot.docs.map(doc => {
      const data = doc.data();
      // Exclude heavy 'content' field
      const { content, ...rest } = data;

      // Serialize Firestore Timestamp to plain number (or null)
      // Next.js cannot pass complex objects like Timestamps to Client Components
      const serializedRest = {
        ...rest,
        published_at: rest.published_at?.seconds ? rest.published_at.seconds * 1000 : null,
        created_at: rest.created_at?.seconds ? rest.created_at.seconds * 1000 : null,
        updated_at: rest.updated_at?.seconds ? rest.updated_at.seconds * 1000 : null,
      };

      return { id: doc.id, ...serializedRest };
    });
    return articles;
  } catch (err) {
    return { error: err.message };
  }
}

export const revalidate = 60;

import ArticlesList from './ArticlesList';

const ArticlesPage = async () => {
  const data = await getArticles();
  const articles = Array.isArray(data) ? data : [];
  const error = data.error;

  return (
    <>
      <div className="container mt-5 ">
        <h1><Link style={{ textDecoration: 'none', color: 'inherit' }} href={"./"}> <i className="bi bi-arrow-left-circle-fill"></i> </Link>Articles</h1>
        {error && <div>Error: {error}</div>}

        <ArticlesList initialArticles={articles} />

      </div>
      <Footer />
    </>
  );
};

export default ArticlesPage;
