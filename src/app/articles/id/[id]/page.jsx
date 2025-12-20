"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

const Footer = dynamic(() => import('@/sections/Footer'), { loading: () => <p>Loading...</p> });

export default function ArticlePage({ params }) {
  const { id } = React.use(params); // Unwrap the params Promise
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.rohanghalib.com/fetch.php?content=true&id=${id}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setArticle(data))
      .catch((err) => {
        setError(
          err.message +
            ". Please ensure the backend server is running and CORS is enabled."
        );
        console.error(err);
      });
  }, [id]);

  if (error)
    return (
      <div className="container mt-5">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );

  if (!article)
    return (
      <div className="container mt-5">
        <h1>Loading..</h1>
      </div>
    );

  // Import a markdown parser

  return (
    <>
    <Head>
  <title>{article.title} | Rohan Ghalib</title>
  <meta name="description" content={article.description} />
  <meta property="og:title" content={article.title} />
  <meta property="og:description" content={article.description} />
</Head>
  <style>{`
    .img-blog {
      max-width: 100%;
      height: auto;
    }
  `}</style>
  <div className="container mt-5">
    <h1>{article.title}</h1>
    <p>{article.description}</p>
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{}}
      >
        {article.content}
      </ReactMarkdown>
    </div>
    <p>
      <i>Published: {article.published_at || "Unknown date"}</i>
    </p>
  </div>
  <Footer />
    </>
  );
}
