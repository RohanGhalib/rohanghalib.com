"use client"
import React, { useEffect, useState } from 'react';

const ArticlesPage = () => {
 const [articles, setArticles] = useState([]);
 const [error, setError] = useState(null);

 useEffect(() => {
  fetch('https://rohanghalib.com/fetch.php', {
    headers: {
      'Accept': 'application/json'
    }
  })
   .then(res => {
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
   })
   .then(data => {
    setArticles(data);
   })
   .catch(err => {
    setError(err.message + '. Please ensure the backend server is running and CORS is enabled.');
    console.error(err);
   });
 }, []);

  return (
   <div className="container mt-5 ">
   <h1>Articles</h1>
   {error && <div>Error: {error}</div>}
   <div className="row mt-2 d-flex justify-content-between">
    {Array.isArray(articles) && articles.map((article, idx) => (
    <div
     key={idx}
     className="col-lg-4 mt-3 d-flex justify-content-start"
     style={{ cursor: 'pointer' }}
     onClick={() => {
     // Replace '/articles/' with your actual article route
     window.location.href = `/articles/${article.id || idx}`;
     }}
    >
     <div className="article-card">
     <h3>
      {article.title}
      <span className="arrow-icon float-end">
      <i className="bi bi-arrow-up-right-circle-fill"></i>
      </span>
     </h3>
     <p>
      {article.description && article.description.length > 110
      ? article.description.slice(0, 110) + " ..."
      : article.description}
     </p>
     <span className='float-bottom'><i>Published 23/06/23</i></span>
     </div>
    </div>
    ))}
   </div>
   </div>
  );
};

export default ArticlesPage;