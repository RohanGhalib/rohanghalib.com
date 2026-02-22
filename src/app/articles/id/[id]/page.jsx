import React from 'react';
import Footer from '@/sections/Footer';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/das/firebase';
import MarkdownRenderer from './MarkdownRenderer';
import ArticleReplyButton from '@/components/ArticleReplyButton';
import Link from 'next/link';
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

async function getRecentArticles(excludeId) {
  try {
    const articlesCol = collection(db, 'articles');
    const snapshot = await getDocs(articlesCol);
    let articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    articles = articles.filter(a => a.id !== excludeId);
    articles.sort((a, b) => {
      const dateA = a.published_at?.seconds || 0;
      const dateB = b.published_at?.seconds || 0;
      return dateB - dateA;
    });
    return articles.slice(0, 3);
  } catch (err) {
    console.error("Error fetching recent articles:", err);
    return [];
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

  const recentArticles = await getRecentArticles(id);

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

        {/* Reply Section */}
        <ArticleReplyButton articleTitle={article.title} />

        {/* Read More Section */}
        {recentArticles.length > 0 && (
          <div className="mt-5 pt-4 border-top">
            <h3 className="mb-4">Read More Articles by Me</h3>
            <div className="row">
              {recentArticles.map((recentArticle, idx) => (
                <div key={recentArticle.id || idx} className="col-lg-4 mt-3 d-flex justify-content-start" style={{ cursor: 'pointer' }}>
                  <Link href={`/articles/id/${recentArticle.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                    <div className="article-card h-100">
                      <h4>
                        {recentArticle.title}
                        <span className="arrow-icon float-end">
                          <i className="bi bi-arrow-up-right-circle-fill"></i>
                        </span>
                      </h4>
                      <p className="small mb-4">
                        {recentArticle.description && recentArticle.description.length > 110
                          ? recentArticle.description.slice(0, 110) + " ..."
                          : recentArticle.description}
                      </p>
                      <span className='float-bottom text-muted small mt-auto'>
                        <i>Published: {recentArticle.published_at && recentArticle.published_at.seconds ? new Date(recentArticle.published_at.seconds * 1000).toLocaleDateString('en-GB') : 'Unknown date'}</i>
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
