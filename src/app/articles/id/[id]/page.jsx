'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Footer from '@/sections/Footer';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/das/firebase';

export default function ArticlePage({ params }) {
  const { id } = React.use(params);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArticle = async () => {
      try {
        const docRef = doc(db, 'articles', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle(docSnap.data());
        } else {
          setError('No such document!');
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };
    if (id) {
      getArticle();
    }
  }, [id]);

  if (error)
    return (
      <div className='container mt-5'>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );

  if (!article)
    return (
      <div className='container mt-5'>
        <h1>Loading..</h1>
      </div>
    );

  return (
    <>
      <Head>
        <title>{article.title} | Rohan Ghalib</title>
        <meta name='description' content={article.description} />
        <meta property='og:title' content={article.title} />
        <meta property='og:description' content={article.description} />
      </Head>
      <style>{`
    .img-blog {
      max-width: 100%;
      height: auto;
    }
  `}</style>
      <div className='container mt-5'>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <div>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {article.content}
          </ReactMarkdown>
        </div>
        <p>
          <i>Published: {article.published_at && article.published_at.seconds ? new Date(article.published_at.seconds * 1000).toLocaleDateString() : 'Unknown date'}</i>
        </p>
      </div>
      <Footer />
    </>
  );
}
