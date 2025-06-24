import React from 'react';
import Footer from '@/sections/Footer';
// Use Next.js fetch cache and server-side rendering
async function getArticles() {
  try {
    const res = await fetch('https://api.rohanghalib.com/fetch.php', {
      headers: { 'Accept': 'application/json' },
      // Next.js fetch options for SSR and caching
      cache: 'no-store', // or 'no-store' if you want always fresh
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    return { error: err.message + '. Please ensure the backend server is running and CORS is enabled.' };
  }
}

const ArticlesPage = async () => {
  const data = await getArticles();
  const articles = Array.isArray(data) ? data : [];
  const error = data.error;

  return (
    <>
    <div className="container mt-5 ">
      <h1>Articles</h1>
      {error && <div>Error: {error}</div>}
      <div className="row mt-2 d-flex justify-content-between">
        {articles.map((article, idx) => (
          <div
            key={article.id || idx}
            className="col-lg-4 mt-3 d-flex justify-content-start"
            style={{ cursor: 'pointer' }}
          >
            <a
              href={`/articles/id/${article.id || idx}`}
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              tabIndex={0}
              aria-label={`Read article: ${article.title}`}
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
            </a>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ArticlesPage;