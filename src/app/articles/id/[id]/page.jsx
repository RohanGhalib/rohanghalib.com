import React from 'react';
import Footer from '@/sections/Footer';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/das/firebase';
import MarkdownRenderer from './MarkdownRenderer';

// Helper function to fetch article data
async function getArticle(id) {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error("Error fetching article:", err);
    return null;
  }
}

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const { id } = await params; // Await params in Next.js 15+
  const article = await getArticle(id);

  if (!article) {
    return {
      title: 'Article Not Found - Rohan Ghalib',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: article.title, // Template will add " | Rohan Ghalib"
    description: article.description,
    openGraph: {
      title: article.title, // OG titles usually don't need the site name suffix if branding is strong, but manual control is fine
      description: article.description,
      type: 'article',
      publishedTime: article.published_at?.seconds ? new Date(article.published_at.seconds * 1000).toISOString() : undefined,
      url: `https://rohanghalib.com/articles/id/${id}`,
      images: [
        {
          url: 'https://rohanghalib.com/profile.jpg', // Default image or article specific if available
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { id } = await params; // Await params in Next.js 15+
  const article = await getArticle(id);

  if (!article) {
    return (
      <div className='container mt-5'>
        <h1>Article Not Found</h1>
        <p>The requested article does not exist or has been removed.</p>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className='container mt-5'>
        <h1>{article.title}</h1>
        <p className="lead">{article.description}</p>
        <hr />
        <MarkdownRenderer content={article.content} />
        <p className="mt-4 text-muted">
          <i>Published: {article.published_at && article.published_at.seconds ? new Date(article.published_at.seconds * 1000).toLocaleDateString() : 'Unknown date'}</i>
        </p>
      </div>
      <Footer />
    </>
  );
}
